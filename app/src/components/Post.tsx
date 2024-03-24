"use client"
import { useState } from "react";
import Draggable from "react-draggable";
import { PostProps, StyleObject } from "./Types"
import Image from 'next/image'

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
        },
        "large": {
            "primary": "w-[90vw] rounded-3xl",
            "secondary": "w-[27vw] rounded-xl",
            "primaryRatio": 0.9,
            "secondaryRatio": 0.27,
        }
    }
    const [posImage, setPosImage] = useState({ x: screen.width*style[width].primaryRatio/30, y: screen.width*style[width].primaryRatio/30 })
    const [selectedImage, setSelectedImage] = useState(false)
    const placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwMCIgaGVpZ2h0PSIyMDAwIiB2aWV3Qm94PSIwIDAgMTUwMCAyMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzExMTExMSIgLz4NCjxzdmcgeD0iNjMwcHgiIHk9Ijg4MCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyNDAiIHZpZXdCb3g9IjAgMCAyNDAgMjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxzdHlsZT4uc3Bpbm5lcl8xS0Q3e2FuaW1hdGlvbjpzcGlubmVyXzZRbkIgMS4ycyBpbmZpbml0ZX0uc3Bpbm5lcl9NSmc0e2FuaW1hdGlvbi1kZWxheTouMXN9LnNwaW5uZXJfc2o5WHthbmltYXRpb24tZGVsYXk6LjJzfS5zcGlubmVyX1d3Q2x7YW5pbWF0aW9uLWRlbGF5Oi4zc30uc3Bpbm5lcl92eTJKe2FuaW1hdGlvbi1kZWxheTouNHN9LnNwaW5uZXJfb3MxRnthbmltYXRpb24tZGVsYXk6LjVzfS5zcGlubmVyX2wxVHd7YW5pbWF0aW9uLWRlbGF5Oi42c30uc3Bpbm5lcl9XTkVne2FuaW1hdGlvbi1kZWxheTouN3N9LnNwaW5uZXJfa3VnVnthbmltYXRpb24tZGVsYXk6LjhzfS5zcGlubmVyXzR6T2x7YW5pbWF0aW9uLWRlbGF5Oi45c30uc3Bpbm5lcl83aGUye2FuaW1hdGlvbi1kZWxheToxc30uc3Bpbm5lcl9TZU83e2FuaW1hdGlvbi1kZWxheToxLjFzfUBrZXlmcmFtZXMgc3Bpbm5lcl82UW5CezAlLDUwJXthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmN1YmljLWJlemllcigwLjI3LC40MiwuMzcsLjk5KTtyOjB9MjUle2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246Y3ViaWMtYmV6aWVyKDAuNTMsMCwuNjEsLjczKTtyOjJweH19PC9zdHlsZT4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDciIGN4PSIxMjAiIGN5PSIzMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+DQogICAgPGNpcmNsZSBjbGFzcz0ic3Bpbm5lcl8xS0Q3IHNwaW5uZXJfTUpnNCIgY3g9IjE2NS4wIiBjeT0iNDIuMSIgcj0iMTAiIGZpbGw9IndoaXRlIi8+DQogICAgPGNpcmNsZSBjbGFzcz0ic3Bpbm5lcl8xS0Q3IHNwaW5uZXJfU2VPNyIgY3g9Ijc1LjAiIGN5PSI0Mi4xIiByPSIxMCIgZmlsbD0id2hpdGUiLz4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDcgc3Bpbm5lcl9zajlYIiBjeD0iMTk3LjkiIGN5PSI3NS4wIiByPSIxMCIgZmlsbD0id2hpdGUiLz4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDcgc3Bpbm5lcl83aGUyIiBjeD0iNDIuMSIgY3k9Ijc1LjAiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPg0KICAgIDxjaXJjbGUgY2xhc3M9InNwaW5uZXJfMUtENyBzcGlubmVyX1d3Q2wiIGN4PSIyMTAuMCIgY3k9IjEyMC4wIiByPSIxMCIgZmlsbD0id2hpdGUiLz4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDcgc3Bpbm5lcl80ek9sIiBjeD0iMzAuMCIgY3k9IjEyMC4wIiByPSIxMCIgZmlsbD0id2hpdGUiLz4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDcgc3Bpbm5lcl92eTJKIiBjeD0iMTk3LjkiIGN5PSIxNjUuMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+DQogICAgPGNpcmNsZSBjbGFzcz0ic3Bpbm5lcl8xS0Q3IHNwaW5uZXJfa3VnViIgY3g9IjQyLjEiIGN5PSIxNjUuMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+DQogICAgPGNpcmNsZSBjbGFzcz0ic3Bpbm5lcl8xS0Q3IHNwaW5uZXJfb3MxRiIgY3g9IjE2NS4wIiBjeT0iMTk3LjkiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPg0KICAgIDxjaXJjbGUgY2xhc3M9InNwaW5uZXJfMUtENyBzcGlubmVyX1dORWciIGN4PSI3NS4wIiBjeT0iMTk3LjkiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPg0KICAgIDxjaXJjbGUgY2xhc3M9InNwaW5uZXJfMUtENyBzcGlubmVyX2wxVHciIGN4PSIxMjAiIGN5PSIyMTAiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPg0KPC9zdmc+DQo8L3N2Zz4="

    return (
        <div className='flex flex-col'>
            <div className='relative' onClick={() => setSelectedImage(!selectedImage)}>
                <Image
                    className={`${style[width].primary} object-cover cursor-pointer`}
                    src={selectedImage ? post.secondary.url : post.primary.url}
                    width={1500}
                    height={2000}
                    alt="primary image"
                    placeholder={placeholder}
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
                    <Image
                        className={`${style[width].secondary} top-0 absolute border-2 border-black object-cover ${swipeable ? "" : "transition-transform duration-500 cursor-move"}`}
                        src={selectedImage ? post.primary.url : post.secondary.url}
                        width={1500}
                        height={2000}
                        alt="secondary image"
                        placeholder={placeholder}
                    />
                </Draggable>
            </div>
        </div>
    )
}

export default Post;