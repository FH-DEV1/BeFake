import axios from "axios";
import { NextFunction, Request, Response } from 'express';
import { refreshDataType } from '../../../types/Types';

// Retrieve domain from environment variables
const domain: string | undefined = process.env.DOMAIN;

export const uploadComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let refreshData: refreshDataType | undefined;
        let token: string | undefined = req.headers.token as string;
        let token_expiration: string | undefined = req.headers.token_expiration as string;
        let refresh_token: string | undefined = req.headers.refresh_token as string;
        let postId: string | undefined = req.headers.postId as string;
        let userId: string | undefined = req.headers.userid as string;
        let comment: string | undefined = req.body.comment as string;

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
            } else if (!postId) {
                return res.status(400).json({ error: 'Error: postId is undefined' });
            } else if (!userId) {
                return res.status(400).json({ error: 'Error: userId is undefined' });
            } else if (!comment) {
                return res.status(400).json({ error: 'Error: comment is undefined' });
            } else {
                return res.status(400).json({ error: 'Error: Impossible error' });
            }
        }

        // Send POST request to upload comment
        const response = await axios.post(
            `https://mobile.bereal.com/api/content/comments?postId=${postId}&postUserId=${userId}`,
            {
              content: comment,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'bereal-app-version-code': '14549',
                'bereal-signature': 'MToxNzEwOTU4NjQxOpg0j8sNuUN6oL3/h9GtyvzOPwPz1Rqf+euE+QfDPQlA',
                'bereal-device-id': 'XKFg0Nkarwqyds17',
                'bereal-timezone': 'Europe/Paris'
              },
            },
        );

        // Handle response and refresh data
        if (refreshData) {
            console.log(response.data.id, token);
            res.locals.response = { data: response.data, refresh_data: refreshData };
        } else {
            res.locals.response = { data: response.data };
        }

        // Move to the next middleware
        return next()
    } catch(error: any) {
        // Handle errors
        if (error.response && error.response.data) {
            return res.status(400).json({ error: error.response.data });
        } else {
            return res.status(400).json({ error: error });
        }
    }
}