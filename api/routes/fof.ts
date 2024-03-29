import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { refreshDataType } from '../types/Types';

const domain: string | undefined = process.env.DOMAIN;

export const getData = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | null = req.headers.token as string;
    let token_expiration: string | null = req.headers.token_expiration as string;
    let refresh_token: string | null = req.headers.refresh_token as string;
    let refreshData: refreshDataType | undefined = undefined;

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

    let nextPage: string | null = 'https://mobile.bereal.com/api/feeds/friends-of-friends';
    let data: any[] = [];
        
    try {
        while (nextPage) {
            const response: any = await axios.get(nextPage, {
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
            });

            data = data.concat(response.data.data);
            nextPage = response.data.next ? `https://mobile.bereal.com/api/feeds/friends-of-friends?page=${response.data.next}` : null;
        }
        if (refreshData) {
            res.locals.response = { data: data, refresh_data: refreshData };
        } else {
            res.locals.response = { data: data };
        }
        return next();
    } catch (error) {
        return res.status(400).json({ error: error.response.data, refreshData: refreshData });
    }
};
