import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { refreshDataType } from '../types/Types';

// Retrieve domain from environment variables
const domain: string | undefined = process.env.DOMAIN;

// Middleware function to fetch feed data
export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
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

        // Fetch feed data from the external API
        const feedResponse = await axios.get('https://mobile.bereal.com/api/feeds/friends-v1', {
            headers: {
                'authorization': `Bearer ${token}`,
                'bereal-app-version-code': '14549',
                'bereal-signature': 'MToxNzEwOTU4NjQxOpg0j8sNuUN6oL3/h9GtyvzOPwPz1Rqf+euE+QfDPQlA',
                'bereal-device-id': 'XKFg0Nkarwqyds17',
                'bereal-timezone': 'Europe/Paris'
            }
        });

        // If feed data is retrieved successfully
        if (feedResponse.data.friendsPosts) {
            // Attach feed data to response locals
            if (refreshData) {
                res.locals.response = { feed: feedResponse.data, refreshData: refreshData };
            } else {
                res.locals.response = { feed: feedResponse.data };
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
