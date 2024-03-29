import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { refreshDataType } from '../../types/Types';

const domain: string | undefined = process.env.DOMAIN;

export const reactRealmoji = async (req: Request, res: Response, next: NextFunction) => {
    try {
        JSON.parse(req.body)
    } catch {
        return res.status(400).json({ error: 'Error: request body is missing' });
    }
    
    let refreshData: refreshDataType | undefined;
    let token: string | undefined = req.headers.token as string;
    let token_expiration: string | undefined = req.headers.token_expiration as string;
    let refresh_token: string | undefined = req.headers.refresh_token as string;
    let postId: string | undefined = req.headers.postid as string;
    let userId: string | undefined = req.headers.userid as string;
    let emoji: string | undefined = JSON.parse(req.body).emoji as string;

    if (token && token_expiration && refresh_token && postId && userId && emoji) {
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
                return res.status(400).json({ error: { message: 'Error refreshing token', error: error.response.data }});
            })
        }
    } else if (!token) {
        return res.status(400).json({ error: 'Error: token is undefined' });
    } else if (!token_expiration) {
        return res.status(400).json({ error: 'Error: token_expiration is undefined' });
    } else if (!refresh_token) {
        return res.status(400).json({ error: 'Error: refresh_token is undefined' });
    } else if (!postId) {
        return res.status(400).json({ error: 'Error: postId is undefined' });
    } else if (!userId) {
        return res.status(400).json({ error: 'Error: userId is undefined' });
    } else if (!emoji) {
        return res.status(400).json({ error: 'Error: emoji is undefined' });
    } else {
        return res.status(400).json({ error: 'Error: Impossible error' });
    }

    await axios.put(`https://mobile.bereal.com/api/content/realmojis?postId=${postId}&postUserId=${userId}`, {
            emoji: emoji,
        }, {
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
            },
        },
    ).then(response => {
        if (refreshData) {
            res.locals.response = { data: response.data, refresh_data: refreshData };
        } else {
            res.locals.response = { data: response.data };
        }
        return next();
    }).catch(error => {
        return res.status(400).json({ error: error.response.data, refresh_data: refreshData });
    })
}