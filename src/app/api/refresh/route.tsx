import { NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req: Request) => {
    let refresh_token: string|null = req.headers.get("refresh_token");
    let url = process.env.PIPEDREAM_URL ? process.env.PIPEDREAM_URL : ""
    if (refresh_token) {
        if (process.env.VERCEL_HOSTED !== "TRUE" && process.env.NODE_ENV === "development") {
            return axios.post("https://auth.bereal.team/token?grant_type=refresh_token",
                JSON.stringify({
                    "grant_type": "refresh_token",
                    "client_id": "ios",
                    "client_secret": "962D357B-B134-4AB6-8F53-BEA2B7255420",
                    "refresh_token": refresh_token
                }),{
                headers: {
                    "Accept": "*/*",
                    "User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
                    "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                return NextResponse.json({ 
                    token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                    token_expiration: Date.now() + response.data.expires_in * 1000
                }, {status: 200});
            }).catch((error) => {
                return NextResponse.json({error: error.response.data}, {status: 400});
            })
        } else {
            return axios.post(url, {
                    "refresh_token": refresh_token
                }).then((response) => {
                    console.log(response.data)
                return NextResponse.json({ 
                    token: response.data.token,
                    refresh_token: response.data.refresh_token,
                    token_expiration: response.data.token_expiration
                }, {status: 200});
            }).catch((error) => {
                return NextResponse.json({error: error.response.data}, {status: 400});
            })
        }
    } else {
        return NextResponse.json({error: "No refresh token was found"}, {status: 400});
    }

}