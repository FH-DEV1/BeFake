"use client"
import { KeyboardBackspaceRounded, NearMe, PersonRounded, ScreenRotationAlt } from "@mui/icons-material";
import Draggable from "react-draggable";
import { usePageState } from "../PagesContext";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { UTCtoParisTime, formatTime } from "../TimeConversion";

const SelectedPost: React.FC = () => {
    const { setPage, selectedPost, setPrevPage } = usePageState();
    const [swipeable, setSwipeable] = useState(false)
    const [selectedImages, setSelectedImages] = useState<{ [key: string]: boolean }>({});
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
        setSwipeable(false)
        const key = `${postId}_${imageIndex}`;
        const newPosition = {
            x: data.x <= (screen.width/2)-66 ? 12 : screen.width-124,
            y: 0,
        };
        setPosImages((prevPosImages) => ({
            ...prevPosImages,
            [key]: newPosition,
        }));
    }

    useEffect(() => {
        setPrevPage("SelectedPost");
    }, [])

    return (
        <div className="flex flex-col">
            <div className='flex flex-row mt-5 mx-5 justify-between items-center'>
                <div className='' onClick={() => {setPage(selectedPost?.from ? selectedPost.from : "start")}}>
                    <KeyboardBackspaceRounded className='h-8 w-8'/>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-xl'>BeReal de {selectedPost.user?.username}</h1>
                    <p className='opacity-60'>{UTCtoParisTime(selectedPost.post?.takenAt ? selectedPost.post.takenAt : "1999-12-31T23:00:00.000Z")}{selectedPost.post?.lateInSeconds !== 0 ? ` - ${formatTime(selectedPost.post?.lateInSeconds ? selectedPost.post.lateInSeconds : 0)}` : ""}</p>
                </div>
                <div className='' onClick={() => toast.warn("seeing others profile is not available yet")}>
                    <PersonRounded className='h-8 w-8'/>
                </div>
            </div>
            <div className='flex justify-center mt-6'>
                <div className='relative w-[40vw]' onClick={() => handleImageClick(selectedPost.post?.id ? selectedPost.post.id : "", 3)}>
                    <img
                        className="h-[26vh] w-[40vw] rounded-xl object-cover"
                        src={selectedImages[`${selectedPost.post?.id}_${3}`] ? selectedPost.post?.secondary.url : selectedPost.post?.primary.url}
                        alt={`Image ${3}`}
                    />
                    <Draggable 
                        bounds="parent" 
                        onStart={() => {setSwipeable(true)}}
                        onStop={(e, data) => handleStopDrag(selectedPost.post?.id ? selectedPost.post.id : "", 3, data)}
                        defaultPosition={{x: 4, y: 0}}
                        position={{ x: 4, y: 0 }}
                    >
                    <img
                        className={`top-1 absolute w-11 h-14 rounded-lg border border-black object-cover ${swipeable ? "" : "transition-transform duration-500"}`}
                        src={selectedImages[`${selectedPost.post?.id}_${3}`] ? selectedPost.post?.primary.url : selectedPost.post?.secondary.url}
                        alt={`Image ${3}`}
                    />
                    </Draggable>
                </div>
            </div>
            <div className='flex items-center w-full justify-center'>
                <div className={`${selectedPost.post?.location ? "block" : "hidden"} mx-2 bg-zinc-800 flex w-[142px] mt-5 rounded-full text-white`}>
                    <NearMe className='text-white p-1'/>
                    <a
                        className='text-sm opacity-60 cursor-pointer'
                        target="_blank"
                        rel="noopener noreferrer"
                        href={selectedPost.post?.location ? `https://www.google.com/maps/?q=${selectedPost.post?.location.latitude},${selectedPost.post?.location.longitude}` : undefined}
                        onClick={(e) => {
                        if (!selectedPost.post?.location) {
                            e.preventDefault();
                        }
                        }}
                    >
                        ouvrir dans maps
                    </a>
                </div>
                <div className={`${selectedPost.post?.retakeCounter ? selectedPost.post.retakeCounter > 0 ? selectedPost.post.retakeCounter > 1 ? "block w-[95px]" : "block w-[87px]": "hidden" : "hidden"} mx-2 bg-zinc-800 flex mt-5 rounded-full text-white`}>
                    <ScreenRotationAlt className='p-1'/>
                    <p className='text-sm opacity-60 cursor-pointer'>{selectedPost.post?.retakeCounter ? selectedPost.post.retakeCounter > 1 ? `${selectedPost.post.retakeCounter} reprises` : `${selectedPost.post.retakeCounter} reprise` : ""}</p>
                </div>
            </div>
            <span className='mt-5 mb-3 h-[1px] bg-white opacity-20'/>
            <div className=" overflow-x-clip">
                <div className="flex flex-nowrap overflow-auto pb-2">
                    {selectedPost.realMojis?.map((item, index) => (
                        <div key={index} className="flex flex-col items-center -mr-2">
                            <img src={item.media.url} alt={`Image ${index}`} className="w-16 h-16 rounded-full" />
                            <div className="text-right ml-16 -mt-8 text-3xl">{item.emoji}</div>
                            <div className="text-center mb-1 text-xs">{item.user.username}</div>
                        </div>
                    ))}
                </div>
            </div>
            <span className='h-[1px] bg-white opacity-20'/>
            <div>
                {selectedPost.post?.comments?.map((comment) => (
                    <div className='flex mt-3 mb-5 ml-2'>
                        <img src={JSON.stringify(comment.user.profilePicture) == "null" ? "/icon.png" : comment.user.profilePicture.url} alt={`${comment.user.username}'s profile`} className='w-9 h-9 rounded-full'/>
                        <div className='flex flex-col ml-2'>
                            <div className='flex flex-row text-sm'>
                                <p>{comment.user.username}</p>
                                <p className='ml-2 opacity-60'>{UTCtoParisTime(comment.postedAt)}</p>
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default SelectedPost;