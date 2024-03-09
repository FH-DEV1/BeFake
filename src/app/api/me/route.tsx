import { NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req: Request) => {
    let token: string|null = req.headers.get("token");
    if (!token) {
      return NextResponse.json({ error: "token not found in header" }, { status: 400 });
    }

    return axios.get("https://mobile.bereal.com/api/person/me", {
        headers: {
            'authorization': `Bearer ${token}`,
            'bereal-app-version-code': '14549',
            'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
            'bereal-timezone': 'Europe/Paris',
            'bereal-device-id': '937v3jb942b0h6u9'
        }
    }).then(response => {
        return NextResponse.json({ data: response.data }, { status: 200 });
    }).catch(error => {
        return NextResponse.json({ error: error.response.data }, { status: 400 });
    })
}