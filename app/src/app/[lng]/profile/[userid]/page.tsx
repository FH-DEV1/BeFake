"use client"
import { useTranslation } from "@/app/i18n/client"
import Post from "@/components/Post"
import { formatDate } from "@/components/TimeConversion"
import { FriendData } from "@/components/Types"
import { IoArrowBack } from "react-icons/io5";
import axios from "axios"
import { useRouter } from "next/navigation"
import React, { Fragment } from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, Transition } from "@headlessui/react"

export default function Page({ params }: { params: { userid: string, lng: string } }) {
    const domain = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_DEV_DOMAIN : process.env.NEXT_PUBLIC_DOMAIN
    const { t } = useTranslation(params.lng, 'client-page', {})
    const router = useRouter()
    const [Info, setInfo] = useState<FriendData>()
    const [swipeable, setSwipeable] = useState(true)
    const [loading, setLoading] = useState(false)
    const [ModalVisible, setModalVisible] = useState(false)

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
                        router.replace(`/${params.lng}/error`)
                    });
                }
            })
            .catch(() => {
                router.replace(`/${params.lng}/error`)
            });
        } else {
            router.replace(`/${params.lng}/error`)
        }

    }, []);

    return (
        <div>
            <div className='relative'>
                {Info?.data.profilePicture?.url ? (
                <Image
                    className='w-full object-cover'
                    src={Info?.data.profilePicture?.url}
                    height={1000}
                    width={1000}
                    alt='Profile picture'
                />
                ) : (
                <div className='w-full h-[40vh] bg-white/5 flex'>
                    <div className='m-auto text-[25vw] text-center uppercase font-bold'>{Info?.data.username.slice(0, 1)}</div>
                </div>
                )}
                <div className='top-0 left-0 right-0 px-2 pt-2 flex justify-between items-center fixed z-40'>
                <div onClick={() => router.back()}>
                    <IoArrowBack className='h-8 w-8'/>
                </div>
                <h1 className='text-base text-white font-semibold'>{Info?.data.username}</h1>
                <div className='mr-8'></div>
                </div>
                <div className='fixed top-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-30'></div>
                <div className='absolute z-20 flex-col ml-2 bottom-2'>
                <div className='text-xl font-semibold mb-2 flex items-center'>
                    <span>
                    {Info?.data.fullname || Info?.data.username}
                    </span>
                    {Info?.data.streakLength! > 5 && (
                    <div className='ml-2 flex items-center bg-black text-white rounded-full p-1 mt-1'>
                        <span className='text-sm mr-2'>
                        🔥{Info?.data.streakLength}
                        </span>
                    </div>
                    )}
                </div>
                <div className='text-xs text-white'>
                    {Info?.data.biography}
                </div>
                <div className='text-xs text-white/50'>
                    {Info?.data.relationship?.friendedAt && params.lng && (
                    <>
                        {t('FriendedAt', {time: formatDate(Info?.data.relationship?.friendedAt, t)})}
                        <br />
                    </>
                    )}
                </div>
                </div>
                <div className='absolute -bottom-[1px] w-full h-48 bg-gradient-to-t from-black to-transparent'></div>
            </div>

            <div onClick={() => setModalVisible(true)}>
            {Info?.data.relationship?.commonFriends &&
            Info?.data.relationship?.commonFriends?.total > 0 && (
                <div className='ml-5 mt-4 flex flex-row items-center z-40'>
                {Info?.data.relationship?.commonFriends?.sample
                    .slice(0, 3)
                    .map((friend, index: number) => (
                    <div className='flex flex-row -ml-2.5 relative' key={index}>
                        {friend.profilePicture ? (
                        <Image
                        className={`w-6 h-6 rounded-full border border-black relative z-0 transition-all transform hover:scale-105`}
                        src={friend.profilePicture?.url!}
                        height={1000}
                        width={1000}
                        alt={`${friend.username} Avatar`}
                        />
                        ) : (
                            <div className='w-6 h-6 bg-white/20 flex rounded-full'>
                                <div className='m-auto text-xs text-center uppercase font-bold'>{friend.username.slice(0, 1)}</div>
                            </div>
                        )}
                        {index === 2 &&
                        Info?.data.relationship?.commonFriends?.sample
                            .length > 2 && (
                            <div
                            className={`absolute flex items-center justify-center text-white text-sm h-6 w-6 rounded-full bg-black bg-opacity-70 z-10`}
                            >
                            +{Info?.data.relationship?.commonFriends?.sample
                                .length - 2}
                            </div>
                        )}
                    </div>
                    ))}

                <p className='ml-2 text-xs text-white/75'>
                    {t('FriendsWith')}
                    {Info?.data.relationship?.commonFriends?.sample
                    .slice(0, 2)
                    .map((friend, index, array) => (
                        <span key={index}>
                        <b>{friend.username}</b>
                        {index < array.length - 1 && ', '}
                        </span>
                    ))}
                    {Info?.data.relationship?.commonFriends?.total && 
                    Info.data.relationship.commonFriends.total > 3 && (
                        <>
                        {t('AndManyOthers', {number: Info.data.relationship.commonFriends.total - 2})}
                        </>
                    )}
                </p>
                </div>
            )}
            </div>

            <p className='text-normal mt-6 ml-2 font-semibold'>{Info?.pinnedMemories && Info.pinnedMemories.length !== 0 ? t('Pins'): ""}</p>
            <div className="flex w-full justify-around">
                {Info?.pinnedMemories ? 
                    Info.pinnedMemories.map((pinnedMemory, index) => (
                        <React.Fragment key={index}>
                            {Info?.pinnedMemories && pinnedMemory ? (
                                <div className="relative mt-3">
                                    <Post
                                        post={pinnedMemory}
                                        width={"small"}
                                        swipeable={swipeable}
                                        setSwipeable={setSwipeable}
                                    />
                                    <div className="absolute bottom-0 pt-2 w-full pl-1 pb-1 bg-gradient-to-b from-transparent to-black">
                                        <p className="text-sm">{new Date(pinnedMemory.memoryDay).toLocaleString('fr-FR', { day: '2-digit', month: 'long' })}</p>
                                        <p className="text-xs opacity-80">{new Date(pinnedMemory.memoryDay).toLocaleString('fr-FR', { year: 'numeric'})}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 flex rounded-xl bg-gray-900 w-[30vw] h-[40vw]"></div>
                            )}
                        </React.Fragment>
                    ))
                : (
                    <div className="flex flex-row justify-around w-[100vw] mt-3 animate-pulse">
                        <div className="flex rounded-xl bg-gray-900 w-[30vw] h-[40vw]"></div>
                        <div className="flex rounded-xl bg-gray-900 w-[30vw] h-[40vw]"></div>
                        <div className="flex rounded-xl bg-gray-900 w-[30vw] h-[40vw]"></div>
                    </div>
                )}
            </div>

            
            {/* heavily inspired from https://github.com/macedonga/beunblurred */}
            <Transition appear show={ModalVisible} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[60]"
                    onClose={() => setModalVisible(false)}
                >
                        <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        >
                        <div className="fixed inset-0 bg-black backdrop-blur bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed lg:inset-0 bottom-0 inset-x-0 overflow-y-hidden w-full">
                        <div className="flex min-h-full items-center justify-center text-center">
                            <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="bottom-0 opacity-0 lg:scale-95 translate-y-10 lg:translate-y-0 translate-x-0"
                            enterTo="opacity-100 lg:scale-100 translate-y-0 translate-x-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 lg:scale-100 translate-y-0 translate-x-0"
                            leaveTo="opacity-0 lg:scale-95 translate-y-10 lg:translate-y-0 translate-x-0"
                            >
                            <Dialog.Panel
                                className={`
                                    lg:max-w-md max-w-none w-full z-[70]
                                    transform overflow-hidden rounded-t-lg lg:rounded-b-lg mx-4 max-h-[90vh]
                                    border-2 border-white/10 bg-[#0d0d0d] lg:border-b-2 border-b-0
                                    text-left align-middle shadow-xl transition-all overflow-y-auto
                                `}
                            >
                                <div className="m-6 mb-4 pb-4 border-b-2 border-white/10">
                                <Dialog.Title
                                    as="h2"
                                    className={"m-0 text-center text-2xl font-bold"}
                                >
                                    {t("CommonFriends", {number: Info?.data.relationship.commonFriends.sample.length})}
                                </Dialog.Title>
                                </div>

                                <div className="mx-6 mb-3 mt-2">
                                    {Info?.data.relationship.commonFriends.sample.map((friend) => (
                                        <div key={friend.id} className="bg-white/5 rounded-lg py-2 px-4 mt-2 flex items-center" onClick={() => {
                                            router.push(`/${params.lng}/profile/${friend.id}`)
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

                                <div className="grid gap-y-4 mb-6 mx-6">
                                <button
                                    className={`
                                        text-center  py-2 px-4 w-full rounded-lg outline-none bg-red-600 relative 
                                        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:bg-red-500 
                                    `}
                                    onClick={() => setModalVisible(false)}
                                >
                                    {t("Close")}
                                </button>
                                </div>
                            </Dialog.Panel>
                            </Transition.Child>
                        </div>
                        </div>
                    </Dialog>
            </Transition>
        </div>
    )
}
