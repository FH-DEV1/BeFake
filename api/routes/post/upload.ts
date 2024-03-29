import axios from 'axios';
import sharp from 'sharp';
import moment from 'moment';
import { NextFunction, Request, Response } from 'express';
import { PostData, refreshDataType } from '../../types/Types';
import { DOMParser } from 'xmldom';

const domain: string | undefined = process.env.DOMAIN;

export const uploadPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        JSON.parse(req.body);
    } catch {
        return res.status(400).json({ error: 'Error: request body is missing' });
    }

    let refreshData: refreshDataType | undefined;
    let token: string = req.headers.token as string;
    let token_expiration: string | undefined = req.headers.token_expiration as string;
    let refresh_token: string | undefined = req.headers.refresh_token as string;

    let { primaryb64, secondaryb64, visibility } = JSON.parse(req.body);

    if (!(token && token_expiration && refresh_token && primaryb64 && secondaryb64)) {
        return res.status(400).json({ error: 'Error: missing required fields' });
    }

    const now = Date.now();
    if (now > parseInt(token_expiration)) {
        try {
            const response = await axios.get(`${domain}/api/refresh`, {
                headers: {
                    refresh_token: refresh_token
                }
            });
            refreshData = response.data;
            token = response.data.token;
        } catch (error) {
            return res.status(400).json({ error: { message: 'Error refreshing token', error: error.response.data }});
        }
    }

    primaryb64 = primaryb64.replace(/^data:(image|application)\/(png|webp|jpeg|jpg|gif|svg\+xml|octet-stream);base64,/, '');
    secondaryb64 = secondaryb64.replace(/^data:(image|application)\/(png|webp|jpeg|jpg|gif|svg\+xml|octet-stream);base64,/, '');

    let primary_image_buffer = Buffer.from(primaryb64, 'base64');
    let secondary_image_buffer = Buffer.from(secondaryb64, 'base64');

    let sharp_primary = await sharp(primary_image_buffer).toBuffer();
    let sharp_secondary = await sharp(secondary_image_buffer).toBuffer();

    const primary_mime_type = (await sharp(sharp_primary).metadata()).format;
    const secondary_mime_type = (await sharp(sharp_secondary).metadata()).format;

    if (primary_mime_type != 'webp') {
        sharp_primary = await sharp(sharp_primary).toFormat('webp').toBuffer();
    }
    if (secondary_mime_type != 'webp') {
        sharp_secondary = await sharp(sharp_secondary).toFormat('webp').toBuffer();
    }

    try {
        let uploadRes = await axios.get('https://mobile.bereal.com/api/content/posts/upload-url?mimeType=image/webp', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'bereal-app-version-code': '14549',
                'bereal-signature': 'berealsignature',
                'bereal-timezone': 'Europe/Paris',
                'bereal-device-id': 'berealdeviceid'
            }
        });

        let [primaryRes, secondaryRes] = uploadRes.data.data;

        let primaryHeaders = {
            ...primaryRes.headers,
            'Bereal-Device-Language': 'fr',
            'Bereal-App-Version': '2.2.0',
            'Bereal-App-Version-Code': '15558',
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Bereal-Platform': 'iPadOS',
            'Bereal-Os-Version': '17.3',
            'Accept-Language': 'fr-FR;q=1.0',
            'Accept-Encoding': 'gzip, deflate, br',
            'Bereal-Device-Id': process.env.DEVICEID,
            'User-Agent': 'BeReal/2.2.0 (AlexisBarreyat.BeReal; build:15558; iOS 17.3.0)',
            'Bereal-App-Language': 'fr-FR',
            'Bereal-Timezone': 'Europe/Paris',
            'Bereal-Signature': process.env.SIGNATURE
        };

        let secondaryHeaders = {
            ...secondaryRes.headers,
            'Bereal-Device-Language': 'fr',
            'Bereal-App-Version': '2.2.0',
            'Bereal-App-Version-Code': '15558',
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Bereal-Platform': 'iPadOS',
            'Bereal-Os-Version': '17.3',
            'Accept-Language': 'fr-FR;q=1.0',
            'Accept-Encoding': 'gzip, deflate, br',
            'Bereal-Device-Id': process.env.DEVICEID,
            'User-Agent': 'BeReal/2.2.0 (AlexisBarreyat.BeReal; build:15558; iOS 17.3.0)',
            'Bereal-App-Language': 'fr-FR',
            'Bereal-Timezone': 'Europe/Paris',
            'Bereal-Signature': process.env.SIGNATURE
        };

        await Promise.all([
            axios.put(primaryRes.url, sharp_primary, { headers: primaryHeaders }),
            axios.put(secondaryRes.url, sharp_secondary, { headers: secondaryHeaders })
        ]);

        let takenAt: string = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        let postData: PostData = {
            isLate: false,
            retakeCounter: 0,
            takenAt,
            visibility: [visibility || 'friends'], 
            backCamera: {
                bucket: primaryRes.bucket,
                height: 1500,
                width: 2000,
                path: primaryRes.path,
            },
            frontCamera: {
                bucket: secondaryRes.bucket,
                height: 1500,
                width: 2000,
                path: secondaryRes.path,
            } // Ajouter la location
        };

        let postResponse = await axios.post('https://mobile.bereal.com/api/content/posts', postData, {
            headers: {
                'Bereal-Device-Language': 'fr',
                'Bereal-App-Version': '2.2.0',
                'Bereal-App-Version-Code': '15558',
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*',
                'Bereal-Platform': 'iPadOS',
                'Bereal-Os-Version': '17.3',
                'Accept-Language': 'fr-FR;q=1.0',
                'Accept-Encoding': 'gzip, deflate, br',
                'Bereal-Device-Id': process.env.DEVICEID,
                'User-Agent': 'BeReal/2.2.0 (AlexisBarreyat.BeReal; build:15558; iOS 17.3.0)',
                'Bereal-App-Language': 'fr-FR',
                'Bereal-Timezone': 'Europe/Paris',
                'Bereal-Signature': process.env.SIGNATURE
            },
        });

        if (refreshData) {
            res.locals.response = { data: postResponse.data, refresh_data: refreshData };
        } else {
            res.locals.response = { data: postResponse.data };
        }

        return next();
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errorKey === 'user-reached-max-posts') {
            return res.status(400).json({ error: 'You have reached the maximum number of posts allowed.' });
        } else if (error.response) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(error.response.data, 'application/xml');
            const codeElement = xmlDoc.getElementsByTagName('Code')[0];
    
            if (codeElement && codeElement.textContent === 'EntityTooSmall') {
                return res.status(400).json({ error: 'The image is too small. Please upload a larger image.', refresh_data: refreshData });
            } else if (codeElement && codeElement.textContent === 'EntityTooLarge') {
                return res.status(400).json({ error: 'The image is too large. Please upload a smaller image.', refresh_data: refreshData });
            } else {
                return res.status(400).json({ error: error.response.data || 'Unknown error occurred.', refresh_data: refreshData });
            }
        } else {
            return res.status(400).json({ error: 'Unknown error occurred.', refresh_data: refreshData });
        }
    }
}