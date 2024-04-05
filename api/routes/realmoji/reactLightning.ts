import axios from 'axios';
import sharp from 'sharp';
import { NextFunction, Request, Response } from 'express';
import { refreshDataType } from '../../types/Types';
import getHeaders from 'happy-headers';

const domain: string | undefined = process.env.DOMAIN;

export const reactLightning = async (req: Request, res: Response, next: NextFunction) => {
    try {
        JSON.parse(req.body)
    } catch {
        return res.status(400).json({ error: 'Error: request body is missing' });
    }
    
    let refreshData: refreshDataType | undefined;
    let token: string = req.headers.token as string;
    let token_expiration: string | undefined = req.headers.token_expiration as string;
    let refresh_token: string | undefined = req.headers.refresh_token as string;

    const { filebase64, postUserId, postId } = JSON.parse(req.body);
    const base64Data = filebase64.replace(/^data:(image|application)\/(png|webp|jpeg|jpg|octet-stream);base64,/,'');

    if (token && token_expiration && refresh_token && postUserId && postId) {
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
                return res.status(400).json({ error: { message: "Error refreshing token", error: error.response.data }});
            })
        }
    } else if (!token) {
        return res.status(400).json({ error: 'Error: token is undefined' });
    } else if (!token_expiration) {
        return res.status(400).json({ error: 'Error: token_expiration is undefined' });
    } else if (!refresh_token) {
        return res.status(400).json({ error: 'Error: refresh_token is undefined' });
    } else if (!postUserId) {
        return res.status(400).json({ error: 'Error: postUserId is undefined' });
    } else if (!postId) {
        return res.status(400).json({ error: 'Error: postId is undefined' });
    } else {
        return res.status(400).json({ error: 'Error: Impossible error' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    let sharpBuffer = await sharp(buffer).toBuffer();
    const { format } = await sharp(sharpBuffer).metadata();

    if (format !== 'webp') {
        sharpBuffer = await sharp(sharpBuffer).toFormat('webp').toBuffer();
    }

    try {
        const uploadRes = await axios.get('https://mobile.bereal.com/api/content/realmojis/upload-url?mimeType=image/webp', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const { headers, url, bucket, path } = uploadRes.data.data;
        headers.Authorization = `Bearer ${token}`;

        await axios.put(url, sharpBuffer, { headers });

        let postData = {
            media: {
                bucket: bucket,
                path: path,
                width: 500,
                height: 500,
            }
        };

        const postRes = await axios.put(`https://mobile.bereal.com/api/content/realmojis/instant?postId=${postId}&postUserId=${postUserId}`, postData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...getHeaders()
            }
        });

        if (refreshData) {
            res.locals.response = { data: postRes.data, refresh_data: refreshData };
        } else {
            res.locals.response = { data: postRes.data };
        }

        return next();
    } catch (error) {
        return res.status(400).json({ error: error.response ? error.response.data : 'Unknown error occurred.', refresh_data: refreshData });
    }
}