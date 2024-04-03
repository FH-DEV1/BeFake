import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { refreshDataType } from '../types/Types';

const domain: string | undefined = process.env.DOMAIN;

export const getMemories = async (req: Request, res: Response, next: NextFunction) => {
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

    await axios.get('https://mobile.bereal.com/api/feeds/memories', {
        headers: {
            'Bereal-Device-Language': 'fr',
            'Bereal-App-Version': '2.2.0',
            'Bereal-App-Version-Code': '15558',
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Bereal-Platform': 'iPadOS',
            'Bereal-Os-Version': '17.3',
            'Accept-Language': 'fr-FR;q=1.0',
            'Accept-Encoding': 'gzip, deflate, br',
            'Bereal-Device-Id': process.env.DEVICEID,
            'User-Agent': 'BeReal/2.2.0 (AlexisBarreyat.BeReal; build:15558; iOS 17.3.0)',
            'Bereal-App-Language': 'fr-FR',
            'Bereal-Timezone': 'Europe/Paris',
            'Bereal-Signature': process.env.SIGNATURE
        }
    }).then(response => {
        if (refreshData) {
            res.locals.response = { data: response.data, refreshData: refreshData };
        } else {
            res.locals.response = { data: response.data };
        }
        return next();
    }).catch(error => {
        console.log('Error', error)
        return res.status(400).json({ error: error.response.data, refreshData: refreshData });
    });
};