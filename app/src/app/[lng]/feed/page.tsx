"use client"
import SwipeableViews from "react-swipeable-views";
import { FeedType, FriendPost, Index, OptionsMenu, PostType, RealMojis } from '@/components/Types';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UTCtoParisTime, formatTimeLate } from "@/components/TimeConversion";
import { useSwipeable } from "react-swipeable";
import Post from "@/components/Post";
import { useRouter, useSearchParams } from "next/navigation";
import { useFeedState } from "@/components/FeedContext";
import axios from "axios";
import { Transition } from "@headlessui/react";
import { useTranslation } from '@/app/i18n/client'
import { MdAddAPhoto } from "react-icons/md";
import { FaPlus, FaLock, FaSmile } from "react-icons/fa";
import Image from 'next/image'
import Modal from "@/components/Modal"

export default function Feed({ params }: { params: { lng: string }}) {
    const { t } = useTranslation(params.lng, 'client-page', {})
    const domain = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_DEV_DOMAIN : process.env.NEXT_PUBLIC_DOMAIN
    const { feed, setFeed } = useFeedState();
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState<boolean>(false)
    const gridViewParam = searchParams.get('gridView');
    const [gridView, setGridView] = useState<boolean>(gridViewParam !== null ? JSON.parse(gridViewParam) : false);
    const [isScrolled, setIsScrolled] = useState<boolean>(true);
    const [ShowRealMojis, setShowRealMojis] = useState<{[key: string]: boolean}>({});
    const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
    const [index, setIndex] = useState<Index>({})
    const [swipeable, setSwipeable] = useState(false);
    const router = useRouter()
    const [OptionsMenu, setOptionsMenu] = useState<OptionsMenu>({
        show: false,
        disabled: true
    });
    const PostOptions = [
        {
            id: "main-download",
            name: t("DownloadMainImage"),
            action: () => {
                toast.warning(t('UnavailableYet'));
                setOptionsMenu(prevState => ({
                    ...prevState,
                    show: false
                }))
            },
        },
        {
            id: "secondary-download",
            name: t("DownloadSecondaryImage"),
            action: () => {
                toast.warning(t('UnavailableYet'));
                setOptionsMenu(prevState => ({
                    ...prevState,
                    show: false
                }))
            },
        },
        {
            id: "combined-download",
            name: t("DownloadCombinedImages"),
            action: () => {
                toast.warning(t('UnavailableYet'));
                setOptionsMenu(prevState => ({
                    ...prevState,
                    show: false
                }))
            },
        },
        {
            id: "bts-download",
            name: t("DownloadBTSVideo"),
            action: () => {
                toast.warning(t('UnavailableYet'));
                setOptionsMenu(prevState => ({
                    ...prevState,
                    show: false
                }))
            },
        },
        {
            id: "copy-link-main",
            name: t("CopyMainImageLink"),
            action: () => {
                if (OptionsMenu.primary) {
                    navigator.clipboard.writeText(OptionsMenu.primary);
                    toast.success(t('CopyLinkSuccess'));
                    setOptionsMenu(prevState => ({
                        ...prevState,
                        show: false
                    }))
                } else {
                    toast.error("CopyLinkError")
                }
            },
        },
        {
            id: "copy-link-secondary",
            name: t("CopySecondaryImageLink"),
            action: () => {
                if (OptionsMenu.secondary) {
                    navigator.clipboard.writeText(OptionsMenu.secondary);
                    toast.success(t('CopyLinkSuccess'));
                    setOptionsMenu(prevState => ({
                        ...prevState,
                        show: false
                    }))
                } else {
                    toast.error(t('CopyLinkError'))
                }
            },
        },
    ]
    const lsUser = typeof window !== "undefined" ? localStorage.getItem('myself') : null
    const parsedLSUser = JSON.parse(lsUser !== null ? lsUser : "{}")
    const realmoji = (emoji: string) => parsedLSUser.realmojis.find((rm: { emoji: string; }) => rm.emoji === emoji);
    const placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwMCIgaGVpZ2h0PSIyMDAwIiB2aWV3Qm94PSIwIDAgMTUwMCAyMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzExMTExMSIgLz4NCjxzdmcgeD0iNjMwcHgiIHk9Ijg4MCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyNDAiIHZpZXdCb3g9IjAgMCAyNDAgMjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxzdHlsZT4uc3Bpbm5lcl8xS0Q3e2FuaW1hdGlvbjpzcGlubmVyXzZRbkIgMS4ycyBpbmZpbml0ZX0uc3Bpbm5lcl9NSmc0e2FuaW1hdGlvbi1kZWxheTouMXN9LnNwaW5uZXJfc2o5WHthbmltYXRpb24tZGVsYXk6LjJzfS5zcGlubmVyX1d3Q2x7YW5pbWF0aW9uLWRlbGF5Oi4zc30uc3Bpbm5lcl92eTJKe2FuaW1hdGlvbi1kZWxheTouNHN9LnNwaW5uZXJfb3MxRnthbmltYXRpb24tZGVsYXk6LjVzfS5zcGlubmVyX2wxVHd7YW5pbWF0aW9uLWRlbGF5Oi42c30uc3Bpbm5lcl9XTkVne2FuaW1hdGlvbi1kZWxheTouN3N9LnNwaW5uZXJfa3VnVnthbmltYXRpb24tZGVsYXk6LjhzfS5zcGlubmVyXzR6T2x7YW5pbWF0aW9uLWRlbGF5Oi45c30uc3Bpbm5lcl83aGUye2FuaW1hdGlvbi1kZWxheToxc30uc3Bpbm5lcl9TZU83e2FuaW1hdGlvbi1kZWxheToxLjFzfUBrZXlmcmFtZXMgc3Bpbm5lcl82UW5CezAlLDUwJXthbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOmN1YmljLWJlemllcigwLjI3LC40MiwuMzcsLjk5KTtyOjB9MjUle2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246Y3ViaWMtYmV6aWVyKDAuNTMsMCwuNjEsLjczKTtyOjJweH19PC9zdHlsZT4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDciIGN4PSIxMjAiIGN5PSIzMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+DQogICAgPGNpcmNsZSBjbGFzcz0ic3Bpbm5lcl8xS0Q3IHNwaW5uZXJfTUpnNCIgY3g9IjE2NS4wIiBjeT0iNDIuMSIgcj0iMTAiIGZpbGw9IndoaXRlIi8+DQogICAgPGNpcmNsZSBjbGFzcz0ic3Bpbm5lcl8xS0Q3IHNwaW5uZXJfU2VPNyIgY3g9Ijc1LjAiIGN5PSI0Mi4xIiByPSIxMCIgZmlsbD0id2hpdGUiLz4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDcgc3Bpbm5lcl9zajlYIiBjeD0iMTk3LjkiIGN5PSI3NS4wIiByPSIxMCIgZmlsbD0id2hpdGUiLz4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDcgc3Bpbm5lcl83aGUyIiBjeD0iNDIuMSIgY3k9Ijc1LjAiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPg0KICAgIDxjaXJjbGUgY2xhc3M9InNwaW5uZXJfMUtENyBzcGlubmVyX1d3Q2wiIGN4PSIyMTAuMCIgY3k9IjEyMC4wIiByPSIxMCIgZmlsbD0id2hpdGUiLz4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDcgc3Bpbm5lcl80ek9sIiBjeD0iMzAuMCIgY3k9IjEyMC4wIiByPSIxMCIgZmlsbD0id2hpdGUiLz4NCiAgICA8Y2lyY2xlIGNsYXNzPSJzcGlubmVyXzFLRDcgc3Bpbm5lcl92eTJKIiBjeD0iMTk3LjkiIGN5PSIxNjUuMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+DQogICAgPGNpcmNsZSBjbGFzcz0ic3Bpbm5lcl8xS0Q3IHNwaW5uZXJfa3VnViIgY3g9IjQyLjEiIGN5PSIxNjUuMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+DQogICAgPGNpcmNsZSBjbGFzcz0ic3Bpbm5lcl8xS0Q3IHNwaW5uZXJfb3MxRiIgY3g9IjE2NS4wIiBjeT0iMTk3LjkiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPg0KICAgIDxjaXJjbGUgY2xhc3M9InNwaW5uZXJfMUtENyBzcGlubmVyX1dORWciIGN4PSI3NS4wIiBjeT0iMTk3LjkiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPg0KICAgIDxjaXJjbGUgY2xhc3M9InNwaW5uZXJfMUtENyBzcGlubmVyX2wxVHciIGN4PSIxMjAiIGN5PSIyMTAiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPg0KPC9zdmc+DQo8L3N2Zz4="

    const fetchLocations = async (feed: FeedType) => {
        if (feed.friendsPosts) {
            const updatedFeed = {
                ...feed,
                friendsPosts: await Promise.all(feed.friendsPosts.map(async (post) => {
                const updatedPosts = await Promise.all(post.posts.map(async (individualPost) => {
                    if (individualPost.location) {
                    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${individualPost.location.longitude},${individualPost.location.latitude}&outSR=&forStorage=false&f=pjson`;
                    try {
                        const response = await axios.get(url);
                        if (response.data && response.data.address) {
                        individualPost.location.ReverseGeocode = response.data.address;
                        }
                    } catch (error) {
                        console.error("Error fetching reverse geocode:", error);
                    }
                    }
                    return individualPost;
                }));
                return { ...post, posts: updatedPosts };
                }))
            };
            setFeed(updatedFeed);
        }
    };
    

    useEffect (() => {
        if (!feed.friendsPosts) {
            setLoading(true)
            let lsToken = typeof window !== "undefined" ? localStorage.getItem('token') : null
            let parsedLSToken = JSON.parse(lsToken !== null ? lsToken : "{}")
            let token: string|null = parsedLSToken.token
            let token_expiration: string|null = parsedLSToken.token_expiration
            let refresh_token: string|null = parsedLSToken.refresh_token
            let userId: string|null = parsedLSUser.id

            if (token && token_expiration && refresh_token && userId) {
                axios.get(`${domain}/api/feed`, {
                    headers: {
                        token: token,
                        token_expiration: token_expiration,
                        refresh_token: refresh_token,
                        userid: userId
                    }
                })
                .then((response) => {
                    let feed: FeedType = response.data.feed
                    if (feed.friendsPosts) {
                        if (feed.userPosts) {
                            feed.userPosts.posts.forEach((post: PostType) => {
                                post.realMojis.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
                            })
                        }
                        feed.friendsPosts.forEach((post: FriendPost) => {
                            post.posts.sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());
                            post.posts.forEach((post: PostType) => {
                                post.realMojis.sort((a, b) => {
                                    const dateA = new Date(a.postedAt).getTime();
                                    const dateB = new Date(b.postedAt).getTime();
                                    if (a.user.id === userId) {
                                        return -1;
                                    }
                                    else if (b.user.id === userId) {
                                        return 1;
                                    }
                                    else {
                                        return dateB - dateA;
                                    }
                                });
                            });
                        });
                        feed.friendsPosts.sort((a: FriendPost, b: FriendPost) => new Date(b.posts[0].takenAt).getTime() - new Date(a.posts[0].takenAt).getTime());
                        
                        console.log("===== feed =====")
                        console.log(feed)
                        setFeed(feed);
                        if (response.data.refresh_data && typeof window !== "undefined") {
                            console.log("===== refreshed data =====")
                            console.log(response.data.refresh_data)
                            localStorage.setItem("token", JSON.stringify(response.data.refresh_data))
                        };
                        setLoading(false);
                        fetchLocations(feed);
                    }
                })
                .catch((error) => {
                    if (error.response.data.refresh_data && typeof window !== "undefined") {
                        console.log("===== refreshed data =====")
                        console.log(error.response.data.refresh_data)
                        localStorage.setItem("token", error.response.data.refresh_data)
                    }
                    router.replace(`/${params.lng}/error`)
                })
            } else {
                console.log("no token in ls")
                router.replace(`/${params.lng}/login/phone-number`)
            }
        } else if (feed.data) {
            console.log("===== feed =====")
            console.log(feed)
            setLoading(false)
            setGridView(feed.data.gridView)
            window.scroll(0, feed.data.scrollY)
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const ScrollY = window.scrollY;
            setPrevScrollPos(prevScrollPos => {
                const shouldShow = ScrollY < 50 || ScrollY < prevScrollPos;
                setIsScrolled(shouldShow);
                return ScrollY;
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleReactionClick = async (postId: string, userId: string, emoji: string) => {
        if (realmoji(emoji)) {
            let lsToken = typeof window !== "undefined" ? localStorage.getItem('token') : null
            let parsedLSToken = JSON.parse(lsToken !== null ? lsToken : "{}")
            let token: string|null = parsedLSToken.token
            let token_expiration: string|null = parsedLSToken.token_expiration
            let refresh_token: string|null = parsedLSToken.refresh_token

            await axios.post(`${domain}/api/realmoji/react`, JSON.stringify({ "emoji": emoji }), {
                headers: {
                    "token": token,
                    "token_expiration": token_expiration,
                    "refresh_token": refresh_token,
                    "userid": userId,
                    "postid": postId
                }
            }).then((response) => {
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
                console.log(error)
                toast.error(t("ReactError"))
            })
        } else {
            toast.error(t("UndefinedRealMoji"))
        }
    }

    const handlers = useSwipeable({
        onSwipedDown: () => {if (window.scrollY <= 0) {setGridView(!gridView)}},
    });

    return (
        <div {...handlers}>
            <div className="fixed w-full top-3 z-50 flex justify-between items-center">
                <div onClick={() => {toast.warn(t("UnavailableYet"))}}>
                    <MdAddAPhoto className='h-7 w-7 ml-4'/>
                </div>
                <svg width="110" height="45" viewBox="0 0 2000 824" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1669.95 569.565H1736V506.768H1669.95V569.565ZM401.716 429.211H327.904V519.168H397.258C414.426 519.168 428.219 515.406 438.622 507.865C449.025 500.329 454.227 489.659 454.227 475.838C454.227 460.767 449.433 449.228 439.861 441.221C430.278 433.22 417.569 429.211 401.716 429.211ZM380.415 300.162H327.904V379.758H375.461C393.295 379.758 407.243 376.545 417.321 370.103C427.394 363.671 432.43 353.545 432.43 339.725C432.43 324.658 427.801 314.297 418.559 308.64C409.307 302.988 396.592 300.162 380.415 300.162ZM389.827 249.296C422.522 249.296 449.102 256.125 469.584 269.784C490.054 283.448 500.298 306.447 500.298 338.783C500.298 350.719 497.402 361.473 491.628 371.045C485.849 380.627 478.33 388.869 469.088 395.771C484.275 403.307 496.747 413.517 506.49 426.385C516.227 439.264 521.104 455.586 521.104 475.367C521.104 504.887 510.282 527.965 488.656 544.606C467.019 561.248 438.204 569.563 402.212 569.563H264V249.296H389.827ZM716.126 432.507C712.818 417.132 706.873 405.745 698.292 398.366C689.7 390.988 678.972 387.293 666.092 387.293C652.876 387.293 641.818 391.145 632.901 398.832C623.985 406.53 618.2 417.755 615.563 432.507H716.126ZM680.954 575.22C639.341 575.22 606.558 564.382 582.62 542.722C558.671 521.057 546.705 492.013 546.705 455.585C546.705 419.168 557.521 389.967 579.152 367.983C600.779 346.009 630.254 335.019 667.578 335.019C705.227 335.019 732.881 346.873 750.555 370.579C768.218 394.285 777.058 422.313 777.058 454.643V473.483H615.068C618.04 488.554 625.3 500.569 636.864 509.518C648.423 518.467 663.615 522.936 682.44 522.936C693.338 522.936 703.163 521.606 711.915 518.938C720.661 516.274 730.817 512.422 742.381 507.398L761.206 551.671C749.971 559.834 736.348 565.8 720.336 569.563C704.314 573.331 691.186 575.22 680.954 575.22ZM909.964 300.164H870.333V398.128H910.954C930.104 398.128 945.956 394.444 958.511 387.06C971.061 379.686 977.336 367.514 977.336 350.559C977.336 332.661 971.391 319.788 959.502 311.938C947.613 304.094 931.094 300.164 909.964 300.164ZM1002.11 569.565L930.77 447.11C927.131 447.424 923.339 447.659 919.376 447.816C915.413 447.978 911.45 448.052 907.487 448.052H870.333V569.565H806.429V249.298H911.945C948.603 249.298 979.972 257.305 1006.06 273.318C1032.16 289.331 1045.21 314.136 1045.21 347.733C1045.21 367.514 1039.83 384.548 1029.1 398.834C1018.36 413.121 1004.58 424.194 987.739 432.038L1070.47 569.565H1002.11ZM1231.56 432.507C1228.26 417.132 1222.31 405.745 1213.73 398.366C1205.13 390.988 1194.41 387.293 1181.53 387.293C1168.32 387.293 1157.25 391.145 1148.34 398.832C1139.42 406.53 1133.64 417.755 1131 432.507H1231.56ZM1196.39 575.22C1154.78 575.22 1122 564.382 1098.05 542.722C1074.11 521.057 1062.14 492.013 1062.14 455.585C1062.14 419.168 1072.95 389.967 1094.59 367.983C1116.22 346.009 1145.69 335.019 1183.02 335.019C1220.67 335.019 1248.32 346.873 1265.99 370.579C1283.66 394.285 1292.49 422.313 1292.49 454.643V473.483H1130.51C1133.48 488.554 1140.73 500.569 1152.3 509.518C1163.86 518.467 1179.05 522.936 1197.88 522.936C1208.77 522.936 1218.6 521.606 1227.35 518.938C1236.09 516.274 1246.26 512.422 1257.82 507.398L1276.64 551.671C1265.41 559.834 1251.79 565.8 1235.78 569.563C1219.75 573.331 1206.63 575.22 1196.39 575.22ZM1414.95 527.997C1444.17 527.997 1465.59 510.183 1465.59 486.43V470.103L1416.29 473.065C1391.08 474.551 1377.92 484.729 1377.92 500.852V501.276C1377.92 518.027 1392.42 527.997 1414.95 527.997ZM1313.45 504.453V504.034C1313.45 462.677 1347.13 438.494 1406.48 434.889L1465.59 431.498V417.504C1465.59 397.352 1451.75 384.839 1426.32 384.839C1402.01 384.839 1387.29 395.656 1384.17 410.288L1383.72 412.198H1324.16L1324.38 409.655C1327.95 367.659 1365.87 337.542 1429 337.542C1490.79 337.542 1530.72 367.874 1530.72 413.679V569.563H1465.59V535.632H1464.25C1450.64 558.961 1425.21 573.169 1393.75 573.169C1345.8 573.169 1313.45 544.538 1313.45 504.453ZM1566.18 569.565H1634.46V248.78H1566.18V569.565Z" fill="white" />
                </svg>
                <div onClick={() => router.push(`/${params.lng}/profile/me`)}>
                    {parsedLSUser.profilePicture ? (
                    <Image
                        height={parsedLSUser.profilePicture.height}
                        width={parsedLSUser.profilePicture.width}
                        className='w-8 h-8 rounded-full mr-4 cursor-pointer'
                        src={parsedLSUser.profilePicture.url}
                        alt="my profile"
                        referrerPolicy='no-referrer'
                    />
                    ) : (
                    <div className='w-8 h-8 rounded-full bg-white/5 border-full border-black justify-center align-middle flex mr-2 cursor-pointer'>
                        <div className='m-auto text-xl uppercase font-bold'>
                        {parsedLSUser.username ? parsedLSUser.username.slice(0, 1) : ''}
                        </div>
                    </div>
                    )}
                </div>
            </div>

            <div className={`${loading ? "block" : "hidden"} pt-28`}>
                <div className="animate-pulse flex flex-col">
                    <div className="flex">
                        <div className="rounded-full bg-gray-900 h-9 w-9"></div>
                        <div className="flex flex-col pl-3 pt-2">
                            <div className="rounded bg-gray-900 h-2 w-28"></div>
                            <div className="rounded bg-gray-900 mt-2 h-2 w-32"></div>
                        </div>
                    </div>
                    <div className="bg-gray-900 mt-3 h-[65vh] w-full rounded-3xl"></div>
                    <div className="flex justify-center">
                        <div className="rounded bg-gray-900 mt-4 ml-2 h-3 w-3"></div>
                        <div className="rounded bg-gray-900 mt-4 ml-2 h-3 w-3"></div>
                        <div className="rounded bg-gray-900 mt-4 ml-2 h-3 w-3"></div>
                    </div>
                    <div className="rounded bg-gray-900 mt-5 ml-2 h-2 w-56"></div>
                </div>
            </div>

            <div className={`${loading ? "hidden" : ""} pt-11 pb-11`}>

                <div className={`${feed?.userPosts ? isScrolled ? "block" : "hidden" : "hidden"} z-50`}>
                    <div className='flex text-white justify-center mt-3 fixed w-full z-50'>
                        <p className='mr-2'>{t('Friends')}</p>
                        <p className="ml-2 opacity-50 cursor-pointer" onClick={() => {feed.data = { scrollY: 0, gridView: false }; router.replace(`/${params.lng}/fof`)}}>{t('FOF')}</p>
                    </div>
                </div>

                <div className={`flex flex-col ${feed?.userPosts ? 'mt-10' : 'mt-0'} ${gridView ? 'hidden' : ''}`}>
                    {feed && feed?.userPosts && (
                        <div className='flex justify-center mt-6'>
                            <SwipeableViews
                                index={index["userpost"]?index["userpost"]:0}
                                disabled={swipeable}
                                onChangeIndex={(idx) => setIndex({...index, "userpost": idx})}
                                className='pr-[27vw] pl-[35vw] mr-2'
                            >
                                {feed.userPosts.posts.map((post: PostType, indx: number) => (
                                    <div key={indx}>
                                        <div className={`pb-4 ${(!index["userpost"] && indx == 0) || index["userpost"] == indx ? 'opacity-100' : 'opacity-50'}`} >
                                            <div className='relative'>
                                                <Image
                                                    width={1500}
                                                    height={2000}
                                                    className="w-[32vw] rounded-xl object-cover"
                                                    src={post.primary.url}
                                                    alt={`Image ${indx}`}
                                                    placeholder={placeholder}
                                                    referrerPolicy='no-referrer'/>
                                                <Image
                                                    width={1500}
                                                    height={2000}
                                                    className={`top-1 left-1 absolute w-[10vw] rounded-lg border-2 border-black object-cover ${swipeable ? "" : "transition-transform duration-500"}`}
                                                    src={post.secondary.url}
                                                    alt={`Image ${indx}`}
                                                    placeholder={placeholder}
                                                    referrerPolicy='no-referrer'/>
                                            </div>
                                            <div className={`-ml-2 absolute flex flex-row justify-center bottom-0 left-1/2 -translate-x-1/2 w-[30vw] transition-opacity duration-200 ${(!index["userpost"] && indx == 0) || index["userpost"] == indx ? 'opacity-100' : 'opacity-0'}`} key={`${post.id}_realMojis_${index}`}>
                                                {post.realMojis.slice(0, 3).map((realMojis: RealMojis, index: number) => (
                                                    <div className={`${index !== 0 ? "-ml-2": ""}`}>
                                                        <Image
                                                            height={realMojis.media.height}
                                                            width={realMojis.media.width}
                                                            className={`w-8 h-8 rounded-full border border-black`}
                                                            src={realMojis.media.url}
                                                            alt={realMojis.emoji}
                                                            referrerPolicy='no-referrer'
                                                        />
                                                        {index == 2 && post.realMojis.length > 3 && (
                                                            <p className="flex items-center justify-center w-8 h-8 absolute bg-black/70 rounded-full bottom-0">+{post.realMojis.length-2}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {feed.remainingPosts === 0 ? (
                                    <div className='flex flex-col items-center mt-4 w-[25vw] px-1 rounded-xl border border-gray-500 text-white opacity-80 justify-center aspect-[1.5/2]'>
                                        <FaLock className='h-4 w-4 mb-2'/>
                                        <div className='text-xs text-white opacity-60 text-center'>
                                            {t('UnlockMoreBeReal')}
                                        </div>
                                    </div>
                                ) : feed.remainingPosts === 1 || feed.remainingPosts === 2 ? (
                                    <div className='flex flex-col items-center mt-4 w-[25vw] rounded-xl border border-gray-500 text-white opacity-80 justify-center aspect-[1.5/2]'>
                                        <FaPlus className='h-4 w-4 mb-2'/>
                                        <div className='text-xs text-white opacity-60 text-center'>
                                            {t('RemainingPosts', {number: feed.remainingPosts})}
                                        </div>
                                    </div>
                                ) : null}
                            </SwipeableViews>
                        </div>
                    )}
                    {feed && feed.friendsPosts?.map((post: FriendPost) => (
                        <div className="mt-10 overflow-visible" key={post.user.id}>
                            <div className={`flex mb-1.5`}>
                                {post.user.profilePicture ? (
                                    <Image
                                        width={post.user.profilePicture.width}
                                        height={post.user.profilePicture.height}
                                        className='w-9 h-9 rounded-full ml-2'
                                        src={post.user.profilePicture.url}
                                        alt={`${post.user.username}'s profile`}
                                        onClick={() => router.push(`/${params.lng}/profile/${post.user.id}`)}
                                        referrerPolicy='no-referrer'
                                    /> 
                                ) : (
                                    <div className='w-9 h-9 rounded-full bg-white/5 border-full border-black justify-center align-middle flex ml-2'>
                                        <div className='m-auto text-xl uppercase font-bold'>
                                            {post?.user.username.slice(0, 1)}
                                        </div>
                                    </div>
                                )}

                                <div className='flex-col ml-2'>
                                    <p className='h-4 flex' onClick={() => router.push(`/${params.lng}/profile/${post.user.id}`)}>{post.user.username}</p>
                                    <div className='flex-col'>
                                        <a
                                            className='text-sm opacity-60 cursor-pointer'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            href={post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].location ? `https://www.google.com/maps/?q=${post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].location?.latitude},${post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].location?.longitude}` : undefined}
                                            onClick={(e) => {
                                                if (!post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].location) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            {post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].location?.ReverseGeocode ? `${post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].location?.ReverseGeocode?.City}, ${post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].location?.ReverseGeocode?.CntryName} • ` : ''}
                                            {post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].isLate ? t('TimeLate', { time: formatTimeLate(post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].lateInSeconds)}) : UTCtoParisTime(post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].takenAt, t)}
                                        </a>
                                    </div>
                                </div>

                                <button className="ml-auto my-auto p-2 rounded-lg transition-all transform hover:scale-105" onClick={() => setOptionsMenu({
                                    show: true,
                                    subtitle: post.user.username,
                                    disabled: false,
                                    takenAt: post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].takenAt,
                                    primary: post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].primary.url,
                                    secondary: post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].secondary.url,
                                    btsMedia: post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].btsMedia?.url
                                })}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <SwipeableViews
                                disabled={swipeable}
                                index={post.posts.length - 1}
                                onChangeIndex={(idx) => setIndex(prevIndexes => ({
                                    ...prevIndexes,
                                    [post.user.id]: idx
                                }))}>
                                {post.posts.map((userPost: PostType, postIndex: number) => (
                                    <div className='flex flex-col' key={`${userPost.id}_${postIndex}`}>
                                        <Post
                                            post={userPost}
                                            width={"full"}
                                            swipeable={swipeable}
                                            setSwipeable={setSwipeable}
                                        />

                                        <Transition
                                        show={ShowRealMojis[userPost.id] ? !ShowRealMojis[userPost.id] : true}
                                        enter="transition-opacity duration-200"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="transition-opacity duration-200"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        >
                                            <div className={`flex ml-7 -mt-12 ${userPost.realMojis[0] ? "mb-4" : "mb-12"}`} onClick={() => {
                                                feed.data = { scrollY: window.scrollY, gridView: false };
                                                router.push(`/${params.lng}/feed/${post.user.username}?index=${post.posts.length - postIndex - 1}`);
                                            } }>
                                                {userPost.realMojis.slice(0, 3).map((realMojis: RealMojis, index: number) => (
                                                    <div className='flex flex-row -ml-2.5' key={`${userPost.id}_realMojis_${index}`}>
                                                        <Image
                                                            width={realMojis.media.width}
                                                            height={realMojis.media.height}
                                                            className={`w-8 h-8 rounded-full border border-black z-0`}
                                                            src={realMojis.media.url}
                                                            alt={`Realmoji ${index + 1}`}
                                                            referrerPolicy='no-referrer'
                                                        />
                                                        {index === 2 && userPost.realMojis.length > 3 && (
                                                            <div className={`absolute flex items-center justify-center text-white text-sm h-8 w-8 rounded-full bg-black bg-opacity-70`}>
                                                                {userPost.realMojis.length > 4 ? "3+" : "+2"}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex -mt-12 justify-end mr-6" onClick={() => setShowRealMojis(prev => ({
                                                ...prev,
                                                [userPost.id]: true
                                            }))}>
                                                <FaSmile className="h-8 w-8 z-0"/>
                                            </div>
                                        </Transition>

                                        <Transition
                                        enter="transition ease-in-out duration-300 transform"
                                        enterFrom="translate-x-full"
                                        enterTo="translate-x-0"
                                        leave="transition ease-in-out duration-300 transform"
                                        leaveFrom="translate-x-0"
                                        leaveTo="translate-x-full"
                                        show={ShowRealMojis[userPost.id] || false}
                                        className="top-0 absolute w-[100vw] flex flex-row justify-center items-end mb-4 aspect-[1.5/2]"
                                        onClick={() => setShowRealMojis(prev => ({
                                            ...prev,
                                            [userPost.id]: false
                                        }))}>
                                            {["👍", "😃", "😲", "😍", "😂"].map((emoji, index) => (
                                                <div
                                                    key={index}
                                                    className={`w-14 h-16 mr-1`}
                                                    onClick={() => handleReactionClick(
                                                        userPost.id,
                                                        post.user.id,
                                                        emoji,
                                                    )}
                                                >
                                                    <div
                                                    className={`relative overflow-visible w-14 h-14 ${realmoji(emoji) ? "" : "border-dashed border-2"} border-white rounded-full aspect-square ${realmoji(emoji) ? "" : "bg-transparent"}`}
                                                    >
                                                    {realmoji(emoji) && realmoji(emoji).media && realmoji(emoji).media.url ? (
                                                        <Image
                                                        width={500}
                                                        height={500}
                                                        src={realmoji(emoji).media.url}
                                                        alt={`${emoji} realmoji's`}
                                                        className="rounded-full border-2 border-black aspect-square w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center rounded-full aspect-square">
                                                            <span className={`text-2xl`}>{emoji}</span>
                                                        </div>
                                                    )}
                                                    {realmoji(emoji) && realmoji(emoji).media && realmoji(emoji).media.url && (
                                                        <span className="absolute text-2xl -bottom-2 -right-2">
                                                            {realmoji(emoji).emoji}
                                                        </span>
                                                    )}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="w-14" style={{ cursor: "pointer" }}>
                                                <div
                                                    className="flex items-center justify-center rounded-full bg-black aspect-square mb-2"
                                                    onClick={() => toast.warn(t("UnavailableYet"))}
                                                >
                                                    <span
                                                        className="text-xl"
                                                        role="img"
                                                        aria-label="Upload emoji"
                                                    >
                                                        ⚡
                                                    </span>
                                                </div>
                                            </div>
                                        </Transition>
                                    </div>
                                )).reverse()}
                            </SwipeableViews>
                            <div className='flex justify-center mt-4'>
                                {post.posts.length >= 2 && post.posts.map((dots: any, dotsidx) => (
                                    <span key={dotsidx} className={`bg-white transition-opacity duration-300 w-2 h-2 rounded-full mx-1 mb-3 ${dots === post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0] ? "" : "opacity-50"}`} />
                                )).reverse()}
                            </div>
                            <p className={`ml-2 -mt-2 h-6 transition-opacity delay-75 duration-300 ${post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].caption ? "opacity-100" : "opacity-0"}`}>
                                {post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].caption}
                            </p>
                            <div className={`ml-2 opacity-50 transition-transform duration-300 ${post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].caption ? "" : "-translate-y-6"}`} onClick={() => {
                                feed.data = { scrollY: window.scrollY, gridView: false };
                                router.push(`/${params.lng}/feed/${post.user.username}?index=${index[post.user.id] != undefined? index[post.user.id] : post.posts.length-1}`)
                            }}>
                                {post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].comments.length == 0 ? t("AddCommentEmpty") : post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].comments.length == 1 ? "Voir le commentaire" : t('MultipleComments', { number: post.posts[post.posts.length-index[post.user.id]-1? post.posts.length-index[post.user.id]-1 : 0].comments.length})}
                            </div>
                        </div>
                    ))}
                </div>


                {/* gridView */}
                <div className={`flex flex-wrap justify-around mt-10 pt-6 overflow-hidden ${gridView ? "" : "hidden"}`}>
                    {feed && feed.friendsPosts?.map((userPost: FriendPost, imageIndex: number) => (
                        <div className='flex flex-col mb-2' key={`${userPost.posts[0].id}_${imageIndex}`} onClick={() => {
                            feed.data = { scrollY: window.scrollY, gridView: true };
                            router.push(`/${params.lng}/feed/${userPost.user.username}?index=${userPost.posts.length - 1}`)
                        }}>
                            <div className='relative'>
                                <Image
                                    width={1500}
                                    height={2000}
                                    className="w-[32vw] rounded-lg object-cover"
                                    src={userPost.posts[0].primary.url}
                                    alt={`Image ${imageIndex}`}
                                    placeholder={placeholder} 
                                    referrerPolicy='no-referrer'/>
                                <Image
                                    width={1500}
                                    height={2000}
                                    className={`top-1 left-1 absolute w-[10vw] rounded-lg border-2 border-black object-cover ${swipeable ? "" : "transition-transform duration-500"}`}
                                    src={userPost.posts[0].secondary.url}
                                    alt={`Image ${imageIndex}`}
                                    placeholder={placeholder} 
                                    referrerPolicy='no-referrer'/>
                                <div className={`absolute -top-1 -right-1 bg-white w-6 h-6 text-center font-bold rounded-full text-stone-700 ${userPost.posts.length > 1 ? "block" : "hidden"}`}>{userPost.posts.length > 2 ? "3" : "2"}</div>
                                <div className="bottom-0 pt-2 w-full pl-1 pb-1 absolute bg-gradient-to-b from-transparent to-black">
                                    <p className="text-sm">{userPost.user.username}</p>
                                    <p className="text-xs opacity-80">{userPost.posts[0].isLate ? t('TimeLate', { time: formatTimeLate(userPost.posts[0].lateInSeconds)}) : UTCtoParisTime(userPost.posts[0].takenAt, t)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Options Modal */}
                <Modal 
                    title={t("PostOptions")}
                    options={OptionsMenu}
                    setOptions={setOptionsMenu}
                    t={t}
                >
                    {PostOptions.map((option) => (
                        <div className="mb-2" key={option.id}>
                            <button
                                disabled={OptionsMenu.disabled}
                                onClick={() => option.action()}
                                className={`
                                    text-center py-2 px-4 w-full rounded-lg outline-none bg-white/5 relative
                                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:bg-white/10
                                    ${OptionsMenu.disabled ? "animate-pulse" : ""}
                                `}
                            >
                                {option.name}
                            </button>
                        </div>
                    ))}
                </Modal>
            </div>
        </div>
    )
};