"use client"
import { KeyboardBackspaceRounded } from "@mui/icons-material";
import { usePageState } from "../PagesContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Post, ProfileData } from "../Types";
import { UTCtoParisDate } from "../TimeConversion";
import Draggable from "react-draggable";
import SwipeableViews from "react-swipeable-views";

const MyProfile: React.FC = () => {
    const { setPage, prevPage, setPrevPage, setGridView, feed } = usePageState();
    const domain = "https://berealapi.fly.dev"
    const token = typeof window !== "undefined" ? localStorage.getItem('token') : null
    const [MyInfo, setMyInfo] = useState<ProfileData>()
    const [memories, setmemories] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedImages, setSelectedImages] = useState<{ [key: string]: boolean }>({});
    const [swipeable, setSwipeable] = useState(false)
    const [posImages, setPosImages] = useState<{ [key: string]: { x: number; y: number } }>({});

    const handleImageClick = (postIndex: string, imageIndex: number) => {
        const newSelectedImages = { ...selectedImages };
        const key = `${postIndex}_${imageIndex}`;
        if (newSelectedImages[key]) {
            delete newSelectedImages[key];
        } else {
            newSelectedImages[key] = true;
        }
        setSelectedImages(newSelectedImages);
    };

    const handleStopDrag = (postId: string, imageIndex: number, data: { x: number; y: number }) => {
        console.log(data.x, (screen.height*0.13125)-(screen.height*0.0375), screen.height)
        setSwipeable(false)
        const key = `${postId}_${imageIndex}`;
        const newPosition = {
            x: data.x <= (screen.height*0.13125)-(screen.height*0.0375) ? 10: (screen.height*0.2625)-(screen.height*0.075)-18,
            y: 10,
        };
        setPosImages((prevPosImages) => ({
            ...prevPosImages,
            [key]: newPosition,
        }));
    }

    useEffect (() => {
        setLoading(true)
        const headers = new Headers();
        headers.append("token", (token == null ? "error" : token));
    
        const requestOptions = {
            method: 'GET',
            headers: headers,
        };
    
        fetch(`${domain}/friends/me`, requestOptions)
        .then(response => response.text())
        .then(result => {
          if (JSON.parse(result).status == 200) {
            setMyInfo(JSON.parse(result))
            setLoading(false)
          }
          else {
            toast.warning("Erreur lors du chargement du profil.")
            setLoading(false)
          }
        })
        .catch(() => {toast.error("Erreur lors du chargement du profil.");setLoading(false)});
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className='flex justify-between w-full'>
                <div className='' onClick={() => {setGridView(false); window.scroll(0, 0); setPage(prevPage); setPrevPage("MyProfile")}}>
                    <KeyboardBackspaceRounded className='h-8 w-8'/>
                </div>
                <p className='mb-10 text-xl font-bold'>Profile</p>
                <span className='w-8'/>
            </div>
            <div className={`${loading ? "block" : "hidden"}`}>
                <div className="animate-pulse flex flex-col items-center justify-center">
                    <div className="rounded-full bg-slate-900 h-36 w-36"></div>
                    <div className="rounded-full bg-slate-900 h-10 w-24 mt-5"></div>
                    <div className="rounded bg-slate-900 mt-2 h-2 w-20"></div>
                    <div className="flex flex-row justify-around w-[100vw] mt-5">
                        <div className="flex rounded-full bg-slate-900 h-20 w-20"></div>
                        <div className="flex rounded-full bg-slate-900 h-20 w-20"></div>
                        <div className="flex rounded-full bg-slate-900 h-20 w-20"></div>
                        <div className="flex rounded-full bg-slate-900 h-20 w-20"></div>
                    </div>
                    <div className="h-[35vh] w-[26.25vh] rounded-xl bg-slate-900 mt-7"></div>

                    <div className="rounded bg-slate-900 mt-10 h-2 w-56"></div>
                </div>
            </div>
            <div className={loading ? "hidden" : "flex flex-col items-center"}>
                <img className='h-36 w-36 rounded-full' src={MyInfo?.data.profilePicture.url || "/icon.png"} alt="profile picture" />
                <p className='text-4xl font-bold pt-3'>{MyInfo?.data.fullname}</p>
                <p className='text-xl'>{MyInfo?.data.username}</p>
                <div className='flex flex-row justify-around mt-5 w-[100vw]'>
                    <div className='flex flex-col items-end ml'>
                        <img className='rounded-full h-20 w-20' src={MyInfo?.data.realmojis.find((realmoji) => realmoji.emoji === "👍")?.media.url || "/icon.png"} alt="👍" />
                        <p className='-mt-7 -mr-2 text-3xl'>👍</p>
                    </div>
                    <div className='flex flex-col items-end'>
                        <img className='rounded-full h-20 w-20' src={MyInfo?.data.realmojis.find((realmoji) => realmoji.emoji === "😃")?.media.url || "/icon.png"} alt="😃" />
                        <p className='-mt-7 -mr-2 text-3xl'>😃</p>
                    </div>
                    <div className='flex flex-col items-end'>
                        <img className='rounded-full h-20 w-20' src={MyInfo?.data.realmojis.find((realmoji) => realmoji.emoji === "😲")?.media.url || "/icon.png"} alt="😲" />
                        <p className='-mt-7 -mr-2 text-3xl'>😲</p>
                    </div>
                    <div className='flex flex-col items-end'>
                        <img className='rounded-full h-20 w-20' src={MyInfo?.data.realmojis.find((realmoji) => realmoji.emoji === "😂")?.media.url || "/icon.png"} alt="😂" />
                        <p className='-mt-7 -mr-2 text-3xl'>😂</p>
                    </div>
                </div>
                <div className="mt-5 overflow-visible">
                    <SwipeableViews disabled={swipeable} index={feed?.userPosts?.posts ? feed?.userPosts?.posts.length - 1 : 0}>
                        {feed?.userPosts?.posts.map((userPost: Post, imageIndex: number) => (
                            <div className='flex flex-col' key={`${userPost.id}_${imageIndex}`}>
                                <div className='relative' onClick={() => handleImageClick(userPost.id, imageIndex)}>
                                    <img
                                        className="h-[35vh] w-[26.25vh] rounded-xl object-cover"
                                        src={selectedImages[`${userPost.id}_${imageIndex}`] ? userPost.secondary.url : userPost.primary.url}
                                        alt={`Image ${imageIndex}`} />
                                    <Draggable
                                        bounds="parent"
                                        onStart={() => { setSwipeable(true); } }
                                        onStop={(e, data) => handleStopDrag(userPost.id, imageIndex, data)}
                                        defaultPosition={{ x: 10, y: 10 }}
                                        position={posImages[`${userPost.id}_${imageIndex}`] || { x: 10, y: 10 }}
                                    >
                                        <img
                                            className={`top-0 absolute h-[10vh] w-[7.5vh] rounded-xl border-2 border-black object-cover ${swipeable ? "" : "transition-transform duration-500"}`}
                                            src={selectedImages[`${userPost.id}_${imageIndex}`] ? userPost.primary.url : userPost.secondary.url}
                                            alt={`Image ${imageIndex}`} />
                                    </Draggable>
                                </div>
                                <div className='flex justify-center mt-3'>
                                    {feed?.userPosts?.posts ? feed?.userPosts?.posts.length >= 2 && feed?.userPosts?.posts.map((dots: any) => (
                                        <span className={`bg-white w-2 h-2 rounded-full mx-1 ${dots === userPost ? "" : "opacity-50"}`} />
                                    )).reverse(): 0}
                                </div>
                            </div>
                        )).reverse()}
                    </SwipeableViews>
                </div>
                <p className='text-xs mt-6'>Actif depuis le {UTCtoParisDate(MyInfo?.data.createdAt ? MyInfo.data.createdAt : "")}</p>
            </div>
      </div>
    )
};

export default MyProfile;