import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

// Middleware function to refresh token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    let refresh_token: string | undefined = req.headers.refresh_token as string;

    if (refresh_token) {
        try {
            const response = await axios.post('https://auth.bereal.team/token?grant_type=refresh_token',
                JSON.stringify({
                    'grant_type': 'refresh_token',
                    'client_id': 'ios',
                    'client_secret': '962D357B-B134-4AB6-8F53-BEA2B7255420',
                    'refresh_token': refresh_token
                }), {
                headers: {
                    'Accept': '*/*',
                    'User-Agent': 'BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0',
                    'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                    'Content-Type': 'application/json'
                }
            });

            // Attach token details to response locals
            res.locals.token = response.data.access_token;
            res.locals.refresh_token = response.data.refresh_token;
            res.locals.token_expiration = Date.now() + response.data.expires_in * 1000;

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
    } else {
        // If no refresh token is found in headers, return an error response
        return res.status(400).json({ error: 'Could not refresh token: no refresh token was found in headers' });
    }
};
