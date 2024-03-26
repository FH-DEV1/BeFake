import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { refreshDataType } from '../types/Types';

// Retrieve domain from environment variables
const domain: string | undefined = process.env.DOMAIN;

// Middleware function to fetch profiles
export const profiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let refreshData: refreshDataType | undefined;
        let token: string | undefined = req.headers.token as string;
        let token_expiration: string | undefined = req.headers.token_expiration as string;
        let refresh_token: string | undefined = req.headers.refresh_token as string;
        let userId: string | undefined = req.headers.userid as string;

        // Check if necessary headers are present
        if (token && token_expiration && refresh_token && userId) {
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
        } else {
            // If any of the required headers is missing, return an error response
            if (!token) {
                return res.status(400).json({ error: 'Error: token is undefined' });
            } else if (!token_expiration) {
                return res.status(400).json({ error: 'Error: token_expiration is undefined' });
            } else if (!refresh_token) {
                return res.status(400).json({ error: 'Error: refresh_token is undefined' });
            } else if (!userId) {
                return res.status(400).json({ error: 'Error: userId is undefined' });
            } else {
                return res.status(400).json({ error: 'Error: Impossible error' });
            }
        }

        // Fetch profiles data
        const response = await axios.get(`https://mobile.bereal.com/api/person/profiles/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'bereal-app-version-code': '14549',
                'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
                'bereal-timezone': 'Europe/Paris',
                'bereal-device-id': '937v3jb942b0h6u9'
            }
        });

        // Attach profiles data to response locals
        if (response.data) {
            if (refreshData) {
                res.locals.response = { data: response.data, refreshData: refreshData };
            } else {
                res.locals.response = { data: response.data };
            }

            // Move to the next middleware
            return next();
        }
    } catch (error: any) {
        // Handle errors
        if (error.response && error.response.data) {
            return res.status(400).json({ error: error.response.data });
        } else {
            return res.status(400).json({ error: error });
        }
    }
};
