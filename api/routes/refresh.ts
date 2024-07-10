import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    let refresh_token: string | undefined = req.headers.refresh_token as string;

    if (!refresh_token) {
        return res.status(400).json({ error: 'Could not refresh token: no refresh token was found in headers' });
    }

    await axios.post("https://securetoken.googleapis.com/v1/token?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q", 
        JSON.stringify({
            'grantType': 'refresh_token',
            'refreshToken': refresh_token
        }),
        {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0',
                'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                'Content-Type': 'application/json'
            }
        }
    ).then(response => {
        let refresh_token = response.data.refresh_token

        return axios.post("https://auth.bereal.team/token?grant_type=firebase", 
            JSON.stringify({
                'grant_type': 'firebase',
                'client_id': 'ios',
                'client_secret': '962D357B-B134-4AB6-8F53-BEA2B7255420',
                'token': response.data.access_token
            }), {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0',
                    'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            res.locals.response = {
                token: response.data.access_token,
                refresh_token: refresh_token,
                token_expiration: Date.now() + response.data.expires_in * 1000
            };
            return next();
        }).catch(error => {
            return res.status(400).json({ error: error.response.data });
        })
    }).catch(error => {
        return res.status(400).json({ error: error.response.data });
    })
}

//     if (refresh_token) {
//         try {
//             // Step 1: Obtain a new Firebase token using the refresh token
//             const headers_list = {
//                 'Accept': 'application/json',
//                 'User-Agent': 'BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0',
//                 'x-ios-bundle-identifier': 'AlexisBarreyat.BeReal',
//                 'Content-Type': 'application/json'
//             };

//             const firebase_refresh_data = JSON.stringify({
//                 'grantType': 'refresh_token',
//                 'refreshToken': refresh_token
//             });

//             const firebase_refresh_options = {
//                 url: `https://securetoken.googleapis.com/v1/token?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q`,
//                 method: 'POST',
//                 headers: headers_list,
//                 data: firebase_refresh_data
//             };
//             const firebase_refresh_response = await axios.request(firebase_refresh_options);
//             console.log(firebase_refresh_response.data)
//             const new_firebase_token = firebase_refresh_response.data.access_token;
//             const new_firebase_refresh_token = firebase_refresh_response.data.refresh_token;

//             // Step 2: Use the new Firebase token to obtain a BeReal access token
//             const access_grant = JSON.stringify({
//                 'grant_type': 'firebase',
//                 'client_id': 'ios',
//                 'client_secret': '962D357B-B134-4AB6-8F53-BEA2B7255420',
//                 'token': new_firebase_token
//             });

//             const access_grant_options = {
//                 url: `https://auth.bereal.team/token?grant_type=firebase`,
//                 method: 'POST',
//                 headers: headers_list,
//                 data: access_grant
//             };

//             const access_grant_response = await axios.request(access_grant_options);
//             console.log(access_grant_response.data)
//             const bereal_access_token = access_grant_response.data.access_token;
//             const token_expiration = Date.now() + access_grant_response.data.expires_in * 1000;

//             res.locals.response = {
//                 token: bereal_access_token,
//                 refresh_token: new_firebase_refresh_token,
//                 token_expiration: token_expiration,
//             };

//             return next();
//         } catch (error) {
//             return res.status(400).json({ error: error.response.data });
//         }
//     } else {
//         return res.status(400).json({ error: 'Could not refresh token: no refresh token was found in headers' });
//     }
// };
