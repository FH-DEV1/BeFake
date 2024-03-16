import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const profiles = async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve the token from the request headers
    let token: string|null = req.headers.token;
    let userId: string|null = req.headers.userId;

    try {
        if (token) {
            // Make a GET request to fetch user profile data using the token and user ID
            const response = await axios.get(`https://mobile.bereal.com/api/person/profiles/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'bereal-app-version-code': '14549',
                    'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
                    'bereal-timezone': 'Europe/Paris',
                    'bereal-device-id': '937v3jb942b0h6u9'
                }
            })

            res.locals.response = { data: response.data};

            return next();
        } else {
            return res.status(400).json({ error: `Error: token, token_expiration, refresh_token, or userId is undefined` });
        }
    } catch (error: any) {
        // Return an error response if the request fails
        if (error.response.data) {
            return res.status(400).json({ error: error.response.data });
        } else {
            return res.status(400).json({ error: error });
        }
    }
}
