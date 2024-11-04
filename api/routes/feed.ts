import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { refreshDataType } from '../types/Types';

const domain: string | undefined = process.env.DOMAIN;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const fetchSignature = async (i = 0) => {
    try {
        const res = await axios.get("https://sig.beunblurred.co/get?token=sOWSRnugxI");
        return res.data;
    } catch (e) {
        if (i < 3) {
            await sleep(250);
            return await fetchSignature(i + 1);
        } else {
            throw e;
        }
    }
};

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
    let refreshData: refreshDataType | undefined;
    let token: string | undefined = req.headers.token as string;
    let token_expiration: string | undefined = req.headers.token_expiration as string;
    let refresh_token: string | undefined = req.headers.refresh_token as string;

    if (token && token_expiration && refresh_token) {
        const now = Date.now();
        if (now > parseInt(token_expiration)) {
            await axios.get(`${domain}/api/refresh`, {
                headers: {
                    refresh_token: refresh_token
                }
            }).then(response => {
                refreshData = response.data;
                token = response.data.token;
            }).catch(error => {
                return res.status(400).json({ error: {message: "Error refreshing token", error: error.response.data} });
            });
        }
    } else if (!token) {
        return res.status(400).json({ error: 'Error: token is undefined' });
    } else if (!token_expiration) {
        return res.status(400).json({ error: 'Error: token_expiration is undefined' });
    } else if (!refresh_token) {
        return res.status(400).json({ error: 'Error: refresh_token is undefined' });
    } else {
        return res.status(400).json({ error: 'Error: Impossible error' });
    }

    await axios.get('https://mobile.bereal.com/api/feeds/friends-v1', {
        headers: {
            'authorization': `Bearer ${token}`,
            "bereal-signature": (await fetchSignature()),
            "bereal-device-id": "937v3jb942b0h6u9",
            "bereal-timezone": "Europe/Paris",
        }
    }).then(response => {
        if (refreshData) {
            res.locals.response = { feed: response.data, refreshData: refreshData };
        } else {
            res.locals.response = { feed: response.data };
        }
        return next();
    }).catch(error => {
        return res.status(400).json({ error: error.response.data, refreshData: refreshData });
    });
};