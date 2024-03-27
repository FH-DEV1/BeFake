import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { refreshDataType } from '../types/Types';

const domain: string | undefined = process.env.DOMAIN;

export const getSelf = async (req: Request, res: Response, next: NextFunction) => {
    let refresh_token: string | undefined = req.headers.refresh_token as string;
    let token: string | undefined = req.headers.token as string;
    let token_expiration: string | undefined = req.headers.token_expiration as string;
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
            
    await axios.get('https://mobile.bereal.com/api/person/me', {
        headers: {
            'authorization': `Bearer ${token}`,
            'bereal-app-version-code': '14549',
            'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
            'bereal-timezone': 'Europe/Paris',
            'bereal-device-id': '937v3jb942b0h6u9'
        }
    }).then(response => {
        if (refreshData) {
            console.log(response.data.id, token);
            res.locals.response = { data: response.data, refresh_data: refreshData };
        } else {
            res.locals.response = { data: response.data };
        }
        return next();
    }).catch(error => {
        return res.status(400).json({ error: error.response.data, refreshData: refreshData });
    })
};