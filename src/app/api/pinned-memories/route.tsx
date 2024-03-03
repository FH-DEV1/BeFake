import { NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req: Request) => {
    const token = req.headers.get("token")
    const userId = req.headers.get("userId")
    if (!token) {
      throw new Error('Token not found in headers');
    }
    if (!userId) {
        throw new Error('UserId not found in headers');
      }

    let headers = {
        'authorization': `Bearer ${token}`,
        'bereal-app-version-code': '14549',
        'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
        'bereal-timezone': 'Europe/Paris',
        'bereal-device-id': '937v3jb942b0h6u9'
    }
    try {
        const response = await axios.request({
            url: `https://mobile.bereal.com/api/feeds/memories-v1/pinned-memories/for-user/${userId}`,
            method: "GET",
            headers: headers,
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.log(error.response.data);
        return NextResponse.json({ status: "error", error: error.response.data });
    }
}