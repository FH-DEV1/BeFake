import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const token = req.headers.token as string;
    if (!token) {
      throw new Error('Token not found in headers');
    }

    let headers = {
        accept: "application/json",
        "content-type": "application/json",
        "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${token}`,
        'bereal-app-version-code': '14549',
        'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
        'bereal-timezone': 'Europe/Paris',
        'bereal-device-id': '937v3jb942b0h6u9'
    }
    return axios.request({
        url: "https://mobile.bereal.com/api/feeds/friends-v1",
        method: "GET",
        headers: headers,
    }).then(
        (response) => {
            res.status(200).json(response.data);
        }
    ).catch(
        (error) => {
            console.log(error.response.data);
            res.status(400).json({ status: "error", error: error.response.data });
        }
    )
}