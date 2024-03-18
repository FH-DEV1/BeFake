"use client"
import Post from "@/components/Post"
import { formatDate } from "@/components/TimeConversion"
import { FriendData } from "@/components/Types"
import { KeyboardBackspaceRounded } from "@mui/icons-material"
import axios from "axios"
import { useRouter } from "next/navigation"
import React from "react"
import { useEffect, useState } from "react"

export default function Page({ params }: { params: { userid: string } }) {
    const domain = process.env.NEXT_PUBLIC_DOMAIN
    const router = useRouter()
    const [Info, setInfo] = useState<FriendData>()
    const [swipeable, setSwipeable] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect (() => {
        let ls = typeof window !== "undefined" ? localStorage.getItem('token') : null
        let parsedls = JSON.parse(ls !== null ? ls : "")
        let token: string|null = parsedls.token
        let token_expiration: string|null = parsedls.token_expiration
        let refresh_token: string|null = parsedls.refresh_token
        setLoading(true)

        if (token && token_expiration && refresh_token && params.userid) {
            axios.get(`${domain}/api/profiles`, {
                headers: {
                    token: token,
                    token_expiration: token_expiration,
                    refresh_token: refresh_token,
                    userid: params.userid
                }
            }).then(response => {
                console.log(response.data.data)
                setInfo({data: response.data.data})
                setLoading(false)
                if (response.data.data.relationship.status == "accepted") {
                    axios.get(`${domain}/api/pinned-memories`, {
                        headers: {
                            token: token,
                            token_expiration: token_expiration,
                            refresh_token: refresh_token,
                            userid: params.userid
                        }
                    }).then(PMresult => {
                        setInfo({data: response.data.data, pinnedMemories: PMresult.data.pinned.pinnedMemories})
                    })
                    .catch(() => {
                        router.replace("/error")
                    });
                }
            })
            .catch(() => {
                router.replace("/error")
            });
        } else {
            router.replace("/error")
        }

    }, []);

    return (
        <div>
            <div className="relative">
                {
                    Info?.data.profilePicture?.url ?
                        <img
                            className="w-full object-cover"
                            src={Info?.data.profilePicture?.url}
                            alt="Profile picture"
                        /> :
                        <div className="w-full h-[40vh] bg-white/5 flex">
                            <div className="m-auto text-[25vw] text-center uppercase font-bold">{Info?.data.username.slice(0, 1)}</div>
                        </div>
                }
                <div className="top-0 left-0 right-0 px-2 pt-2 flex justify-between items-center fixed z-40">
                    <div onClick={() => router.back()}>
                        <KeyboardBackspaceRounded className='h-8 w-8'/>
                    </div>
                    <h1 className="text-white text-xl font-bold">{Info?.data.username}</h1>
                    <div className="mr-8"></div>
                </div>
                <div className="fixed top-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-30"></div>
                <div className="absolute z-20 flex-col ml-2 bottom-2">
                    <div className="z-10 items-end flex justify-between mb-2">
                        <p className="text-4xl font-bold">{Info?.data.fullname}</p>
                        <p className="bg-black h-7 ml-3 pl-2 pr-4 rounded-full">🔥{Info?.data.streakLength}</p>
                    </div>
                    <p className="text-xl">{Info?.data.biography}</p>
                    <p className="text-lg opacity-60">{Info?.data.location}</p>
                    <p className="-mt-2 text-lg opacity-60">{formatDate(Info?.data.relationship.friendedAt ? Info?.data.relationship.friendedAt : "")}</p>
                </div>
                <div className="absolute -bottom-[1px] w-full h-48 bg-gradient-to-t from-black to-transparent"></div>
            </div>
            <p className="text-3xl mt-6 ml-2 font-semibold">Pins :</p>
            <div className="flex w-full justify-around">
                {Info?.pinnedMemories ? 
                    [0, 1, 2].map((index) => (
                        <React.Fragment key={index}>
                            {Info?.pinnedMemories && Info.pinnedMemories[index] ? (
                                <div className="relative mt-3">
                                    <Post
                                        post={Info.pinnedMemories[index]}
                                        width={"small"}
                                        swipeable={swipeable}
                                        setSwipeable={setSwipeable}
                                    />
                                    <div className="absolute bottom-0 pt-2 w-full pl-1 pb-1 bg-gradient-to-b from-transparent to-black">
                                        <p className="text-sm">{new Date(Info.pinnedMemories[index].memoryDay).toLocaleString('fr-FR', { day: '2-digit', month: 'long' })}</p>
                                        <p className="text-xs opacity-80">{new Date(Info.pinnedMemories[index].memoryDay).toLocaleString('fr-FR', { year: 'numeric'})}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 flex rounded-xl bg-slate-900 w-[30vw] h-[40vw]"></div>
                            )}
                        </React.Fragment>
                    ))
                : (
                    <div className="flex flex-row justify-around w-[100vw] mt-3 animate-pulse">
                        <div className="flex rounded-xl bg-slate-900 w-[30vw] h-[40vw]"></div>
                        <div className="flex rounded-xl bg-slate-900 w-[30vw] h-[40vw]"></div>
                        <div className="flex rounded-xl bg-slate-900 w-[30vw] h-[40vw]"></div>
                    </div>
                )}
            </div>
            <p className="text-3xl mt-6 ml-2 font-semibold">{Info?.data.relationship.commonFriends.sample.length} amis en commun :</p>
            <div className="px-2 mb-6">
                {Info?.data.relationship.commonFriends.sample.map((friend) => (
                    <div key={friend.id} className="bg-white/5 rounded-lg py-2 px-4 mt-2 flex items-center" onClick={() => {
                        router.push(`/profile/${friend.id}`)
                    }}>
                        {
                            friend.profilePicture?.url ?
                                <img
                                    className="w-12 h-12 rounded-lg border-black border-2 mr-4"
                                    src={friend.profilePicture?.url}
                                    alt="Profile picture"
                                /> :
                                <div className="w-12 h-12 rounded-lg bg-white/5 relative border-full border-black justify-center align-middle flex mr-4">
                                    <div className="m-auto text-2xl uppercase font-bold">{friend.username.slice(0, 1)}</div>
                                </div>
                        }
                        <p className="text-sm text-white">
                            {friend.fullname || "@" + friend.username}
                            {
                                friend.fullname && <>
                                    <br />
                                    <span className="text-xs opacity-75">
                                        {"@" + friend.username}
                                    </span>
                                </>
                            }
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
