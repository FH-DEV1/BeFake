import { NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req: Request) => {
    let data: any[] = [];
    const token = req.headers.get("token");
    if (!token) {
        throw new Error('Token not found in headers');
    }

    let headers = {
        'authorization': `Bearer ${token}`,
        'bereal-app-version-code': '14549',
        'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
        'bereal-timezone': 'Europe/Paris',
        'bereal-device-id': '937v3jb942b0h6u9'
    };

    try {
        let nextPage: string|null = "https://mobile.bereal.com/api/feeds/friends-of-friends";

        while (nextPage) {
            const response: any = await axios.request({
                url: nextPage,
                method: "GET",
                headers: headers,
            });

            data = data.concat(response.data.data);

            nextPage = response.data.next ? `https://mobile.bereal.com/api/feeds/friends-of-friends?page=${response.data.next}` : null;
        }

        return NextResponse.json({data: data});
    } catch (error: any) {
        console.log(error.response.data);
        return NextResponse.json({ status: "error", error: error.response.data });
    }
};
