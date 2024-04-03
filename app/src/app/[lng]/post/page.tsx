"use client"
import { useTranslation } from "@/app/i18n/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import { Switch } from "@headlessui/react";
import { FaEye } from "react-icons/fa";
import { MdAccessTimeFilled, MdOutlineScreenRotationAlt } from "react-icons/md";

export default function Error({ params }: { params: { lng: string }}) {
    const router = useRouter()
    const { t } = useTranslation(params.lng, 'client-page', {})
    const domain = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_DOMAIN : process.env.NEXT_PUBLIC_DOMAIN;

    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFileOne, setSelectedFileOne] = useState();
    const [selectedFileTwo, setSelectedFileTwo] = useState();
    const [isFirstFilePicked, setIsFirstFilePicked] = useState<boolean>(false);
    const [isSecondFilePicked, setIsSecondFilePicked] = useState<boolean>(false);
    const [primarybase64, setPrimaryBase64] = useState<string>('');
    const [secondarybase64, setSecondaryBase64] = useState('""');
    const [primaryImage, setPrimaryImage] = useState<string | null>(null);
    const [secondaryImage, setSecondaryImage] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [visibility, setVisibility] = useState<string>('friends');
    const [isLate, setIsLate] = useState<boolean>(false);
    const [retakes, setRetakes] = useState<number>(0);

    function getBase64(file: File): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve) => {
            let baseURL: string | ArrayBuffer | null = null;
            let reader = new FileReader();
            reader.readAsDataURL(file);
    
            reader.onload = () => {
                if (reader.result) {
                    baseURL = reader.result;
                }
                resolve(baseURL);
            };
        });
    }
    
    function fileOneHandler(event: any) {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const imageUrl = URL.createObjectURL(file);
        setPrimaryImage(imageUrl);
        setIsFirstFilePicked(true);
        setSelectedFileOne(file);
    
        getBase64(file)
            .then((result: string | ArrayBuffer | null) => {
                if (typeof result === 'string') {
                    setPrimaryBase64(result);
                }
            })
            .catch((err) => {
                console.error('Error converting file to base64:', err);
            });
    }
    

    function fileTwoHandler(event: any) {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const imageUrl = URL.createObjectURL(file);
        setSecondaryImage(imageUrl);
        setIsSecondFilePicked(true);
        setSelectedFileTwo(file);
    
        getBase64(file)
            .then((result: string | ArrayBuffer | null) => {
                if (result) {
                    setSecondaryBase64(result.toString());
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const lsUser = typeof window !== 'undefined' ? localStorage.getItem('myself') : null;
    const parsedLSUser = JSON.parse(lsUser !== null ? lsUser : '{}');

    const handleSubmission = async () => {
        setLoading(true);

        const lsToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const parsedLSToken = JSON.parse(lsToken || '{}');
        const { token, token_expiration, refresh_token } = parsedLSToken;
        const selectedVisibility = visibility || 'friends';

        const postData = {
            'primaryb64': primarybase64,
            'secondaryb64': secondarybase64,
            'visibility': selectedVisibility,
            'isLate': isLate,
            'retakes': retakes,
        };

        try {
            await axios.post(`${domain}/api/post/upload`, JSON.stringify(postData), {
                headers: {
                    token,
                    token_expiration,
                    refresh_token,
                }
            })

            toast.success('Successfully posted');
            setTimeout(() => {
                router.replace(`/${params.lng}/feed`);
            }, 3000);
        } catch (error) {
            handleSubmissionError(error);
        } finally {
            setLoading(false)
        }
    }

    function handleSubmissionError(error: any) {
        if (error.response) {
            if (error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('An error occurred when publishing the post.');
            }
        } else if (error.request) {
            toast.error('Internal server error');
        } else {
            toast.error('An error has occurred.');
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    let formattedTime = currentTime.toLocaleTimeString();
    let isButtonDisabled = !primaryImage || !secondaryImage;

    return (
        <div className='flex flex-col justify-between items-center mt-[0.5vh] h-[99.5vh]'>
            <div className="fixed w-full top-3 z-50 flex justify-between items-center">
                <div className="w-24" onClick={() => router.back()}>
                    <IoArrowBack className='h-7 w-7 ml-3'/>
                </div>
                <svg width="110" height="45" viewBox="0 0 2000 824" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1669.95 569.565H1736V506.768H1669.95V569.565ZM401.716 429.211H327.904V519.168H397.258C414.426 519.168 428.219 515.406 438.622 507.865C449.025 500.329 454.227 489.659 454.227 475.838C454.227 460.767 449.433 449.228 439.861 441.221C430.278 433.22 417.569 429.211 401.716 429.211ZM380.415 300.162H327.904V379.758H375.461C393.295 379.758 407.243 376.545 417.321 370.103C427.394 363.671 432.43 353.545 432.43 339.725C432.43 324.658 427.801 314.297 418.559 308.64C409.307 302.988 396.592 300.162 380.415 300.162ZM389.827 249.296C422.522 249.296 449.102 256.125 469.584 269.784C490.054 283.448 500.298 306.447 500.298 338.783C500.298 350.719 497.402 361.473 491.628 371.045C485.849 380.627 478.33 388.869 469.088 395.771C484.275 403.307 496.747 413.517 506.49 426.385C516.227 439.264 521.104 455.586 521.104 475.367C521.104 504.887 510.282 527.965 488.656 544.606C467.019 561.248 438.204 569.563 402.212 569.563H264V249.296H389.827ZM716.126 432.507C712.818 417.132 706.873 405.745 698.292 398.366C689.7 390.988 678.972 387.293 666.092 387.293C652.876 387.293 641.818 391.145 632.901 398.832C623.985 406.53 618.2 417.755 615.563 432.507H716.126ZM680.954 575.22C639.341 575.22 606.558 564.382 582.62 542.722C558.671 521.057 546.705 492.013 546.705 455.585C546.705 419.168 557.521 389.967 579.152 367.983C600.779 346.009 630.254 335.019 667.578 335.019C705.227 335.019 732.881 346.873 750.555 370.579C768.218 394.285 777.058 422.313 777.058 454.643V473.483H615.068C618.04 488.554 625.3 500.569 636.864 509.518C648.423 518.467 663.615 522.936 682.44 522.936C693.338 522.936 703.163 521.606 711.915 518.938C720.661 516.274 730.817 512.422 742.381 507.398L761.206 551.671C749.971 559.834 736.348 565.8 720.336 569.563C704.314 573.331 691.186 575.22 680.954 575.22ZM909.964 300.164H870.333V398.128H910.954C930.104 398.128 945.956 394.444 958.511 387.06C971.061 379.686 977.336 367.514 977.336 350.559C977.336 332.661 971.391 319.788 959.502 311.938C947.613 304.094 931.094 300.164 909.964 300.164ZM1002.11 569.565L930.77 447.11C927.131 447.424 923.339 447.659 919.376 447.816C915.413 447.978 911.45 448.052 907.487 448.052H870.333V569.565H806.429V249.298H911.945C948.603 249.298 979.972 257.305 1006.06 273.318C1032.16 289.331 1045.21 314.136 1045.21 347.733C1045.21 367.514 1039.83 384.548 1029.1 398.834C1018.36 413.121 1004.58 424.194 987.739 432.038L1070.47 569.565H1002.11ZM1231.56 432.507C1228.26 417.132 1222.31 405.745 1213.73 398.366C1205.13 390.988 1194.41 387.293 1181.53 387.293C1168.32 387.293 1157.25 391.145 1148.34 398.832C1139.42 406.53 1133.64 417.755 1131 432.507H1231.56ZM1196.39 575.22C1154.78 575.22 1122 564.382 1098.05 542.722C1074.11 521.057 1062.14 492.013 1062.14 455.585C1062.14 419.168 1072.95 389.967 1094.59 367.983C1116.22 346.009 1145.69 335.019 1183.02 335.019C1220.67 335.019 1248.32 346.873 1265.99 370.579C1283.66 394.285 1292.49 422.313 1292.49 454.643V473.483H1130.51C1133.48 488.554 1140.73 500.569 1152.3 509.518C1163.86 518.467 1179.05 522.936 1197.88 522.936C1208.77 522.936 1218.6 521.606 1227.35 518.938C1236.09 516.274 1246.26 512.422 1257.82 507.398L1276.64 551.671C1265.41 559.834 1251.79 565.8 1235.78 569.563C1219.75 573.331 1206.63 575.22 1196.39 575.22ZM1414.95 527.997C1444.17 527.997 1465.59 510.183 1465.59 486.43V470.103L1416.29 473.065C1391.08 474.551 1377.92 484.729 1377.92 500.852V501.276C1377.92 518.027 1392.42 527.997 1414.95 527.997ZM1313.45 504.453V504.034C1313.45 462.677 1347.13 438.494 1406.48 434.889L1465.59 431.498V417.504C1465.59 397.352 1451.75 384.839 1426.32 384.839C1402.01 384.839 1387.29 395.656 1384.17 410.288L1383.72 412.198H1324.16L1324.38 409.655C1327.95 367.659 1365.87 337.542 1429 337.542C1490.79 337.542 1530.72 367.874 1530.72 413.679V569.563H1465.59V535.632H1464.25C1450.64 558.961 1425.21 573.169 1393.75 573.169C1345.8 573.169 1313.45 544.538 1313.45 504.453ZM1566.18 569.565H1634.46V248.78H1566.18V569.565Z" fill="white" />
                </svg>
                <div className="flex justify-end w-24" onClick={() => router.push(`/${params.lng}/profile/me`)}>
                    {parsedLSUser.profilePicture ? (
                        <Image
                            priority
                            height={parsedLSUser.profilePicture.height}
                            width={parsedLSUser.profilePicture.width}
                            className='w-8 h-8 rounded-full mr-3 cursor-pointer'
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

        <div
            className={`
                relative flex flex-col mt-[6vh]
                bg-black 
                rounded-lg lg:p-6 p-4 min-w-0
            `}
        >

            <div className='flex w-2/3 justify-center'>
                {parsedLSUser.profilePicture ? (
                    <Image
                        height={parsedLSUser.profilePicture.height}
                        width={parsedLSUser.profilePicture.width}
                        className='w-8 h-8 rounded-full'
                        src={parsedLSUser.profilePicture.url}
                        alt="my profile"
                        referrerPolicy='no-referrer'
                    />
                ) : (
                    <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                        <p className='text-xl uppercase font-bold'>
                            {parsedLSUser.username ? parsedLSUser.username.slice(0, 1) : ''}
                        </p>
                    </div>
                )}

                <div className='flex flex-col ml-2'>
                    <p className='text-sm font-semibold'>{parsedLSUser.username}</p>
                    <p className='text-xs text-white/50'>{formattedTime}</p>
                </div>
            </div>

            <div className='relative flex w-2/3 mx-auto'>
                <input
                    type='file'
                    accept='image/*'
                    onChange={fileTwoHandler}
                    className="hidden"
                    id='secondaryImageInput'
                />

                <label htmlFor='secondaryImageInput' className='cursor-pointer'>
                    <div className='top-3 absolute left-4 w-3/12 aspect-[1.5/2] rounded-xl border-2 border-black overflow-hidden z-10'>
                        {secondaryImage ? (
                            <Image
                                width={1500}
                                height={2000}
                                alt="secondary Image"
                                src={secondaryImage}
                                className='w-full h-full object-cover rounded-xl'
                            />
                        ) : (
                            <div className="relative flex justify-center items-center">
                                <Image
                                    width={1500}
                                    height={2000}
                                    alt="secondary Image"
                                    src={'/public/secondary.jpg'}
                                    className='w-full h-full object-cover rounded-xl'
                                />
                                <p className="absolute text-center px-2 bg-white/50 h-full w-full flex justify-center items-center text-xs text-black">
                                    {t("ClickToChange")}
                                </p>
                            </div>
                        )}
                    </div>
                </label>

                <input
                    type='file'
                    accept='image/*'
                    onChange={fileOneHandler}
                    className="hidden"
                    id='primaryImageInput'
                />

                <label htmlFor='primaryImageInput' className='cursor-pointer'>
                    <div className='top-3 w-full aspect-[1.5/2] rounded-3xl border-2 border-black overflow-hidden z-0'>
                        {primaryImage ? (
                            <Image
                                width={1500}
                                height={2000}
                                alt="primary Image"
                                src={primaryImage}
                                className='w-full h-full object-cover rounded-3xl'
                            />
                        ) : (
                            <div className="relative flex justify-center items-center">
                                <Image
                                    width={1500}
                                    height={2000}
                                    alt="primary Image"
                                    src={'/public/primary.jpg'}
                                    className='w-full h-full object-cover rounded-3xl'
                                />
                                <p className="absolute text-center px-2 bg-white/50 h-full w-full flex justify-center items-center text-xs text-black">
                                    {t("ClickToChange")}
                                </p>
                            </div>
                        )}
                    </div>
                </label>
            </div>


            <div className='mt-5 flex flex-col items-center'>
                <div 
                    className="flex items-center justify-between text-white bg-white/10 active:bg-white/20 w-full px-4 py-3 rounded-xl"
                    onClick={() => {
                        if (visibility === "friends") {
                            setVisibility("friends-of-friends")
                        } else if (visibility === "friends-of-friends") {
                            setVisibility('friends')
                        }
                    }}
                >
                    <div className="flex items-center">
                        <FaEye className="h-8 w-8 p-1"/>
                        <p className="ml-3 font-semibold text-md">{t("FOFVisible")}</p>
                    </div>
                    <Switch
                        checked={visibility === "friends-of-friends"}
                        className={`${
                            visibility === "friends-of-friends" ? 'bg-blue-600' : 'bg-white/70'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
                    >
                        <span className="sr-only">{t("FOFVisible")}</span>
                        <span
                            className={`${
                                visibility === "friends-of-friends" ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
                        />
                    </Switch>
                </div>
                {/* <div 
                    className="flex mt-2 items-center justify-between text-white bg-white/10 active:bg-white/20 w-full px-4 py-3 rounded-xl"
                    onClick={() => setIsLate(!isLate)}
                >
                    <div className="flex items-center">
                        <MdAccessTimeFilled className="h-8 w-8 p-1"/>
                        <p className="ml-3 font-semibold text-md">{t("PostLate")}</p>
                    </div>
                    <Switch
                        checked={isLate}
                        className={`${
                            isLate ? 'bg-blue-600' : 'bg-white/70'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
                    >
                        <span className="sr-only">{t("PostLate")}</span>
                        <span
                            className={`${
                                isLate ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
                        />
                    </Switch>
                </div> */}
                <div 
                    className="flex mt-2 items-center justify-between text-white bg-white/10 active:bg-white/20 w-full px-4 py-3 rounded-xl"
                >
                    <div className="flex items-center">
                        <MdOutlineScreenRotationAlt className="h-8 w-8 p-1"/>
                        <p className="ml-3 font-semibold text-md capitalize">{t("Retakes", {number: ""})}</p>
                    </div>
                    <input type="text" pattern="[0-9]*" onChange={(event) => setRetakes(parseInt(event.target.value.replace(/\D/g, ''), 10))} value={retakes||0}  min={0} className="h-full bg-white/10 text-center" />
                </div>
            </div>

            <button
                onClick={handleSubmission}
                className={`flex items-center justify-center px-6 py-2 rounded-lg bg-white text-black font-medium ${
                    isButtonDisabled || loading
                        ? 'disabled:opacity-40 disabled:cursor-not-allowed'
                        : 'transition-all focus:ring-2 focus:ring-white/20 outline-none hover:bg-white/10'
                } mt-2`}
                disabled={isButtonDisabled || loading}
            >
                {loading ? (
                    <div className='flex items-center justify-center'>
                        Loading...
                    </div>
                ) : (
                    'Submit'
                )}
            </button>

            <div className='mt-2 text-sm text-white'>
                <p>
                    Some photos taken on an iPhone (.heic) may not work. If there is an
                    error, try taking a screenshot of the image and uploading that
                    instead.
                </p>
            </div>
        </div>
    </div>
    );
};