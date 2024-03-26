import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

// Middleware function to send verification code
export const sendCode = async (req: Request, res: Response, next: NextFunction) => {
    let phone_number: string | undefined = req.headers.phone_number as string;

    try {
        // Request to verify client
        const receipt_response = await axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyClient?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA',
            {
                'appToken': '54F80A258C35A916B38A3AD83CA5DDD48A44BFE2461F90831E0F97EBA4BB2EC7'
            }, {
            headers: {
                'content-type': 'application/json',
                'accept': '*/*',
                'x-client-version': 'iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS',
                'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                'accept-language': 'en',
                'user-agent': 'FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.31.0 iPhone/14.7.1 hw/iPhone9_1',
                'x-firebase-locale': 'en',
                'x-firebase-gmpid': '1:405768487586:ios:28c4df089ca92b89',
            }
        });

        let receipt = receipt_response.data.receipt;

        // Send verification code
        const otp_response = await axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA',
            {
                'phoneNumber': phone_number,
                'iosReceipt': receipt
            }, {
            headers: {
                'content-type': 'application/json',
                'accept': '*/*',
                'x-client-version': 'iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS',
                'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                'accept-language': 'en',
                'user-agent': 'FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.28.2 iPhone/14.7.1 hw/iPhone9_1',
                'x-firebase-locale': 'en',
                'x-firebase-gmpid': '1:405768487586:ios:28c4df089ca92b89',
            }
        
        });

        // Attach response data to locals and move to the next middleware
        res.locals.response = { otp_session: otp_response.data.sessionInfo, login_type: 'firebase', phone_number: phone_number };
        return next();
    } catch (error) {
        try {
            // If the first API call fails, try another one
            const vonage_response = await axios.post(
                'https://auth.bereal.team/api/vonage/request-code',
                {
                    phoneNumber: phone_number,
                    deviceId: Array.from(Array(16), () => Math.floor(Math.random() * 36).toString(36)).join('')
                }, {
                headers: {
                    'Accept': '*/*',
                    'User-Agent': 'BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0',
                    'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                    'Content-Type': 'application/json',
                    'bereal-app-version-code': '14549',
                    'bereal-signature': 'berealsignature',
                    'bereal-device-id': 'berealdeviceid'
                }
            });

            // Attach response data to locals and move to the next middleware
            res.locals.response = { otp_session: vonage_response.data.vonageRequestId, login_type: 'vonage', phone_number: phone_number };
            return next();
        } catch (error) {
            // If both API calls fail, return an error response
            return res.status(400).json({ error: 'No API responded successfully' });
        }
    }
};
