"use client"
import { useTranslation } from "@/app/i18n/client";
import { copyTextToClipboard, dataIsValid } from "@/components/Functions";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoArrowBack, IoCopyOutline, IoPerson } from "react-icons/io5";
import { MdDeveloperMode } from "react-icons/md";
import { TbLogout } from "react-icons/tb";

export default function Settings({ params }: { params: { lng: string }}) {
    const { t } = useTranslation(params.lng, 'client-page', {})
    const router = useRouter()
    useEffect(() => {
        if(!dataIsValid()){
            router.replace(`/${params.lng}/login/phone-number`)
        }
    })
    let ls = typeof window !== "undefined" ? localStorage.getItem('settings') : null
    let settings = ls ? JSON.parse(ls !== null ? ls : "{}") : undefined
    
    const handleLogout = () => {
        const confirmation = window.confirm(t("LogoutConfirm"));
        if (confirmation) {
            localStorage.clear();
            router.replace(`/${params.lng}/login/phone-number`);
        }
    };

    const [devmode, setDevMode] = useState<boolean>(settings?.devmode || false)
    const handleDevMode = () => {
        if (typeof window !== "undefined" && settings) {
            settings.devmode = true
            localStorage.setItem("settings", JSON.stringify(settings))
            setDevMode(!devmode)
        } else if (typeof window !== "undefined") {
            settings = {devmode: true}
            localStorage.setItem("settings", JSON.stringify(settings))
            setDevMode(!devmode)
        }
    }

    const handleCopyToken = () => {
        let lsToken = typeof window !== "undefined" ? localStorage.getItem('token') : null
        if (lsToken) {
            copyTextToClipboard(lsToken)
        }
    }

    const handleCopyUser = () => {
        let lsUser = typeof window !== "undefined" ? localStorage.getItem('myself') : null
        if (lsUser) {
            copyTextToClipboard(lsUser)
        }
    }

    return (
        <div className='flex flex-col justify-between items-center mt-[0.5vh] h-[99.5vh]'>
            <div className='flex items-center justify-between p-2 fixed left-1 right-1 z-40'>
                <button
                    onClick={() => router.back()}
                    className='flex items-center justify-center rounded-lg transition-all transform hover:scale-105 px-2 py-1'
                >
                    <IoArrowBack className='h-8 w-8'/>
                </button>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-lg font-semibold'>{t('Settings')}</h1>
                </div>
                <span className='h-10 w-12'/>
            </div>

            <div className="flex flex-col mt-20 w-full items-center">
                <div 
                    className="flex items-center text-red-500 bg-white/10 active:bg-white/20 w-11/12 px-4 py-3 rounded-xl"
                    onClick={() => handleLogout()}
                >
                    <TbLogout className="h-8 w-8"/>
                    <p className="ml-3 font-semibold text-xl">{t("Logout")}</p>
                </div>

                <div 
                    className="flex mt-4 items-center justify-between text-white bg-white/10 active:bg-white/20 w-11/12 px-4 py-3 rounded-xl"
                    onClick={() => handleDevMode()}
                >
                    <div className="flex items-center">
                        <MdDeveloperMode className="h-8 w-8 p-1"/>
                        <p className="ml-3 font-semibold text-xl">{t("DevMode")}</p>
                    </div>
                    <Switch
                        checked={devmode}
                        className={`${
                            devmode ? 'bg-blue-600' : 'bg-white/70'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
                    >
                        <span className="sr-only">{t("DevMode")}</span>
                        <span
                            className={`${
                                devmode ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
                        />
                    </Switch>
                </div>
                
                <div 
                    className="flex mt-4 justify-between items-center text-white bg-white/10 active:bg-white/20 w-11/12 px-4 py-3 rounded-xl"
                    onClick={() => handleCopyToken()}
                >
                    <div className="flex items-center">
                        <FaLock className="h-8 w-8 p-1"/>
                        <p className="ml-3 font-semibold text-xl">{t("CopyToken")}</p>
                    </div>
                    <IoCopyOutline className="h-8 w-8"/>
                </div>

                <div 
                    className="flex mt-4 justify-between items-center text-white bg-white/10 active:bg-white/20 w-11/12 px-4 py-3 rounded-xl"
                    onClick={() => handleCopyUser()}
                >
                    <div className="flex items-center">
                        <IoPerson className="h-8 w-8 p-1"/>
                        <p className="ml-3 font-semibold text-xl">{t("CopyUser")}</p>
                    </div>
                    <IoCopyOutline className="h-8 w-8"/>
                </div>
            </div>
        </div>
    )
}