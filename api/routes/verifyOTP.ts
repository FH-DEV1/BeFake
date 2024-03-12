import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    let otp_code: string | undefined = req.headers.otp_code as string;
    let otp_session: string | undefined = req.headers.otp_session as string;
    let login_type: string | undefined = req.headers.login_type as string;

    function checkResponse(response: { status: number; data: any; }) {
        if (response.status > 350 || response.status === 16) {
            return res.status(400).json({ error: response });
        }
        return false;
    }

    if ((login_type === "firebase" || login_type === "vonage") && otp_session && otp_code) {
        try {
            let headers = {
                "Accept": "application/json",
                "User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
                "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
                "Content-Type": "application/json"
            };

            let otp = otp_code;
            let sessionInfo = otp_session;

            let otpBody = JSON.stringify({ "code": otp, "sessionInfo": sessionInfo });

            let otpOptions = {
                url: login_type === "firebase" ?
                    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA" :
                    "https://auth.bereal.team/api/vonage/check-code",
                method: "POST",
                headers: headers,
                data: otpBody
            };

            let otpResponse = await axios.request(otpOptions);

            if (checkResponse(otpResponse)) return;

            let refreshToken;
            if (login_type === "firebase") {
                refreshToken = otpResponse.data.refreshToken;
            } else {
                refreshToken = otpResponse.data.token;
            }

            let refreshData = JSON.stringify({ "grantType": "refresh_token", "refreshToken": refreshToken });
            let refreshOptions = {
                url: login_type === "firebase" ?
                    "https://securetoken.googleapis.com/v1/token?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA" :
                    "https://auth.bereal.team/api/vonage/request-code",
                method: "POST",
                headers: headers,
                data: refreshData
            };

            let refreshResponse = await axios.request(refreshOptions);

            if (checkResponse(refreshResponse)) return;

            if (login_type === "firebase") {
                res.locals.access_token = refreshResponse.data.id_token;
                res.locals.access_refresh_token = refreshResponse.data.refresh_token;
                res.locals.access_expiration = Date.now() + refreshResponse.data.expires_in * 1000;
            } else {
                res.locals.access_token = refreshResponse.data.access_token;
                res.locals.access_refresh_token = refreshResponse.data.refresh_token;
                res.locals.access_expiration = Date.now() + refreshResponse.data.expires_in * 1000;
            }

            return next();

        } catch (error: any) {
            return res.status(400).json({ error: error.response.data });
        }
    } else {
        return res.status(400).json({ error: `Error verifying OTP. Missing login_type, otp_session, or otp_code` });
    }
};
