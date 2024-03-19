"use client"
import { useTranslation } from '@/app/i18n/client'
import { useFeedState } from '@/components/FeedContext'
import Post from '@/components/Post'
import { UTCtoParisTime, formatTimeLate } from '@/components/TimeConversion'
import { FOFPost } from '@/components/Types'
import { KeyboardBackspaceRounded, NearMe, PersonRounded, ScreenRotationAlt } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page({ params }: { params: { username: string, lng: string } }) {
    const { t } = useTranslation(params.lng, 'client-page', {})
    const router = useRouter()
    const { fof } = useFeedState();
    const [swipeable, setSwipeable] = useState<boolean>(false);
    const [post, setPost] = useState<FOFPost>()

    useEffect(() => {
        if (fof.data) {
            for (const fofPost of fof.data || []) {
                if (fofPost.user.username === params.username) {
                    setPost(fofPost);
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
                    <KeyboardBackspaceRounded className='h-8 w-8'/>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-xl'>{t("FriendBerealTitle", {name: params.username})}</h1>
                    <p className='opacity-60'>{UTCtoParisTime(post?.takenAt ? post?.takenAt : "1999-12-31T23:00:00.000Z")}{post?.lateInSeconds !== 0 ? ` - ${t("TimeLate", {time: formatTimeLate(post?.lateInSeconds ? post?.lateInSeconds : 0)})}` : ""}</p>
                </div>
                <div className='' onClick={() => router.push(`/${params.lng}/profile/${post?.user.id}`)}>
                    <PersonRounded className='h-8 w-8'/>
                </div>
            </div>
            <div className='flex justify-center mt-6'>
                {post ? 
                <Post
                    post={post}
                    width={"large"}
                    swipeable={swipeable}
                    setSwipeable={setSwipeable}
                />
                : ""}
            </div>
            <div className='flex items-center w-full justify-center'>
                <div className={`${post?.location ? "block" : "hidden"} mx-2 bg-zinc-800 flex pr-2 mt-5 rounded-full text-white`}>
                    <NearMe className='text-white p-1'/>
                    <a
                        className='text-sm opacity-60 cursor-pointer'
                        target="_blank"
                        rel="noopener noreferrer"
                        href={post?.location ? `https://www.google.com/maps/?q=${post?.location?.latitude},${post?.location?.longitude}` : undefined}
                        onClick={(e) => {
                        if (!post?.location) {
                            e.preventDefault();
                        }
                        }}
                    >
                        {post?.location?.ReverseGeocode ? `${post?.location?.ReverseGeocode?.City}, ${post?.location?.ReverseGeocode?.CntryName}` : t("OpenInMaps")}
                    </a>
                </div>
            </div>
            <span className='mt-5 mb-3 h-[1px] bg-white opacity-20'/>
            <div className=" overflow-x-clip">
                <div className="flex flex-nowrap overflow-auto pb-2">
                    {post?.realmojis.sample?.map((item, index) => (
                        <div key={index} className="flex flex-col items-center -mr-2">
                            <img src={item.media.url} alt={`Image ${index}`} className="w-16 h-16 rounded-full" />
                            <div className="text-right ml-16 -mt-8 text-3xl">{item.emoji}</div>
                            <div className="text-center mb-1 text-xs">{item.user.username}</div>
                        </div>
                    ))}
                </div>
            </div>
            <span className='h-[1px] bg-white opacity-20'/>
        </div>
    )
}
