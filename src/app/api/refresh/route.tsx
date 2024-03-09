import { NextResponse } from 'next/server';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const GET = async (req: Request) => {
    let refresh_token: string|null = req.headers.get("refresh_token");
    let token = ""
    let token_expiration = 0

    if (refresh_token) {
        return axios.post("https://berealapi.fly.dev/login/refresh", {
            "token": refresh_token
        },{
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            }
        }).then((response) => {
            try {
                let decoded = jwt.decode(response.data.data.token, { complete: true });
                if (decoded && typeof decoded.payload !== "string") {
                    console.log(decoded.payload)
                    token = decoded.payload.access.token
                    let expires = new Date(decoded.payload.access.expires)
                    let expiresParis = expires.toLocaleString("en-US", { timeZone: "Europe/Paris" })
                    token_expiration = Date.parse(expiresParis)
                    return NextResponse.json({ 
                        token: token,
                        refresh_token: response.data.data.token,
                        token_expiration: token_expiration
                    }, {status: 200});
                } else {
                    return NextResponse.json({error: "Error decoding JWT"}, {status: 400});
                }
             } catch (error) {
                console.error('Error decoding JWT:', error);
                return NextResponse.json({error: "Error decoding JWT"}, {status: 400});
             }
        }).catch((error) => {
            return NextResponse.json({error: error.response.data}, {status: 400});
        })
    } else {
        return NextResponse.json({error: "No refresh token was found"}, {status: 400});
    }

}










// import { NextResponse } from 'next/server';
// import axios from 'axios';

// export const GET = async (req: Request) => {
//     let refresh_token: string|null = req.headers.get("refresh_token");
//     let url = process.env.PIPEDREAM_URL ? process.env.PIPEDREAM_URL : ""
//     if (refresh_token) {
//         if (process.env.VERCEL_HOSTED !== "TRUE" && process.env.NODE_ENV === "development") {
//             return axios.post("https://auth.bereal.team/token?grant_type=refresh_token",
//                 JSON.stringify({
//                     "grant_type": "refresh_token",
//                     "client_id": "ios",
//                     "client_secret": "962D357B-B134-4AB6-8F53-BEA2B7255420",
//                     "refresh_token": refresh_token
//                 }),{
//                 headers: {
//                     "Accept": "*/*",
//                     "User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
//                     "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
//                     "Content-Type": "application/json"
//                 }
//             }).then((response) => {
//                 return NextResponse.json({ 
//                     token: response.data.access_token,
//                     refresh_token: response.data.refresh_token,
//                     token_expiration: Date.now() + response.data.expires_in * 1000
//                 }, {status: 200});
//             }).catch((error) => {
//                 return NextResponse.json({error: error.response.data}, {status: 400});
//             })
//         } else {
//             return axios.post(url, {
//                     "refresh_token": refresh_token
//                 }).then((response) => {
//                     console.log(response.data)
//                 return NextResponse.json({ 
//                     token: response.data.token,
//                     refresh_token: response.data.refresh_token,
//                     token_expiration: response.data.token_expiration
//                 }, {status: 200});
//             }).catch((error) => {
//                 return NextResponse.json({error: error.response.data}, {status: 400});
//             })
//         }
//     } else {
//         return NextResponse.json({error: "No refresh token was found"}, {status: 400});
//     }

// }