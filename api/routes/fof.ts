import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { refreshDataType } from '../types/Types';

// Retrieve domain from environment variables
const domain: string | undefined = process.env.DOMAIN;

// Middleware function to fetch data
export const getData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | null = req.headers.token as string;
        let tokenExpiration: string | null = req.headers.token_expiration as string;
        let refreshToken: string | null = req.headers.refresh_token as string;
        let refreshData: refreshDataType | undefined = undefined;
        let data: any[] = [];

        // Check if necessary headers are present
        if (token && tokenExpiration && refreshToken) {
            const now = Date.now();
   
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
            // If any of the required headers is missing, return an error response
            return res.status(400).json({ error: 'Error: token, token_expiration, or refresh_token is undefined' });
        }

        let nextPage: string | null = 'https://mobile.bereal.com/api/feeds/friends-of-friends';
        
        // Fetch data from multiple pages if pagination exists
        while (nextPage) {
            const response: any = await axios.get(nextPage, {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'bereal-app-version-code': '14549',
                    'bereal-signature': 'MToxNzEwOTU4NjQxOpg0j8sNuUN6oL3/h9GtyvzOPwPz1Rqf+euE+QfDPQlA',
                    'bereal-device-id': 'XKFg0Nkarwqyds17',
                    'bereal-timezone': 'Europe/Paris'
                }
            });

            data = data.concat(response.data.data);
            nextPage = response.data.next ? `https://mobile.bereal.com/api/feeds/friends-of-friends?page=${response.data.next}` : null;
        }

        // Attach fetched data to response locals
        if (refreshData) {
            res.locals.response = { data: data, refresh_data: refreshData };
        } else {
            res.locals.response = { data: data };
        }

        // Move to the next middleware
        return next();
    } catch (error: any) {
        // Handle errors
        if (error.response && error.response.data) {
            return res.status(400).json({ error: error.response.data });
        } else {
            return res.status(400).json({ error: error });
        }
    }
};
