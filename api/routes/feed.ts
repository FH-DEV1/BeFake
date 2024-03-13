import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { FeedResponse, FriendPost, refreshDataType } from '../types/Types';

const domain = process.env.DOMAIN

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let refreshData: refreshDataType | undefined;
        let token: string | undefined = req.headers.token as string;
        const tokenExpiration: string | undefined = req.headers.token_expiration as string;
        const refreshToken: string | undefined = req.headers.refresh_token as string;
        const userId: string | undefined = req.headers.userId as string;

        if (token && tokenExpiration && refreshToken && userId) {
            const now = Date.now();
            if (now > parseInt(tokenExpiration)) {
                const response = await axios.get(`${domain}/api/refresh`, {
                    headers: {
                        refresh_token: refreshToken
                    }
                });
                refreshData = response.data;
                token = response.data.token;
            }
        } else {
            return res.status(400).json({ error: `Error: token, token_expiration, refresh_token, or userId is undefined` });
        }

        const feedResponse = await axios.get('https://mobile.bereal.com/api/feeds/friends-v1', {
            headers: {
                'authorization': `Bearer ${token}`,
                'bereal-app-version-code': '14549',
                'bereal-signature': 'MToxNzA3NDgwMjI4OvR2hbFOdgnyAz1bfiCp68ul5sVZiHnv+NAZNySEcBfD',
                'bereal-timezone': 'Europe/Paris',
                'bereal-device-id': '937v3jb942b0h6u9'
            }
        });
        
        const responseData: FeedResponse = feedResponse.data;

        if (responseData.data.friendsPosts !== undefined) {
            responseData.data.friendsPosts.sort((a: FriendPost, b: FriendPost) => new Date(b.posts[0].takenAt).getTime() - new Date(a.posts[0].takenAt).getTime());

            await Promise.all(responseData.data.friendsPosts.map(async (userPosts) => {
                userPosts.posts.sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());

                await Promise.all(userPosts.posts.map(async (post) => {
                    post.realMojis.sort((a, b) => {
                        const dateA = new Date(a.postedAt).getTime();
                        const dateB = new Date(b.postedAt).getTime();
                        if (a.user.id === userId) {
                            return -1;
                        } else if (b.user.id === userId) {
                            return 1;
                        } else {
                            return dateB - dateA;
                        }
                    });

                    if (post.location) {
                        const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${post.location.longitude},${post.location.latitude}&outSR=&forStorage=false&f=pjson`;
                        const response = await axios.get(url);
                        if (post.location) {
                            post.location.ReverseGeocode = response.data.address;
                        }
                    }
                }));
            }));
            res.locals.response = {feed: responseData, refreshData: refreshData}

            return next();
        }
    } catch (error: any) {
        if (error.response.data) {
            return res.status(400).json({ error: error.response.data });
        } else {
            return res.status(400).json({ error: error });
        }
    }
};