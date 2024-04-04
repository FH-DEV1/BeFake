import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    let otp_code: string | undefined = req.headers.otp_code as string;
    let otp_session: string | undefined = req.headers.otp_session as string;
    let login_type: string | undefined = req.headers.login_type as string;

    function check_response(response: { status: number; data: any; }) {
        if (response.status > 350 || response.status == 16) {
            return res.status(400).json({ error: response });
        }
        return false;
    }

    if (login_type == 'firebase' && otp_session && otp_code) {
        try {
            let headers_list = {
                'Accept': 'application/json',
                'User-Agent': 'BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0',
                'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                'Content-Type': 'application/json'
            };

            let otp = otp_code;
            let session_info = otp_session;

            let fire_otp_headers = { ...headers_list, ...{
                'content-type': 'application/json',
                'x-firebase-client': 'apple-platform/ios apple-sdk/19F64 appstore/true deploy/cocoapods device/iPhone9,1 fire-abt/8.15.0 fire-analytics/8.15.0 fire-auth/8.15.0 fire-db/8.15.0 fire-dl/8.15.0 fire-fcm/8.15.0 fire-fiam/8.15.0 fire-fst/8.15.0 fire-fun/8.15.0 fire-install/8.15.0 fire-ios/8.15.0 fire-perf/8.15.0 fire-rc/8.15.0 fire-str/8.15.0 firebase-crashlytics/8.15.0 os-version/14.7.1 xcode/13F100',
                'accept': '*/*',
                'x-client-version': 'iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS',
                'x-firebase-client-log-type': '0',
                'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                'accept-language': 'en',
                'user-agent': 'FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1',
                'x-firebase-locale': 'en',
            }};

            let fire_otp_body = {
                'code': otp,
                'sessionInfo': session_info,
                'operation': 'SIGN_UP_OR_IN'
            };

            let fire_otp_options = {
                url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q',
                method: 'POST',
                headers: fire_otp_headers,
                data: fire_otp_body,
            };

            let fire_otp_response = await axios.request(fire_otp_options);

            let fire_refresh_token = fire_otp_response.data.refreshToken;

            console.log(fire_otp_response.data.phoneNumber, fire_otp_response.data.localId);

            let firebase_refresh_data = JSON.stringify({
                'grantType': 'refresh_token',
                'refreshToken': fire_refresh_token
            });

            let firebase_refresh_options = {
                url: 'https://securetoken.googleapis.com/v1/token?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q',
                method: 'POST',
                headers: headers_list,
                data: firebase_refresh_data,
            };

            let firebase_refresh_response = await axios.request(firebase_refresh_options);

            let firebase_token = firebase_refresh_response.data.id_token;

            let access_grant = JSON.stringify({
                'grant_type': 'firebase',
                'client_id': 'ios',
                'client_secret': '962D357B-B134-4AB6-8F53-BEA2B7255420',
                'token': firebase_token
            });

            let access_grant_options = {
                url: 'https://auth.bereal.team/token?grant_type=firebase',
                method: 'POST',
                headers: headers_list,
                data: access_grant,
            };

            let access_grant_response = await axios.request(access_grant_options);

            let access_expiration = Date.now() + access_grant_response.data.expires_in * 1000;
            res.locals.response = { token: access_grant_response.data.access_token, refresh_token: access_grant_response.data.refresh_token, token_expiration: access_expiration }
            return next();
            
        } catch (error: any) {
            let error_message;

            if (error.response) {
                error_message = JSON.stringify(error.response.data);
            } else {
                error_message = error.toString();
            }

            return res.status(400).json({ error: error_message });
        }

    } else if (login_type == 'vonage' && otp_session && otp_code) {
        try {
    
            let otp = otp_code;
            let vonage_request_id = otp_session;
    
            let headers_list = {
                'Accept': 'application/json',
                'User-Agent': 'BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0',
                'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                'Content-Type': 'application/json'
            };
    
            let vonage_body_content = JSON.stringify({ 'code': otp, 'vonageRequestId': vonage_request_id });
            let vonage_options = {
                url: 'https://auth.bereal.team/api/vonage/check-code',
                method: 'POST',
                headers: headers_list,
                data: vonage_body_content,
            };

            let response = await axios.request(vonage_options);

            if (check_response(response)) {
                return;
            }

            let token = response.data.token;

            let refresh_body = JSON.stringify({ 'token': token, 'returnSecureToken': 'True' });
            let refresh_options = {
                url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q',
                method: 'POST',
                headers: headers_list,
                data: refresh_body,
            };

            let refresh_response = await axios.request(refresh_options)

            let refresh_token = refresh_response.data.refreshToken;

            let firebase_refresh_data = JSON.stringify({
                'grantType': 'refresh_token',
                'refreshToken': refresh_token
            });
            let firebase_refresh_options = {
                url: 'https://securetoken.googleapis.com/v1/token?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q',
                method: 'POST',
                headers: headers_list,
                data: firebase_refresh_data,
            };
            let firebase_refresh_response = await axios.request(firebase_refresh_options);
    
            if (check_response(firebase_refresh_response)) {
                return;
            }
    
            let firebase_token = firebase_refresh_response.data.id_token;
    
            let access_grant = JSON.stringify({
                'grant_type': 'firebase',
                'client_id': 'ios',
                'client_secret': '962D357B-B134-4AB6-8F53-BEA2B7255420',
                'token': firebase_token
            });
            let access_grant_options = {
                url: 'https://auth.bereal.team/token?grant_type=firebase',
                method: 'POST',
                headers: headers_list,
                data: access_grant,
            };
            let access_grant_response = await axios.request(access_grant_options);
    
            if (check_response(access_grant_response)) {
                return;
            }

            let access_expiration = Date.now() + access_grant_response.data.expires_in * 1000;
            res.locals.response = { token: access_grant_response.data.access_token, refresh_token: access_grant_response.data.refresh_token, token_expiration: access_expiration }
            return next();
        
        } catch (error: any) {
            return res.status(400).json({ error: error.response.data });
        }
    }
};
