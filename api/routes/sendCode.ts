import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import getHeaders from 'happy-headers';

const BeRealClientSecret = "F5A71DA-32C7-425C-A3E3-375B4DACA406";

export const sendCode = async (req: Request, res: Response, next: NextFunction) => {
    let phone_number: string | undefined = req.headers.phone_number as string;
    let token: string | undefined = req.headers.token as string | undefined;

    try {
        const receipt_response = await axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyClient?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA', {
                'appToken': '54F80A258C35A916B38A3AD83CA5DDD48A44BFE2461F90831E0F97EBA4BB2EC7'
            }, {
                headers: {
                    "content-type": "application/json",
                    "accept": "*/*",
                    "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
                    "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
                    "accept-language": "en",
                    "user-agent": "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.31.0 iPhone/14.7.1 hw/iPhone9_1",
                    "x-firebase-locale": "en",
                    "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
                    "bereal-app-version-code": "14549",
                    ...getHeaders()
                }
            }
        );

        let receipt = receipt_response.data.receipt;

        const otp_response = await axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA',
            {
                'phoneNumber': phone_number,
                'iosReceipt': receipt
            }, {
            headers: {
                "content-type": "application/json",
                "accept": "*/*",
                "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
                "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
                "accept-language": "en",
                "user-agent": "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.28.2 iPhone/14.7.1 hw/iPhone9_1",
                "x-firebase-locale": "en",
                "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
                "bereal-app-version-code": "14549",
                ...getHeaders()
            }
        
        });

        res.locals.response = { otp_session: otp_response.data.sessionInfo, login_type: 'firebase', phone_number: phone_number };
        return next();
    } catch (error) {
        if (!token) return res.status(400).json({ error: 'No API responded successfully', message: error });
        try {
            const vonage_response = await axios.post(
                `https://auth-l7.bereal.com/token/phone`,
                {
                    phoneNumber: phone_number,
                    "client_id": "android",
                    "client_secret": BeRealClientSecret,
                    "device_id": getHeaders()['bereal-device-id'],
                    "tokens": [
                        {
                            "token": token,
                            "identifier": "AR"
                        }
                    ]
                }, {
                headers: {
                    "Accept": "*/*",
                    "User-Agent": "BeReal/3.10.1 (com.bereal.ft; build:2348592; Android 14) 4.12.0/OkHttp",
                    "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
                    "Content-Type": "application/json",
                    "bereal-app-version-code": "2348592",
                    "bereal-app-version": "3.10.1",
                    ...getHeaders()
                }
            });

            res.locals.response = { otp_session: vonage_response.data.vonageRequestId, login_type: 'vonage', phone_number: phone_number };
            return next();
        } catch (error) {
            return res.status(400).json({ error: 'No API responded successfully', message: error });
        }
    }
};
