import { Transition } from "@headlessui/react";
import { FeedType, FriendPost, PostType, RealMojis } from "./Types";
import Image from "next/image";
import axios from "axios";
import { useFeedState } from "./FeedContext";
import { useRef, useState } from "react";
import { getBase64 } from "./Functions";
import { toast } from "react-toastify";
import { FaCommentAlt, FaSmile } from "react-icons/fa";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface RealMojisProps {
    post: FriendPost;
    userPost: PostType;
    ShowRealMojis: {
        [key: string]: boolean
    };
    setShowRealMojis: React.Dispatch<React.SetStateAction<{
        [key: string]: boolean
    }>>;
    t: Function;
    router?: AppRouterInstance;
    parsedLSUser: {
        realmojis: RealMojis[];
        id: string;
    }
}

const Realmojis: React.FC<RealMojisProps> = ({ post, userPost, ShowRealMojis, setShowRealMojis, t, router, parsedLSUser }) => {

    let domain = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_DEV_DOMAIN : process.env.NEXT_PUBLIC_DOMAIN
    const lsToken = typeof window !== "undefined" ? localStorage.getItem('token') : null
    let parsedLSToken = JSON.parse(lsToken !== null ? lsToken : "{}")
    let token: string|null = parsedLSToken.token
    let token_expiration: string|null = parsedLSToken.token_expiration
    let refresh_token: string|null = parsedLSToken.refresh_token

    let realmoji = (emoji: string) => parsedLSUser.realmojis.find((rm: { emoji: string; }) => rm.emoji === emoji);
    const { feed, setFeed } = useFeedState();

    const handleReactionClick = async (postId: string, userId: string, emoji: string) => {
        if (realmoji(emoji)) {

            await axios.post(`${domain}/api/realmoji/react`, JSON.stringify({ "emoji": emoji }), {
                headers: {
                    "token": token,
                    "token_expiration": token_expiration,
                    "refresh_token": refresh_token,
                    "userid": userId,
                    "postid": postId
                }
            }).then((response) => {
                if (response.data.refresh_data && typeof window !== "undefined") {
                    console.log("===== refreshed data =====")
                    console.log(response.data.refresh_data)
                    localStorage.setItem("token", response.data.refresh_data)
                }
                console.log("===== RealMoji =====")
                console.log(response.data)
                const updatedFeed: FeedType = { ...feed };
                if (updatedFeed.friendsPosts){
                const postIndex = updatedFeed.friendsPosts.findIndex(post => post.posts.some(p => p.id === postId));
                if (postIndex !== -1) {
                    const post = updatedFeed.friendsPosts[postIndex].posts.find(p => p.id === postId);
                    if (post) {

                        const existingReactionIndex = post.realMojis.findIndex(rm => rm.user.id === parsedLSUser.id);
                        if (existingReactionIndex !== -1) {
                            post.realMojis.splice(existingReactionIndex, 1);
                        }
                        post.realMojis.push({
                            emoji: response.data.data.emoji,
                            id: response.data.data.id,
                            isInstant: response.data.data.isInstant,
                            postedAt: response.data.data.postedAt,
                            user: response.data.data.user,
                            media: response.data.data.media
                        });
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
                        setFeed(updatedFeed);
                    }
                }}
            }).catch((error) => {
                if (error.response.data.refresh_data && typeof window !== "undefined") {
                    console.log("===== refreshed data =====")
                    console.log(error.response.data.refresh_data)
                    localStorage.setItem("token", error.response.data.refresh_data)
                }
                console.log(error)
                toast.error(t("ReactError"))
            })
        } else {
            toast.error(t("UndefinedRealMoji"))
        }
    }


    const [selectedFiles, setSelectedFiles] = useState<any>();
    const fileInputRefs = useRef<{[id: string]: any}>({});
    const [fileBase64, setFileBase64] = useState<string>('""');

    async function fileHandler(event: any) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFiles(file);
        
            getBase64(file)
            .then((result: string | ArrayBuffer | null) => {
                if (result) {
                    setFileBase64(result.toString());
                }
            })
            .catch((err) => {
                console.error('Error converting file to base64:', err);
            });
        }
    }
      
    const handleBubbleClick = (id: string, e: any) => {
        e.stopPropagation();
        if (fileInputRefs.current[id]) {
            fileInputRefs.current[id].click();
        }
    };

    const handleLightningReaction = async (userId: string, postId: string) => {
        const postData = {
            'filebase64': fileBase64,
            'postUserId': userId,
            'postId': postId
        }

        await axios.post(`${domain}/api/realmoji/instant`, postData, {
                headers: {
                    'token': token,
                    'token_expiration': token_expiration,
                    'refresh_token': refresh_token,
                }
            }).then(response => {
                if (response.data.refresh_data && typeof window !== "undefined") {
                    console.log("===== refreshed data =====")
                    console.log(response.data.refresh_data)
                    localStorage.setItem("token", response.data.refresh_data)
                }
                console.log("===== RealMoji =====")
                console.log(response.data)
                const updatedFeed: FeedType = { ...feed };
                if (updatedFeed.friendsPosts){
                    const postIndex = updatedFeed.friendsPosts.findIndex(post => post.posts.some(p => p.id === postId));
                        if (postIndex !== -1) {
                            const post = updatedFeed.friendsPosts[postIndex].posts.find(p => p.id === postId);
                            if (post) {
                                const existingReactionIndex = post.realMojis.findIndex(rm => rm.user.id === parsedLSUser.id);
                                if (existingReactionIndex !== -1) {
                                    post.realMojis.splice(existingReactionIndex, 1);
                                }
            
                                post.realMojis.push({
                                    emoji: response.data.data.emoji,
                                    id: response.data.data.id,
                                    isInstant: response.data.data.isInstant,
                                    postedAt: response.data.data.postedAt,
                                    user: response.data.data.user,
                                    media: response.data.data.media
                                });
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
                                setFeed(updatedFeed);
                            }
                        }
                    }
            }).catch(error => {
                if (error.response.data.refresh_data && typeof window !== "undefined") {
                    console.log("===== refreshed data =====")
                    console.log(error.response.data.refresh_data)
                    localStorage.setItem("token", error.response.data.refresh_data)
                }
                console.log(error)
                toast.error(t('ReactError'))
            })
    }

    return (
        <>
        <Transition
            show={ShowRealMojis[userPost.id] ? !ShowRealMojis[userPost.id] : true}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="flex flex-col items-end mr-5"
        >
            {router &&
                <FaCommentAlt className="h-8 w-8 z-0 mb-5" onClick={() => {
                    feed.data = { scrollY: window.scrollY, gridView: false };
                    router.push(`/${t("lng")}/feed/${post.user.username}?index=${post.posts.length-post.posts.findIndex(p => p.id === userPost.id)-1}`);
                }}/>
            }
            <FaSmile className="h-8 w-8 z-0 mb-5" onClick={() => setShowRealMojis(prev => ({
                ...prev,
                [userPost.id]: true
            }))}/>
        </Transition>

        <Transition
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
            show={ShowRealMojis[userPost.id] || false}
            className="top-0 absolute w-[100vw] flex flex-row justify-center items-end aspect-[1.5/2] pb-1"
            onClick={() => setShowRealMojis(prev => ({
                ...prev,
                [userPost.id]: false
            }))}>
                {["👍", "😃", "😲", "😍", "😂"].map((emoji, index) => {
                    let realmojiObject = realmoji(emoji)
                    return (
                    <div
                        key={index}
                        className={`w-14 h-16 mr-1`}
                        onClick={() => handleReactionClick(
                            userPost.id,
                            post.user.id,
                            emoji
                        )}
                    >
                        <div
                            className={`relative overflow-visible w-14 h-14 ${realmojiObject ? "" : "border-dashed border-2"} border-white rounded-full aspect-square ${realmojiObject ? "" : "bg-transparent"}`}
                        >
                            {realmojiObject && realmojiObject.media.url ? (
                                <Image
                                    width={500}
                                    height={500}
                                    src={realmojiObject.media.url}
                                    alt={`${emoji} realmoji's`}
                                    className="rounded-full border-2 border-black aspect-square w-full h-full object-cover"
                                    placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADIAQMAAAAwS4omAAAAA1BMVEURERGD9/d/AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAG0lEQVRIie3BMQEAAADCoPVPbQwfoAAAAIC3AQ+gAAEq5xQCAAAAAElFTkSuQmCC" />
                            ) : (
                                <div className="flex items-center justify-center rounded-full aspect-square">
                                    <span className={`text-2xl`}>{emoji}</span>
                                </div>
                            )}
                            {realmojiObject && realmojiObject.media.url && (
                                <span className="absolute text-2xl -bottom-2 -right-2">
                                    {realmojiObject.emoji}
                                </span>
                            )}
                        </div>
                    </div>
                )})}

                <div className='w-14' style={{ cursor: 'pointer' }}>
                    {selectedFiles ? (
                        <Image
                            src={URL.createObjectURL(selectedFiles)}
                            alt='Custom lightning emoji'
                            width={500}
                            height={500}
                            className='flex items-center justify-center rounded-full bg-black aspect-square mb-2'
                            onClick={() => handleLightningReaction(post.user.id, userPost.id)} />
                    ) : (
                        <div
                            className='flex items-center justify-center rounded-full bg-black aspect-square mb-2'
                            onClick={(e) => handleBubbleClick(userPost.id, e)}
                        >
                            <span className='text-xl' role='img' aria-label='Upload emoji'>
                                ⚡
                            </span>
                            <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={(e) => fileHandler(e)}
                                ref={(ref) => (fileInputRefs.current[userPost.id] = ref)} />
                        </div>
                    )}
                </div>
            </Transition>
            </>
    )
}

export default Realmojis;