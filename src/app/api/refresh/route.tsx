import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: Request) => {
    let body = await req.json();
    let refresh_token = body.refresh;
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
        "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
        "Content-Type": "application/json"
    }
    let refresh_body = JSON.stringify({
        "grant_type": "refresh_token",
        "client_id": "ios",
        "client_secret": "962D357B-B134-4AB6-8F53-BEA2B7255420",
        "refresh_token": refresh_token
    });
    let refresh_options = {
        url: "https://auth.bereal.team/token?grant_type=refresh_token",
        method: "POST",
        headers: headersList,
        data: refresh_body,
    }

    try {
        let res = await axios.request(refresh_options);
        return NextResponse.json({ 
            status: "success", 
            token: res.data.access_token,
            refresh: res.data.refresh_token,
            expiration: Date.now() + res.data.expires_in * 1000
        });
    
    } catch (error: any) {
        console.log(error.response.data);
        return NextResponse.json({ status: "error", error: error.response.data });
    }

}