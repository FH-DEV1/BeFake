import { NextResponse } from 'next/server';
import axios from 'axios';
import { refreshData } from '@/components/Types';

export const GET = async (req: Request) => {
    let token: string|null = req.headers.get("token");
    let token_expiration: string|null = req.headers.get("token_expiration");
    let refresh_token: string|null = req.headers.get("refresh_token");
    let userId: string|null = req.headers.get("userId");
    let refresh_data: refreshData|undefined = undefined
    let data: any[] = [];

    if (token && token_expiration && refresh_token) {
        let now = Date.now();
        if (now > parseInt(token_expiration)) {
            // en local utiliser : http://localhost:3000/api/refresh
            // en deploiment utiliser /api/refresh
            let url = `https://befakeapi.netlify.app/api/refresh`
            await axios.get(url, {
                headers: {
                    refresh_token: refresh_token
                }
            })
            .then((response) => {
                refresh_data = response.data
                token = response.data.token
            }).catch((error) => {
                return NextResponse.json({error: `Error refreshing token : ${error.response}`}, {status: 400});
            })
        }
    } else {
        return NextResponse.json({error: `Error : token or token_expiration or refresh_token is undefined`}, {status: 400});
    }

    let nextPage: string|null = "https://mobile.bereal.com/api/feeds/friends-of-friends";

    while (nextPage) {
        await axios.get(nextPage, {
            headers: {
                'authorization': `Bearer ${token}`,
                'bereal-app-version-code': '14549',
                'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
                'bereal-timezone': 'Europe/Paris',
                'bereal-device-id': '937v3jb942b0h6u9'
            }
        }).then(response => {
            data = data.concat(response.data.data);
            nextPage = response.data.next ? `https://mobile.bereal.com/api/feeds/friends-of-friends?page=${response.data.next}` : null;
        }).catch(error => {
            return NextResponse.json({error: error.response.data}, {status: 400});
        })
    }
   return NextResponse.json({ data: data, refresh_data: refresh_data }, { status: 200 });
};