import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { refreshDataType } from '../types/Types';

const domain = process.env.DOMAIN

export const getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | null = req.headers.token as string;
        let tokenExpiration: string | null = req.headers.token_expiration as string;
        let refreshToken: string | null = req.headers.refresh_token as string;
        let refreshData: refreshDataType | undefined = undefined;
        let data: any[] = [];

        if (token && tokenExpiration && refreshToken) {
            let now = Date.now();
   
            if (now > parseInt(tokenExpiration)) {
                const response = await axios.get(`${domain}/api/refresh`, {
                    headers: {
                        refresh_token: refreshToken
                    }
                });

                refreshData = response.data;
                token = response.data.token;
            }
        } else {
            return res.status(400).json({ error: `Error: token, token_expiration, or refresh_token is undefined` });
        }

        let nextPage: string | null = 'https://mobile.bereal.com/api/feeds/friends-of-friends';
        
        while (nextPage) {
            const response: any = await axios.get(nextPage, {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'bereal-app-version-code': '14549',
                    'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
                    'bereal-timezone': 'Europe/Paris',
                    'bereal-device-id': '937v3jb942b0h6u9'
                }
            });

            data = data.concat(response.data.data);
            nextPage = response.data.next ? `https://mobile.bereal.com/api/feeds/friends-of-friends?page=${response.data.next}` : null;
        }

        res.locals.response = {data: data, refresh_data: refreshData}

        return next();
    } catch (error: any) {
        if (error.response.data) {
            return res.status(400).json({ error: error.response.data });
        } else {
            return res.status(400).json({ error: error });
        }
    }
};
