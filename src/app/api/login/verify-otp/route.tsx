import { NextResponse } from 'next/server';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// DISCLAIMER : I COPIED CODE
// I tried soooo hard to make this work on my own. Thing is everything works until it 
// comes to refreshing the token at the very end. After 4h I admited I failed on making
// it on my own and I just copied s-alad so here are the 2 files I used of him to make
// this work. THANK YOU SO MUCH SALADIN FOR PROVIDING PUBLIC CODE.
//
// firebase : https://github.com/s-alad/toofake/blob/main/new/client/pages/api/otp/fire/verify.ts
// vonage : https://github.com/s-alad/toofake/blob/main/new/client/pages/api/otp/vonage/verify.ts
//
// and a link to his profile because he does great stuff : https://github.com/s-alad

export const GET = async (req: Request) => {
    let otp_code: string|null = req.headers.get("otp_code");
    let login_type: string|null = req.headers.get("login_type");
    let otp_session: string|null = req.headers.get("otp_session");

    function check_response(response: { status: number; data: any; }) {
        if (response.status > 350 || response.status == 16) {
            console.log("error | ", response);
            return NextResponse.json({error: response}, {status: 400});
        }
        return false;
    }

    if (login_type == "firebase" && otp_session && otp_code) {
        try {

            let headers_list = {"Accept": "application/json","User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0","x-ios-bundle-identifier": "AlexisBarreyat.BeReal","Content-Type": "application/json"}
        
            let otp = otp_code;
            let session_info = otp_session;
        
            let fire_otp_headers = {
                "content-type": "application/json",
                "x-firebase-client":
                    "apple-platform/ios apple-sdk/19F64 appstore/true deploy/cocoapods device/iPhone9,1 fire-abt/8.15.0 fire-analytics/8.15.0 fire-auth/8.15.0 fire-db/8.15.0 fire-dl/8.15.0 fire-fcm/8.15.0 fire-fiam/8.15.0 fire-fst/8.15.0 fire-fun/8.15.0 fire-install/8.15.0 fire-ios/8.15.0 fire-perf/8.15.0 fire-rc/8.15.0 fire-str/8.15.0 firebase-crashlytics/8.15.0 os-version/14.7.1 xcode/13F100",
                "accept": "*/*",
                "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
                "x-firebase-client-log-type": "0",
                "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
                "accept-language": "en",
                "user-agent":
                    "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1",
                "x-firebase-locale": "en",
            }
        
            let fire_otp_body = {
                "code": otp,
                "sessionInfo": session_info,
                "operation": "SIGN_UP_OR_IN"
            }
        
            let fire_otp_options = {
                url: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
                method: "POST",
                headers: fire_otp_headers,
                data: fire_otp_body,
            }
        
            let fire_otp_response = await axios.request(fire_otp_options);
        
            let fire_refresh_token = fire_otp_response.data.refreshToken;
        
            console.log("otp response");
            console.log(fire_otp_response.data);
            console.log('---------------------')
        
            // ============================================================================================
        
            let firebase_refresh_data = JSON.stringify({
                "grantType": "refresh_token",
                "refreshToken": fire_refresh_token
            });
            let firebase_refresh_options = {
                url: "https://securetoken.googleapis.com/v1/token?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
                method: "POST",
                headers: headers_list,
                data: firebase_refresh_data,
            }
            let firebase_refresh_response = await axios.request(firebase_refresh_options);
        
            /* if (check_response(firebase_refresh_response)) {return;} */
        
            console.log("firebase refresh");
            console.log(firebase_refresh_response.status);
            console.log(firebase_refresh_response.data);
            console.log('---------------------')
        
            let firebase_token = firebase_refresh_response.data.id_token;
            let firebase_refresh_token = firebase_refresh_response.data.refresh_token;
            let user_id = firebase_refresh_response.data.user_id;
            let firebase_expiration = Date.now() + firebase_refresh_response.data.expires_in * 1000;
        
            // ============================================================================================
        
            let access_grant = JSON.stringify({
                "grant_type": "firebase",
                "client_id": "ios",
                "client_secret": "962D357B-B134-4AB6-8F53-BEA2B7255420",
                "token": firebase_token
            });
            let access_grant_options = {
                url: "https://auth.bereal.team/token?grant_type=firebase",
                method: "POST",
                headers: headers_list,
                data: access_grant,
            }
            let access_grant_response = await axios.request(access_grant_options);
        
            /* if (check_response(access_grant_response)) {return;} */
        
            let access_token = access_grant_response.data.access_token;
            let access_refresh_token = access_grant_response.data.refresh_token;
            let access_expiration = Date.now() + access_grant_response.data.expires_in * 1000;

            let payload = {
                "access": {
                    "refresh_token": access_refresh_token,
                    "token": access_token,
                    "expires": new Date(access_expiration).toISOString()
                },
                "firebase": {
                    "refresh_token": firebase_refresh_token,
                    "token": firebase_token,
                    "expires": new Date(firebase_expiration).toISOString()
                },
                "userId": user_id,
                "iat": Math.floor(Date.now() / 1000)
            };

            let jwt_token = jwt.sign(payload, 'JWT_HARD_SECRET', { algorithm: 'HS256' });
            console.log(jwt_token)
        
            console.log("access grant");
            console.log(access_grant_response.status);
            console.log(access_grant_response.data);
            console.log('---------------------')

            return NextResponse.json({refresh_data: { 
                token: access_token,
                refresh_token: jwt_token,
                token_expiration: access_expiration,

            }}, {status: 200});
        
            
            }
            catch (error: any) {
                console.log("FAILURE")
                console.log(error);
                console.log('---------------------')
        
                let error_message;
        
                if (error.response) {
                    error_message = JSON.stringify(error.response.data);
                } else {
                    error_message = error.toString();
                }
                console.log(error_message);
                return NextResponse.json({error: error.error_message}, {status: 400});
            }
// ========================================================================================================
// ========================================================================================================
// ========================================================================================================
// ========================================================================================================
// ========================================================================================================
// ========================================================================================================
// ========================================================================================================
// ========================================================================================================
// ========================================================================================================
// ========================================================================================================

    } else if (login_type == "vonage" && otp_session && otp_code) {
    
        try {
    
        let otp = otp_code;
        let vonage_request_id = otp_session;
    
        console.log('=====================')
        console.log("login process");
        console.log(req.body);
        console.log(otp);
        console.log(vonage_request_id);
        console.log('---------------------')
    
        let headers_list = {"Accept": "application/json","User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0","x-ios-bundle-identifier": "AlexisBarreyat.BeReal","Content-Type": "application/json"}
    
        let vonage_body_content = JSON.stringify({ "code": otp, "vonageRequestId": vonage_request_id });
        let vonage_options = {
            url: "https://auth.bereal.team/api/vonage/check-code",
            method: "POST",
            headers: headers_list,
            data: vonage_body_content,
        }
        let response = await axios.request(vonage_options);
    
        if (check_response(response)) {return;}
    
        let token = response.data.token;
        let uid = response.data.uid;
        console.log("validated");
        console.log(response.data);
        console.log('---------------------')
    
        // ============================================================================================
    
        let refresh_body = JSON.stringify({ "token": token, "returnSecureToken": "True" });
        let refresh_options = {
            url: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
            method: "POST",
            headers: headers_list,
            data: refresh_body,
        }
        let refresh_response = await axios.request(refresh_options)

        let refresh_token = refresh_response.data.refreshToken;
    
        console.log("first refresh");
        console.log(refresh_response.status);
        console.log(refresh_response.data);
        console.log('---------------------')
    
        // ============================================================================================
    
        let firebase_refresh_data = JSON.stringify({
            "grantType": "refresh_token",
            "refreshToken": refresh_token
        });
        let firebase_refresh_options = {
            url: "https://securetoken.googleapis.com/v1/token?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
            method: "POST",
            headers: headers_list,
            data: firebase_refresh_data,
        }
        let firebase_refresh_response = await axios.request(firebase_refresh_options);
    
        if (check_response(firebase_refresh_response)) {return;}
    
        console.log("firebase refresh");
        console.log(firebase_refresh_response.status);
        console.log(firebase_refresh_response.data);
        console.log('---------------------')
    
        let firebase_token = firebase_refresh_response.data.id_token;
        let firebase_refresh_token = firebase_refresh_response.data.refresh_token;
        let user_id = firebase_refresh_response.data.user_id;
        let firebase_expiration = Date.now() + firebase_refresh_response.data.expires_in * 1000;
    
        // ============================================================================================
    
        let access_grant = JSON.stringify({
            "grant_type": "firebase",
            "client_id": "ios",
            "client_secret": "962D357B-B134-4AB6-8F53-BEA2B7255420",
            "token": firebase_token
        });
        let access_grant_options = {
            url: "https://auth.bereal.team/token?grant_type=firebase",
            method: "POST",
            headers: headers_list,
            data: access_grant,
        }
        let access_grant_response = await axios.request(access_grant_options);
    
        if (check_response(access_grant_response)) {return;}
    
        let access_token = access_grant_response.data.access_token;
        let access_refresh_token = access_grant_response.data.refresh_token;
        let access_expiration = Date.now() + access_grant_response.data.expires_in * 1000;

        let payload = {
            "access": {
                "refresh_token": access_refresh_token,
                "token": access_token,
                "expires": new Date(access_expiration).toISOString()
            },
            "firebase": {
                "refresh_token": firebase_refresh_token,
                "token": firebase_token,
                "expires": new Date(firebase_expiration).toISOString()
            },
            "userId": user_id,
            "iat": Math.floor(Date.now() / 1000)
        };

        let jwt_token = jwt.sign(payload, 'JWT_HARD_SECRET', { algorithm: 'HS256' });
        console.log(jwt_token)
    
        console.log("access grant");
        console.log(access_grant_response.status);
        console.log(access_grant_response.data);
        console.log('---------------------')
    
        return NextResponse.json({refresh_data: { 
            token: access_token,
            refresh_token: access_refresh_token,
            token_expiration: access_expiration
        }}, {status: 200});
        
    
        } catch (error: any) {
            console.log("FAILURE")
            console.log(error.response.data);
            return NextResponse.json({error: error.response.data}, {status: 400});
        }
    } else {
        return NextResponse.json({error: `Error verifying OTP no login_type or otp_session or otp_code was found`}, {status: 400});
    }
}