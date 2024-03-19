"use client"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AddAPhoto, PersonRounded } from "@mui/icons-material";
import { UTCtoParisTime, formatTime } from "@/components/TimeConversion";
import { useSwipeable } from "react-swipeable";
import Post from "@/components/Post";
import { useRouter, useSearchParams } from "next/navigation";
import { useFeedState } from "@/components/FeedContext";
import axios from 'axios';
import { FOFfeedType } from "@/components/Types";

const FOFFeed: React.FC = () => {
    const domain = process.env.NEXT_PUBLIC_DOMAIN
    const { fof, setfof } = useFeedState();
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState<boolean>(false)
    const gridViewParam = searchParams.get('gridView');
    const [gridView, setGridView] = useState<boolean>(gridViewParam !== null ? JSON.parse(gridViewParam) : false);
    const [isScrolled, setIsScrolled] = useState<boolean>(true);
    const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
    const [swipeable, setSwipeable] = useState(false);
    const router = useRouter()
    let lsUser = typeof window !== "undefined" ? localStorage.getItem('myself') : null
    let parsedLSUser = JSON.parse(lsUser !== null ? lsUser : "{}")
    let userId: string|null = parsedLSUser.id

    const fetchLocations = async (feed: FOFfeedType) => {
    if (feed.data && feed.data.length > 0) {
        const updatedFeed: FOFfeedType = {
          ...feed,
          data: await Promise.all(feed.data.map(async (post) => {
            if (post.location) {
              const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${post.location.longitude},${post.location.latitude}&outSR=&forStorage=false&f=pjson`;
              try {
                const response = await axios.get(url);
                if (response.data && response.data.address) {
                  post.location.ReverseGeocode = response.data.address;
                }
              } catch (error) {
                console.error('Error fetching reverse geocode:', error);
              }
            }
            return post;
          }))
        };
        setfof(updatedFeed);
      }
    };

    useEffect (() => {
        if (!fof.data) {
            let lsToken = typeof window !== "undefined" ? localStorage.getItem('token') : null
            let parsedLSToken = JSON.parse(lsToken !== null ? lsToken : "{}")
            let token: string|null = parsedLSToken.token
            let token_expiration: string|null = parsedLSToken.token_expiration
            let refresh_token: string|null = parsedLSToken.refresh_token
            setLoading(true)

            if (token && token_expiration && refresh_token) {
                axios.get(`${domain}/api/fof`, {
                    headers: {
                        token: token,
                        token_expiration: token_expiration,
                        refresh_token: refresh_token,
                    }
                })
                .then((response) => {
                    let feed: FOFfeedType = response.data
                    if (feed.data) {
                        feed.data.forEach((post) => {
                            post.realmojis.sample.sort((a, b) => {
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
                        console.log("===== fof =====")
                        console.log(feed)
                        setfof(feed)
                        if (response.data.refresh_data && typeof window !== "undefined") {
                            console.log("===== refreshed data =====")
                            console.log(response.data.refresh_data)
                            localStorage.setItem("token", JSON.stringify(response.data.refresh_data))
                        }
                        setLoading(false)
                        fetchLocations(feed)
                    }
                })
                .catch((error) => {
                    if (error.response.data.refresh_data && typeof window !== "undefined") {
                        console.log("===== refreshed data =====")
                        console.log(error.response.data.refresh_data)
                        localStorage.setItem("token", error.response.data.refresh_data)
                    }
                    router.replace("/error")
                })
            } else {
                console.log("no token in ls")
                router.replace("/login/phone-number")
            }  
        } else if (fof.params) {
            console.log("===== fof =====")
            console.log(fof)
            setLoading(false)
            setGridView(fof.params.gridView)
            window.scroll(0, fof.params.scrollY)
        }
    }, [fof]);

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

    const handlers = useSwipeable({
        onSwipedDown: () => {if (window.scrollY <= 0) {setGridView(!gridView)}},
    });

    return (
        <div {...handlers}>
            <div className="fixed w-full z-50 flex justify-between items-center">
                <div onClick={() => toast.warn("posting is not available yet")}>
                    <AddAPhoto className='h-7 w-7 ml-2' />
                </div>
                <svg width="110" height="45" viewBox="0 0 2000 824" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1669.95 569.565H1736V506.768H1669.95V569.565ZM401.716 429.211H327.904V519.168H397.258C414.426 519.168 428.219 515.406 438.622 507.865C449.025 500.329 454.227 489.659 454.227 475.838C454.227 460.767 449.433 449.228 439.861 441.221C430.278 433.22 417.569 429.211 401.716 429.211ZM380.415 300.162H327.904V379.758H375.461C393.295 379.758 407.243 376.545 417.321 370.103C427.394 363.671 432.43 353.545 432.43 339.725C432.43 324.658 427.801 314.297 418.559 308.64C409.307 302.988 396.592 300.162 380.415 300.162ZM389.827 249.296C422.522 249.296 449.102 256.125 469.584 269.784C490.054 283.448 500.298 306.447 500.298 338.783C500.298 350.719 497.402 361.473 491.628 371.045C485.849 380.627 478.33 388.869 469.088 395.771C484.275 403.307 496.747 413.517 506.49 426.385C516.227 439.264 521.104 455.586 521.104 475.367C521.104 504.887 510.282 527.965 488.656 544.606C467.019 561.248 438.204 569.563 402.212 569.563H264V249.296H389.827ZM716.126 432.507C712.818 417.132 706.873 405.745 698.292 398.366C689.7 390.988 678.972 387.293 666.092 387.293C652.876 387.293 641.818 391.145 632.901 398.832C623.985 406.53 618.2 417.755 615.563 432.507H716.126ZM680.954 575.22C639.341 575.22 606.558 564.382 582.62 542.722C558.671 521.057 546.705 492.013 546.705 455.585C546.705 419.168 557.521 389.967 579.152 367.983C600.779 346.009 630.254 335.019 667.578 335.019C705.227 335.019 732.881 346.873 750.555 370.579C768.218 394.285 777.058 422.313 777.058 454.643V473.483H615.068C618.04 488.554 625.3 500.569 636.864 509.518C648.423 518.467 663.615 522.936 682.44 522.936C693.338 522.936 703.163 521.606 711.915 518.938C720.661 516.274 730.817 512.422 742.381 507.398L761.206 551.671C749.971 559.834 736.348 565.8 720.336 569.563C704.314 573.331 691.186 575.22 680.954 575.22ZM909.964 300.164H870.333V398.128H910.954C930.104 398.128 945.956 394.444 958.511 387.06C971.061 379.686 977.336 367.514 977.336 350.559C977.336 332.661 971.391 319.788 959.502 311.938C947.613 304.094 931.094 300.164 909.964 300.164ZM1002.11 569.565L930.77 447.11C927.131 447.424 923.339 447.659 919.376 447.816C915.413 447.978 911.45 448.052 907.487 448.052H870.333V569.565H806.429V249.298H911.945C948.603 249.298 979.972 257.305 1006.06 273.318C1032.16 289.331 1045.21 314.136 1045.21 347.733C1045.21 367.514 1039.83 384.548 1029.1 398.834C1018.36 413.121 1004.58 424.194 987.739 432.038L1070.47 569.565H1002.11ZM1231.56 432.507C1228.26 417.132 1222.31 405.745 1213.73 398.366C1205.13 390.988 1194.41 387.293 1181.53 387.293C1168.32 387.293 1157.25 391.145 1148.34 398.832C1139.42 406.53 1133.64 417.755 1131 432.507H1231.56ZM1196.39 575.22C1154.78 575.22 1122 564.382 1098.05 542.722C1074.11 521.057 1062.14 492.013 1062.14 455.585C1062.14 419.168 1072.95 389.967 1094.59 367.983C1116.22 346.009 1145.69 335.019 1183.02 335.019C1220.67 335.019 1248.32 346.873 1265.99 370.579C1283.66 394.285 1292.49 422.313 1292.49 454.643V473.483H1130.51C1133.48 488.554 1140.73 500.569 1152.3 509.518C1163.86 518.467 1179.05 522.936 1197.88 522.936C1208.77 522.936 1218.6 521.606 1227.35 518.938C1236.09 516.274 1246.26 512.422 1257.82 507.398L1276.64 551.671C1265.41 559.834 1251.79 565.8 1235.78 569.563C1219.75 573.331 1206.63 575.22 1196.39 575.22ZM1414.95 527.997C1444.17 527.997 1465.59 510.183 1465.59 486.43V470.103L1416.29 473.065C1391.08 474.551 1377.92 484.729 1377.92 500.852V501.276C1377.92 518.027 1392.42 527.997 1414.95 527.997ZM1313.45 504.453V504.034C1313.45 462.677 1347.13 438.494 1406.48 434.889L1465.59 431.498V417.504C1465.59 397.352 1451.75 384.839 1426.32 384.839C1402.01 384.839 1387.29 395.656 1384.17 410.288L1383.72 412.198H1324.16L1324.38 409.655C1327.95 367.659 1365.87 337.542 1429 337.542C1490.79 337.542 1530.72 367.874 1530.72 413.679V569.563H1465.59V535.632H1464.25C1450.64 558.961 1425.21 573.169 1393.75 573.169C1345.8 573.169 1313.45 544.538 1313.45 504.453ZM1566.18 569.565H1634.46V248.78H1566.18V569.565Z" fill="white" />
                </svg>
                <div onClick={() => router.push("/profile/me")}>
                    {parsedLSUser.profilePicture ? (
                    <img 
                        className='w-8 h-8 rounded-full mr-2'
                        src={parsedLSUser.profilePicture.url}
                        alt="my profile"
                    />
                    ) : (
                    <div className='w-8 h-8 rounded-full bg-white/5 border-full border-black justify-center align-middle flex mr-2'>
                        <div className='m-auto text-xl uppercase font-bold'>
                        {parsedLSUser.username ? parsedLSUser.username.slice(0, 1) : ''}
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <div className={`${loading ? "block" : "hidden"} pt-28 pb-10`}>
                <div className="animate-pulse flex flex-col">
                    <div className="flex">
                        <div className="rounded-full bg-slate-900 h-9 w-9"></div>
                        <div className="flex flex-col pl-3 pt-2">
                            <div className="rounded bg-slate-900 h-2 w-28"></div>
                            <div className="rounded bg-slate-900 mt-2 h-2 w-32"></div>
                        </div>
                    </div>
                    <div className="bg-slate-900 mt-3 h-[65vh] w-full rounded-3xl"></div>
                    <div className="flex justify-center">
                        <div className="rounded bg-slate-900 mt-4 ml-2 h-3 w-3"></div>
                        <div className="rounded bg-slate-900 mt-4 ml-2 h-3 w-3"></div>
                        <div className="rounded bg-slate-900 mt-4 ml-2 h-3 w-3"></div>
                    </div>
                    <div className="rounded bg-slate-900 mt-5 ml-2 h-2 w-56"></div>
                </div>
            </div>
            <div className={`${loading ? "hidden" : ""} pt-11 pb-11`}>
                <div className={`${fof && fof ? isScrolled ? "block" : "hidden" : "hidden"} z-50`}>
                    <div className='flex text-white justify-center mt-2 fixed w-full z-50'>
                        <p className="mr-2 opacity-50" onClick={() => {router.replace("/feed")}}>Mes Amis</p>
                        <p className='ml-2'>Amis d'Amis</p>
                    </div>
                </div>
                <div className={`flex flex-col-reverse ${gridView ? "hidden" : ""}`}>
                    {fof && fof.data?.map((post, imageIndex) => (
                        <div className="mt-20 overflow-visible" key={post.user.id}>
                            <div className='flex flex-col' key={`${post.id}_${imageIndex}`}>
                                <div className='flex mb-1.5'>
                                    {post.user.profilePicture ? (
                                        <img 
                                            className='w-9 h-9 rounded-full ml-2'
                                            src={post.user.profilePicture.url}
                                            alt={`${post.user.username}'s profile`}
                                            onClick={() => router.push(`/profile/${post.user.id}`)}
                                        />
                                    ) : (
                                        <div className='w-9 h-9 rounded-full bg-white/5 border-full border-black justify-center align-middle flex ml-2'>
                                            <div className='m-auto text-xl uppercase font-bold'>
                                                {post?.user.username.slice(0, 1)}
                                            </div>
                                        </div>
                                    )}                                    
                                    <div className='flex-col ml-2'>
                                        <p className='h-4 flex'>{post.user.username}</p>
                                        <a
                                            className='text-sm opacity-60 cursor-pointer'
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={post.location ? `https://www.google.com/maps/?q=${post.location.latitude},${post.location.longitude}` : undefined}
                                            onClick={(e) => {
                                                if (!post.location) {
                                                    e.preventDefault();
                                                }
                                            } }
                                        >
                                            {post.location?.ReverseGeocode ? `${post.location.ReverseGeocode.City}, ${post.location.ReverseGeocode.CntryName} • ` : ""}
                                            {post.lateInSeconds !== 0 ? formatTime(post.lateInSeconds) : UTCtoParisTime(post.takenAt)}
                                        </a>
                                    </div>
                                </div>
                                <Post 
                                    post={post} 
                                    width={"full"} 
                                    swipeable={swipeable} 
                                    setSwipeable={setSwipeable}
                                />
                                <div className={`flex ml-7 -mt-14 ${post.realmojis.sample[0] ? "mb-0" : "mb-10"} z-50`} onClick={() => {
                                    fof.params = { scrollY: window.scrollY, gridView: false };
                                    router.push(`/fof/${post.user.username}`)
                                }}>
                                    {post.realmojis.sample.slice(0, 3).map((realMojis, index) => (
                                        <div className='flex flex-row -ml-2.5' key={`${post.id}_realMojis_${index}`}>
                                            <img
                                                className={`w-8 h-8 rounded-full border border-black `}
                                                src={realMojis.media.url}
                                                alt={`Realmoji ${index + 1}`} />
                                            {index === 2 && post.realmojis.sample.length > 3 && (
                                                <div className={`absolute flex items-center justify-center text-white text-sm h-8 w-8 rounded-full bg-black bg-opacity-70`}>
                                                    {post.realmojis.sample.length > 4 ? "3+" : "+2"}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {post.caption ? <p className='ml-2 mt-8'>{post.caption}</p> : ""}
                                <div className='ml-2 opacity-50' onClick={() => {
                                    fof.params = { scrollY: window.scrollY, gridView: false };
                                    router.push(`/fof/${post.user.username}`)
                                }}>
                                </div>
                            </div>
                        </div>
                    )).reverse()}
                </div>
            </div>


            {/* gridView */}
            <div className={`flex flex-wrap justify-around mt-10 pt-6 overflow-hidden ${gridView ? "" : "hidden"}`}>
                {fof && fof.data?.map((post, imageIndex) => (
                    <div className='flex flex-col mb-2' key={`${post.id}_${imageIndex}`} onClick={() => {
                        fof.params = { scrollY: window.scrollY, gridView: true };
                        router.push(`/fof/${post.user.username}`)
                    }}>
                            <div className='relative'>
                                <img
                                    className="w-[32vw] rounded-lg object-cover"
                                    src={post.primary.url}
                                    alt={`Image ${imageIndex}`} />
                                <img
                                    className={`top-1 left-1 absolute w-[10vw] rounded-lg border-2 border-black object-cover ${swipeable ? "" : "transition-transform duration-500"}`}
                                    src={post.secondary.url}
                                    alt={`Image ${imageIndex}`} />
                                <div className="bottom-0 pt-2 w-full pl-1 pb-1 absolute bg-gradient-to-b from-transparent to-black">
                                    <p className="text-sm">{post.user.username}</p>
                                    <p className="text-xs opacity-80">{post.lateInSeconds ? formatTime(post.lateInSeconds) : UTCtoParisTime(post.takenAt)}</p>
                                </div>
                            </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default FOFFeed;
