"use client"
import { useTranslation } from '@/app/i18n/client'
import { useFeedState } from '@/components/FeedContext'
import Post from '@/components/Post'
import { UTCtoParisTime, formatTimeLate } from '@/components/TimeConversion'
import { FriendPost } from '@/components/Types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { IoArrowBack, IoPerson } from 'react-icons/io5'
import { FaLocationArrow } from "react-icons/fa";
import { MdOutlineScreenRotationAlt } from "react-icons/md";
import Image from 'next/image'

export default function Page({ params }: { params: { username: string, lng: string } }) {
    const { t } = useTranslation(params.lng, 'client-page', {})
    const router = useRouter()
    const searchParams = useSearchParams()
    const { feed } = useFeedState();
    const [swipeable, setSwipeable] = useState<boolean>(false);
    const [posts, setPosts] = useState<FriendPost>()
    const [index, setIndex] = useState<number>(searchParams.get('index') == null ? 0 : Number(searchParams.get('index')))

    useEffect(() => {
        if (feed.friendsPosts) {
            for (const friendPost of feed.friendsPosts || []) {
                if (friendPost.user.username === params.username) {
                    setPosts(friendPost);
                }
            }
        } else {
            router.replace(`/${params.lng}/feed`)
        }
    }, []);

    return (
        <div className="flex flex-col">
            <div className='flex flex-row mt-5 mx-5 justify-between items-center'>
                <div className='' onClick={() => {router.back()}}>
                    <IoArrowBack className='h-8 w-8'/>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-xl'>{t("FriendBerealTitle", {name: params.username})}</h1>
                    <p className='opacity-60'>{UTCtoParisTime(posts?.posts[posts.posts.length-index-1]?.takenAt ? posts?.posts[posts.posts.length-index-1]?.takenAt : "1999-12-31T23:00:00.000Z", t)}{posts?.posts[index]?.lateInSeconds !== 0 ? ` - ${t("TimeLate", {time: formatTimeLate(posts?.posts[index]?.lateInSeconds ? posts.posts[index].lateInSeconds : 0)})}` : ""}</p>
                </div>
                <div className='' onClick={() => router.push(`/${params.lng}/profile/${posts?.user.id}`)}>
                    <IoPerson className='h-8 w-8'/>
                </div>
            </div>
            <div className='flex justify-center mt-6'>
                <SwipeableViews
                    index={index}
                    disabled={swipeable}
                    onChangeIndex={(idx) => setIndex(idx)}
                    className={posts?.posts.length == 1 ? "" : "pr-[27vw] pl-[35vw]"}
                >
                    {posts?.posts.map((post, idx) => (
                        <div key={idx} className={`${index === posts.posts.length - idx - 1 ? 'opacity-100' : 'opacity-50'}`}>
                            <Post
                                post={post}
                                width={"small"}
                                swipeable={swipeable}
                                setSwipeable={setSwipeable}
                            />
                        </div>
                    )).reverse()}
                </SwipeableViews>
            </div>
            <div className='flex items-center w-full justify-center'>
                <div className={`${posts?.posts[posts.posts.length-index-1]?.location ? "block" : "hidden"} mx-2 bg-zinc-800 flex pr-2 pl-1 mt-5 rounded-full text-white`}>
                    <FaLocationArrow className='p-1 h-5 w-5 text-white/60'/>
                    <a
                        className='text-sm -mt-0.5 opacity-60 cursor-pointer'
                        target="_blank"
                        rel="noopener noreferrer"
                        href={posts?.posts[posts.posts.length-index-1]?.location ? `https://www.google.com/maps/?q=${posts?.posts[posts.posts.length-index-1]?.location?.latitude},${posts?.posts[posts.posts.length-index-1]?.location?.longitude}` : undefined}
                        onClick={(e) => {
                        if (!posts?.posts[posts.posts.length-index-1]?.location) {
                            e.preventDefault();
                        }
                        }}
                    >
                        {posts?.posts[posts.posts.length-index-1]?.location?.ReverseGeocode ? `${posts?.posts[posts.posts.length-index-1]?.location?.ReverseGeocode?.City}, ${posts?.posts[posts.posts.length-index-1]?.location?.ReverseGeocode?.CntryName}` : t("OpenInMaps")}
                    </a>
                </div>
                <div className={`${posts?.posts[posts.posts.length-index-1]?.retakeCounter ? posts.posts[posts.posts.length-index-1].retakeCounter > 0 ? posts.posts[posts.posts.length-index-1].retakeCounter > 1 ? "block w-[95px]" : "block w-[87px]": "hidden" : "hidden"} mx-2 bg-zinc-800 flex pl-1 mt-5 items-center rounded-full text-white`}>
                    <MdOutlineScreenRotationAlt className='p-0.5 h-5 w-5 text-white/60'/>
                    <p className='text-sm -mt-0.5 opacity-60 cursor-pointer'>{posts?.posts[posts.posts.length-index-1]?.retakeCounter ? posts.posts[posts.posts.length-index-1].retakeCounter > 1 ? t("Retakes", {number: posts.posts[posts.posts.length-index-1].retakeCounter}) : t("OneRetake") : ""}</p>
                </div>
            </div>
            <span className='mt-5 mb-3 h-[1px] bg-white opacity-20'/>
            <div className=" overflow-x-clip">
                <div className="flex flex-nowrap overflow-auto pb-2">
                    {posts?.posts[posts.posts.length-index-1].realMojis?.map((item, index) => (
                        <div key={index} className="flex flex-col items-center -mr-2">
                            <Image 
                            width={item.media.width}
                            height={item.media.height}
                            src={item.media.url} 
                            alt={`Image ${index}`} 
                            className="w-16 h-16 rounded-full" 
                            referrerPolicy='no-referrer'/>
                            <div className="text-right ml-16 -mt-8 text-3xl">{item.emoji}</div>
                            <div className="text-center mb-1 text-xs">{item.user.username}</div>
                        </div>
                    ))}
                </div>
            </div>
            <span className='h-[1px] bg-white opacity-20'/>
            <div>
                {posts?.posts[posts.posts.length-index-1]?.comments?.map((comment) => (
                    <div className='flex mt-3 mb-5 ml-2'>
                        {comment.user.profilePicture ? (
                        <Image
                        width={comment.user.profilePicture.width}
                        height={comment.user.profilePicture.height}
                        src={comment.user.profilePicture.url}
                        alt={`${comment.user.username}'s profile`} 
                        className='w-9 h-9 rounded-full' 
                        referrerPolicy='no-referrer'/>
                        ) : (
                        <div className='w-8 h-8 rounded-full bg-white/5 border-full border-black justify-center align-middle flex mr-2 cursor-pointer'>
                            <div className='m-auto text-xl uppercase font-bold'>
                                {comment.user.username ? comment.user.username.slice(0, 1) : ''}
                            </div>
                        </div>
                        )}
                        <div className='flex flex-col ml-2'>
                            <div className='flex flex-row text-sm'>
                                <p>{comment.user.username}</p>
                                <p className='ml-2 opacity-60'>{UTCtoParisTime(comment.postedAt, t)}</p>
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
