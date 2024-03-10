import { NextResponse } from 'next/server';
import axios from 'axios';
import { FeedResponse, FriendPost, refreshData } from '@/components/Types';

export const GET = async (req: Request) => {
    let token: string|null = req.headers.get("token");
    let token_expiration: string|null = req.headers.get("token_expiration");
    let refresh_token: string|null = req.headers.get("refresh_token");
    let userId: string|null = req.headers.get("userId");
    let refresh_data: refreshData|undefined = undefined
    if (token && token_expiration && refresh_token) {
        let now = Date.now();
        if (now > parseInt(token_expiration)) {
            // en local utiliser : http://localhost:3000/api/refresh
            // en deploiment utiliser /api/refresh
            let url = `${process.env.NODE_ENV === "development" ? process.env.DEV : ""}/api/refresh`
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
    return axios.get("https://mobile.bereal.com/api/feeds/friends-v1", {
        headers: {
            'authorization': `Bearer ${token}`,
            'bereal-app-version-code': '14549',
            'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
            'bereal-timezone': 'Europe/Paris',
            'bereal-device-id': '937v3jb942b0h6u9'
        }
    }).then(async (response: FeedResponse) => {
        if (response.data.friendsPosts!==undefined) {
            response.data.friendsPosts.sort((a: FriendPost, b: FriendPost) => new Date(b.posts[0].takenAt).getTime() - new Date(a.posts[0].takenAt).getTime());
            await Promise.all(response.data.friendsPosts.map(async (userPosts) => {
                userPosts.posts.sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());
                await Promise.all(userPosts.posts.map(async (post) => {
                    post.realMojis.sort((a, b) => {
                        const dateA = new Date(a.postedAt).getTime();
                        const dateB = new Date(b.postedAt).getTime();
                        if (a.user.id === userId) {
                            return -1;
                        }
                        else if (b.user.id === userId) {
                            return 1;
                        }
                        else {
                            return dateB - dateA;
                        }
                    });
                    if (post.location) {
                        let url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${post.location.longitude},${post.location.latitude}&outSR=&forStorage=false&f=pjson`;
                        await axios.get(url)
                        .then((response) => {
                            if (post.location) {
                                post.location.ReverseGeocode = response.data.address;
                            }
                        })
                        .catch((error) => {
                            console.log(error.response)
                        })
                    }
                }));
            }));
            return NextResponse.json({ feed: response.data, refresh_data: refresh_data }, { status: 200 });
        }
    }).catch((error) => {
        return NextResponse.json({error: error.response.data, refresh_data: refresh_data}, {status: 400});
    })
}