"use client"
import { useTranslation } from '@/app/i18n/client'
import { useFeedState } from '@/components/FeedContext'
import Post from '@/components/Post'
import { UTCtoParisTime, formatTimeLate } from '@/components/TimeConversion'
import { FeedType, FriendPost } from '@/components/Types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { IoArrowBack, IoPerson, IoSend } from 'react-icons/io5'
import { FaLocationArrow, FaTrash } from "react-icons/fa";
import { MdOutlineScreenRotationAlt } from "react-icons/md";
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Transition } from '@headlessui/react'
import Realmojis from '@/components/Realmojis'
import { dataIsValid } from '@/components/Functions'

export default function Page({ params }: { params: { username: string, lng: string } }) {
    const domain = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_DOMAIN : process.env.NEXT_PUBLIC_DOMAIN;
    const { t } = useTranslation(params.lng, 'client-page', {})
    const router = useRouter()

    const searchParams = useSearchParams()
    const [index, setIndex] = useState<number>(searchParams.get('index') == null ? 0 : Number(searchParams.get('index')))

    const { feed, setFeed } = useFeedState();
    const [swipeable, setSwipeable] = useState<boolean>(false);
    const [posts, setPosts] = useState<FriendPost>()
    const [ShowRealMojis, setShowRealMojis] = useState<{[key: string]: boolean}>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');

    const lsUser = typeof window !== "undefined" ? localStorage.getItem('myself') : null
    const parsedLSUser = JSON.parse(lsUser !== null ? lsUser : "{}")

    useEffect(() => {
        if(!dataIsValid()){
            router.replace(`/${params.lng}/login/phone-number`)
        }
    })
    
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

    const [delaySwitch, setDelaySwitch] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        if (posts && ShowRealMojis[posts.posts[posts.posts.length-index-1].id]) {
            const timer = setTimeout(() => {
                setDelaySwitch(delaySwitch => ({...delaySwitch, [posts.posts[posts.posts.length-index-1].id]: true }));
            }, 250);
            return () => clearTimeout(timer);
        } else if (posts) {
            setDelaySwitch(delaySwitch => ({...delaySwitch, [posts.posts[posts.posts.length-index-1].id]: false }));
        }
    }, [ShowRealMojis]);

    const handleSendComment = async (postId: string, userId: string, comment: string) => {
        let lsToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        let parsedLSToken = JSON.parse(lsToken !== null ? lsToken : '{}')
        let token: string|null = parsedLSToken.token
        let token_expiration: string|null = parsedLSToken.token_expiration
        let refresh_token: string|null = parsedLSToken.refresh_token
        setLoading(true)
    
        await axios.post(`${domain}/api/comment/upload`, JSON.stringify({ 'comment': comment }), {
            headers: {
              'token': token,
              'token_expiration': token_expiration,
              'refresh_token': refresh_token,
              'userid': userId,
              'postid': postId
            }
        }).then(response => {
            const updatedFeed: FeedType = { ...feed };
    
            if (updatedFeed.friendsPosts) {
              const postIndex = updatedFeed.friendsPosts.findIndex(post => post.posts.some(p => p.id === postId));
              if (postIndex !== -1) {
                  const post = updatedFeed.friendsPosts[postIndex].posts.find(p => p.id === postId);
                  if (post) {
                    post.comments.push({
                        content: response.data.data.content,
                      id: response.data.data.id,
                      postedAt: response.data.data.postedAt,
                      user: response.data.data.user,
                    });
      
                    post.comments.sort((a: any, b: any) => {
                        const dateA = new Date(a.postedAt).getTime();
                        const dateB = new Date(b.postedAt).getTime();
                        if (a.user.id === parsedLSUser.id) {
                            return -1;
                        } else if (b.user.id === parsedLSUser.id) {
                            return 1;
                        } else {
                            return dateB - dateA;
                        }
                      });
                    if (response && response.data.refresh_data && typeof window !== 'undefined') {
                        console.log('===== refreshed data =====');
                        console.log(response.data.refresh_data);
                        localStorage.setItem('token', response.data.refresh_data);
                    }
                    setFeed(updatedFeed!);
                    setLoading(false);
                }
              }
            }
        }).catch(error => {
            if (error.response && error.response.data.refresh_data && typeof window !== 'undefined') {
                console.log('===== refreshed data =====');
                console.log(error.response.data.refresh_data);
                localStorage.setItem('token', error.response.data.refresh_data);
            }
            console.log(error)
            toast.error(t('CommentError'));
            setLoading(false);
        })
    }

    const handleDeleteComment = async (postId: string, commentId: string, userId: string) => {
        let lsToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        let parsedLSToken = JSON.parse(lsToken !== null ? lsToken : '{}');
        let token: string|null = parsedLSToken.token;
        let token_expiration: string|null = parsedLSToken.token_expiration;
        let refresh_token: string|null = parsedLSToken.refresh_token;
    
        await axios.get(`${domain}/api/comment/delete`, {
                headers: {
                    'token': token,
                    'token_expiration': token_expiration,
                    'refresh_token': refresh_token,
                    'postid': postId,
                    'userid': userId,
                    'commentid': commentId
                }
            }).then(response => {
                const updatedFeed: FeedType = { ...feed };
    
                if (updatedFeed.friendsPosts) {
                    updatedFeed.friendsPosts.forEach(postGroup => {
                        postGroup.posts.forEach(post => {
                            const commentIndex = post.comments.findIndex(comment => comment.id === commentId);
                            if (commentIndex !== -1) {
                                post.comments.splice(commentIndex, 1);
                            }
                        });
                    });
        
                    if (response.data.refresh_data && typeof window !== 'undefined') {
                        console.log('===== refreshed data =====');
                        console.log(response.data.refresh_data);
                        localStorage.setItem('token', JSON.stringify(response.data.refresh_data));
                    }
        
                    setFeed(updatedFeed);
                }
            }).catch(error => {
                if (error.response && error.response.data.refresh_data && typeof window !== 'undefined') {
                    console.log('===== refreshed data =====');
                    console.log(error.response.data.refresh_data);
                    localStorage.setItem('token', error.response.data.refresh_data);
                }
            
                console.log(error)
                toast.error(t('DeleteCommentError'));
            })
      };

    return (
        <div className="flex flex-col h-[100vh]">
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
            <span className='mt-5 mb-3 h-[1px] bg-white opacity-20' />
            {posts?.posts[posts.posts.length - index - 1]?.realMojis?.length === 0 &&
            (!posts.posts[posts.posts.length - index - 1]?.comments ||
                posts.posts[posts.posts.length - index - 1]?.comments.length === 0) ? (
                <div className='text-center mb-5'>
                <h1 className='text-white font-semibold'>
                    {t('CalmHere')}
                </h1>
                <p className='text-sm px-12'>
                    {t('CalmHere2')}
                </p>
                </div>
            ) : (
                <>
                <div className='overflow-x-clip'>
                    <div className='flex flex-nowrap overflow-auto pb-2'>
                    {posts?.posts[posts.posts.length - index - 1].realMojis &&
                    posts?.posts[posts.posts.length - index - 1].realMojis.length >
                        0 ? (
                        posts?.posts[posts.posts.length - index - 1].realMojis?.map(
                        (item, index) => (
                            <div
                            key={index}
                            className='flex flex-col items-center -mr-2'
                            >
                            <Image
                                src={item.media.url}
                                alt={`Image ${index}`}
                                height={item.media.height}
                                width={item.media.width}
                                className='w-16 h-16 rounded-full'
                                referrerPolicy='no-referrer'
                            />
                            <div className='text-right ml-16 -mt-8 text-3xl'>
                                {item.emoji}
                            </div>
                            <div className='text-center mb-1 text-xs'>
                                {item.user.username}
                            </div>
                            </div>
                        )
                        )
                    ) : (
                        <h1 className='text-center text-sm text-white mt-3 mb-5 mx-auto'>
                        {t('NoRealMojiYet')}
                        <br />
                        {t('FirstReaction', { name: params.username })}
                        </h1>
                    )}
                    </div>
                </div>
                <span className='h-[1px] bg-white opacity-20' />
                <div>
                    {posts?.posts[posts.posts.length - index - 1]?.comments &&
                    posts?.posts[posts.posts.length - index - 1]?.comments.length >
                    0 ? (
                    <>
                        {posts?.posts[posts.posts.length - index - 1]?.comments?.map(
                        (comment) => (
                            <div className='flex mt-3 mb-5 ml-2'>
                            {comment.user.profilePicture?.url ? (
                                <Image
                                className='w-9 h-9 rounded-full'
                                src={comment.user.profilePicture?.url}
                                height={comment.user.profilePicture?.height}
                                width={comment.user.profilePicture?.width}
                                alt='Profile picture'
                                referrerPolicy='no-referrer'
                                />
                            ) : (
                                <div className='w-9 h-9 rounded-full'>
                                <div className='m-auto text-2xl uppercase font-bold'>
                                    {comment.user.username.slice(0, 1)}
                                </div>
                                </div>
                            )}
                            <div className='flex flex-col ml-2'>
                                <div className='flex flex-row text-sm'>
                                <p className='font-medium'>{comment.user.username}</p>
                                <p className='ml-2 opacity-60'>
                                    {UTCtoParisTime(comment.postedAt, t)}
                                </p>
                                </div>
                                <p>
                                {comment.content
                                    .split(' ')
                                    .map((word: string, index: number) => (
                                    <span
                                        key={index}
                                        className={
                                        word.includes('@') ? 'text-blue-500' : ''
                                        }
                                    >
                                        {word}{' '}
                                    </span>
                                    ))}
                                </p>
                                <div className='flex items-center'>
                                    <p className='text-sm text-white opacity-60'>{t('Reply')}</p>
                                    {parsedLSUser.id === comment.user.id && (
                                    <button
                                        onClick={() => handleDeleteComment(posts?.posts[posts.posts.length - index - 1]?.id, comment.id, posts?.user.id)}
                                        className='text-gray-500 hover:text-gray-700 focus:outline-none ml-4'
                                        >
                                        <FaTrash className='w-4 h-4' />
                                    </button>
                                    )}
                                </div>
                            </div>
                            </div>
                        )
                        )}
                    </>
                    ) : (
                    <h1 className='text-center text-sm mt-3 mb-5 ml-2'>{t('NoCommentYet')}</h1>
                    )}
                </div>
                </>
            )}

            <div className='mt-auto mb-4'>
                <Transition
                    show={(posts && !ShowRealMojis[posts.posts[posts.posts.length-index-1].id]) || false}
                    enter='transition-opacity duration-200'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='transition-opacity duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                    className="mb-4"
                >
                    <span className='mt-5 mb-3 block w-full border-t border-white opacity-20' />
                    <form className='flex items-center mb-2 ml-2'>
                        <input
                        className='w-full p-2 bg-black text-base text-white rounded focus:outline-none'
                        placeholder={t('AddComment')} 
                        onChange={(e) => {
                            setComment(e.target.value);
                        }}
                        value={comment}
                        />
                        {comment && (
                        <button
                        onClick={() => handleSendComment(
                            posts?.posts[posts.posts.length - index - 1]?.id!,
                            posts?.user.id!,
                            comment,
                        )}
                        type='submit'
                        className={`bg-blue-500 mt-1 text-white ${
                            loading
                            ? 'disabled:opacity-50 disabled:cursor-not-allowed'
                            : ''
                        } px-4 py-2 rounded-full hover:bg-blue-600 mr-2`}
                        disabled={loading}
                        >
                        {loading ? (
                            <div className='flex items-center justify-center'>
                            <div className='flex items-center justify-center'> 
                                    <div className='h-7 w-7 animate-spin rounded-full border-2 border-solid border-black border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'>
                                        <span className='bg-black text-black !absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                                            Loading... 
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <IoSend className='w-6 h-6' />
                        )}
                        </button>
                        )}
                    </form>
                </Transition>
                <Transition
                    enter="transition-opacity duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    show={!comment}
                >
                {posts && (
                    <div className={delaySwitch[posts.posts[posts.posts.length-index-1].id] ? "absolute bottom-[140vw] w-full" : "absolute bottom-4 right-0"}>
                        <Realmojis 
                            post={posts} 
                            userPost={posts?.posts[posts.posts.length-index-1]}
                            ShowRealMojis={ShowRealMojis} 
                            setShowRealMojis={setShowRealMojis} 
                            t={t}
                            parsedLSUser={parsedLSUser}
                        />
                    </div>
                )}
                </Transition>
            </div>
        </div>
    )
}
