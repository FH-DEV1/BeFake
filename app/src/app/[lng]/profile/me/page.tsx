"use client"
import { IoArrowBack } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProfileData } from "@/components/Types";
import { UTCtoParisDate } from "@/components/TimeConversion";
import { useRouter } from "next/navigation";
import Post from "@/components/Post";
import React from "react";
import "./memory-button.css";
import axios from "axios";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";

export default function MyProfile({ params }: { params: { lng: string }}) {
    const domain = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_DEV_DOMAIN : process.env.NEXT_PUBLIC_DOMAIN
    const { t } = useTranslation(params.lng, 'client-page', {})
    const router = useRouter()
    const [MyInfo, setMyInfo] = useState<ProfileData>()
    const [loading, setLoading] = useState(false)
    const [swipeable, setSwipeable] = useState(false)

    useEffect (() => {
        let ls = typeof window !== "undefined" ? localStorage.getItem('token') : null
        let parsedls = JSON.parse(ls !== null ? ls : "")
        let token: string|null = parsedls.token
        let token_expiration: string|null = parsedls.token_expiration
        let refresh_token: string|null = parsedls.refresh_token
        let lsUser = typeof window !== "undefined" ? localStorage.getItem('myself') : null
        let parsedLSUser = JSON.parse(lsUser !== null ? lsUser : "{}")
        let userId: string|null = parsedLSUser.id
        setLoading(true)

        if (token && token_expiration && refresh_token && userId) {
            axios.get(`${domain}/api/pinned-memories`, {
                headers: {
                    token: token,
                    token_expiration: token_expiration,
                    refresh_token: refresh_token,
                    userid: userId
                }
            }).then(PMresult => {
                setMyInfo({data: parsedLSUser, pinnedMemories: PMresult.data.pinned.pinnedMemories})
                setLoading(false)
            })
            .catch(() => {
                router.replace(`/${params.lng}/error`)
            });
        } else {
            router.replace(`/${params.lng}/error`)
        }

    }, []);

    const handleLogout = () => {
        const confirmation = window.confirm(t("LogoutConfirm"));
        if (confirmation) {
            localStorage.clear();
            router.replace(`/${params.lng}/login/phone-number`);
        }
    };

    return (
        <div className='flex flex-col justify-between items-center mt-[0.5vh] h-[99.5vh]'>
            <div className='flex items-center justify-between p-2 absolute left-1 right-1 z-40'>
                <button
                    onClick={() => router.back()}
                    className='flex items-center justify-center rounded-lg transition-all transform hover:scale-105 px-2 py-1'
                >
                    <IoArrowBack className='h-8 w-8'/>
                </button>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-lg font-semibold'>{t('Profile')}</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className='flex items-center justify-center rounded-lg transition-all transform hover:scale-105 px-2 py-1 text-red-500'
                >
                    <TbLogout className='h-8 w-8'/>
                </button>
            </div>

            <div className='flex flex-col items-center mt-[8vh]'>
                {loading ? (
                    <div className='animate-pulse flex flex-col items-center justify-center'>
                        <div className='rounded-full bg-slate-900 h-36 w-36'></div>
                        <div className='rounded-full bg-slate-900 h-10 w-24 mt-5'></div>
                        <div className='rounded bg-slate-900 mt-2 h-2 w-20'></div>
                        <div className='flex flex-row justify-around w-[100vw] mt-5'>
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className='flex rounded-full bg-slate-900 h-20 w-20'></div>
                            ))}
                        </div>
                        <div className='rounded bg-slate-900 mt-6 h-2 w-32'></div>
                        <div className='flex flex-row justify-around w-[100vw] mt-5'>
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className='flex rounded-xl bg-slate-900 w-[30vw] h-[40vw]'></div>
                            ))}
                        </div>
                        <div className='flex rounded-xl bg-slate-900 w-40 h-10 mt-10'></div>
                        <div className='rounded bg-slate-900 mt-10 h-2 w-56'></div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center'>
                        {MyInfo?.data.profilePicture.url ? (
                            <Image className='h-36 w-36 rounded-full' src={MyInfo?.data.profilePicture?.url} height={1000} width={1000} alt='Profile Picture' />
                        ) : (
                            <div className='h-36 w-36 rounded-full bg-white/5 relative border-full border-black justify-center align-middle flex mx-auto'>
                                <div className='m-auto text-2xl uppercase font-bold'>
                                    {MyInfo?.data.username.slice(0, 1)}
                                </div>
                            </div>
                        )}
                        <p className='text-2xl font-bold text-center mt-4'>{MyInfo?.data.fullname || '@' + MyInfo?.data.username}</p>
                        <p className='text-lg font-medium text-center'>{MyInfo?.data.username}</p>
                        {MyInfo?.data.biography && (
                            <div className='text-gray-400 text-center'>{MyInfo?.data.biography}</div>
                        )}
                        {MyInfo?.data.location && (
                            <div className='text-gray-400 text-center'>{MyInfo?.data.location}</div>
                        )}
                        {MyInfo?.data.streakLength && (
                            <div className='flex items-center justify-center mt-2 mb-2'>
                                <p className='text-base font-bold'>
                                🔥{MyInfo?.data.streakLength}{' '}
                                </p>
                            </div>
                        )}

                        <div onClick={() => toast.warn(t("UnavailableYet"))} className='bg-zinc-900 rounded-xl py-3 border-2 border-zinc-700 w-[98vw] flex flex-col justify-center'>
                            <div className='flex flex-row justify-around'>
                                {['👍', '😃', '😲', '😍', '😂'].map(emoji => {
                                    const realmoji = MyInfo?.data.realmojis.find(realmoji => realmoji.emoji === emoji);
                                    return (
                                        <div key={emoji} className='flex flex-col items-end'>
                                            {realmoji?.media.url ? (
                                                <>
                                                    <Image className='rounded-full h-16 w-16' src={realmoji.media.url} height={500} width={500} alt={emoji} />
                                                    <p className='-mt-6 -mr-2 text-2xl'>{emoji}</p>
                                                </>
                                            ) : (
                                                <div className='rounded-full h-16 w-16 flex items-center justify-center border-2 border-dashed border-gray-500'>
                                                    <p className='text-2xl'>{emoji}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className='mt-2 w-full text-center'>{t('ChangeRealMojis')}</p>
                        </div>

                        <div className='flex w-full justify-around mt-6'>
                            {[0, 1, 2].map((index) => (
                                <React.Fragment key={index}>
                                    {MyInfo?.pinnedMemories && MyInfo.pinnedMemories[index] ? (
                                        <div className='relative'>
                                            <Post
                                                post={MyInfo.pinnedMemories[index]}
                                                width={'small'}
                                                swipeable={swipeable}
                                                setSwipeable={setSwipeable} />
                                            <div className='absolute bottom-0 pt-2 w-full pl-1 pb-1 bg-gradient-to-b from-transparent to-black'>
                                                <p className='text-sm font-semibold'>{new Date(MyInfo.pinnedMemories[index].memoryDay).toLocaleString('fr-FR', { day: '2-digit', month: 'long' })}</p>
                                                <p className='text-xs opacity-80 font-normal'>{new Date(MyInfo.pinnedMemories[index].memoryDay).toLocaleString('fr-FR', { year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className='w-[30vw] rounded-xl border-2 border-dashed border-gray-500 text-white opacity-80 flex justify-center items-center aspect-[1.5/2]'
                                            onClick={() => toast.warning(t("UnavailableYet"))}
                                        >
                                            <FaPlus className='h-6 w-6'/>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        {/* <button onClick={() => toast.warn(t("UnavailableYet"))} className="button mt-7">{t("Memories")}</button> */}
                    </div>
                )}
            </div>
            <p className={`text-xs mb-5 ${loading ? 'hidden' : ''}`}>
                {t('ActiveSince', { date: UTCtoParisDate(MyInfo?.data.createdAt ? MyInfo.data.createdAt : '', params.lng as 'fr' | 'en') })}
            </p>
        </div>
    )
};