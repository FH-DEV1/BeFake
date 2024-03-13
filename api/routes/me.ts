import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { refreshDataType } from '../types/Types';

const domain = process.env.DOMAIN

export const getSelf = async (req: Request, res: Response, next: NextFunction) => {
    let refresh_token: string | undefined = req.headers.refresh_token as string;
    let token: string | undefined = req.headers.token as string;
    let token_expiration: string | undefined = req.headers.token_expiration as string;
    let refreshData: refreshDataType | undefined = undefined
    try {
        if (token && refresh_token && token_expiration) {
            const now = Date.now();
            if (now > parseInt(token_expiration)) {
                const response = await axios.get(`${domain}/api/refresh`, {
                    headers: {
                        refresh_token: refresh_token
                    }
                });
                refreshData = response.data;
                token = response.data.token;
            }
            const response = await axios.get('https://mobile.bereal.com/api/person/me', {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'bereal-app-version-code': '14549',
                    'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
                    'bereal-timezone': 'Europe/Paris',
                    'bereal-device-id': '937v3jb942b0h6u9'
                }
            });

            res.locals.reponse = { data: response.data, refresh_data: refreshData }

            return next();

        } else {
            return res.status(400).json({ error: `Error: token, token_expiration, refresh_token, or userId is undefined` });
        }
    } catch (error: any) {
        if (error.response.data) {
            return res.status(400).json({ error: error.response.data });
        } else {
            return res.status(400).json({ error: error });
        }
    }
};