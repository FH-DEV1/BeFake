"use client"
import { useState } from "react";
import Draggable from "react-draggable";
import { PostProps, StyleObject } from "./Types"

const Post: React.FC<PostProps> = ({ post, width, swipeable, setSwipeable }) => {
    const style: StyleObject = {
        "full": {
            "primary": "w-[100vw] rounded-3xl",
            "secondary": "w-[30vw] rounded-xl",
            "primaryRatio": 1,
            "secondaryRatio": 0.3,
        },
        "small": {
            "primary": "w-[30vw] rounded-xl",
            "secondary": "w-[10vw] rounded-lg",
            "primaryRatio": 0.3,
            "secondaryRatio": 0.1,
        }
    }
    const [posImage, setPosImage] = useState({ x: screen.width*style[width].primaryRatio/30, y: screen.width*style[width].primaryRatio/30 })
    const [selectedImage, setSelectedImage] = useState(false)

    return (
        <div className='flex flex-col'>
            <div className='relative' onClick={() => setSelectedImage(!selectedImage)}>
                <img
                    className={`${style[width].primary} object-cover`}
                    src={selectedImage ? post.secondary.url : post.primary.url}
                    alt="primary image"
                />
                <Draggable
                    bounds="parent"
                    onStart={() => {setSwipeable(true)}}
                    onStop={(e, data) => {
                        setSwipeable(false)
                        setPosImage({
                            x: data.x <= (screen.width*style[width].primaryRatio/2)-screen.width*style[width].secondaryRatio/2 ? screen.width*style[width].primaryRatio/30 : screen.width*(style[width].primaryRatio-style[width].secondaryRatio)-screen.width*style[width].primaryRatio/30,
                            y: screen.width*style[width].primaryRatio/30,
                        });
                    }}
                    defaultPosition={{ x: screen.width*style[width].primaryRatio/30, y: screen.width*style[width].primaryRatio/30 }}
                    position={posImage}
                >
                    <img
                        className={`${style[width].secondary} top-0 absolute border-2 border-black object-cover ${swipeable ? "" : "transition-transform duration-500"}`}
                        src={selectedImage ? post.primary.url : post.secondary.url}
                        alt="secondary image"
                    />
                </Draggable>
            </div>
        </div>
    )
}

export default Post;