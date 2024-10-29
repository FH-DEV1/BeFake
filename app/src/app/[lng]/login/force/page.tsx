"use client"
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OTPValidate({ params }: { params: { lng: string }}) {
    const { t } = useTranslation(params.lng, 'client-page', {})
    const router = useRouter()
    const [token, setToken ] = useState('')
    const [RefreshToken, setRefreshToken ] = useState('')
    const [expiration, setExpiration ] = useState(0)

    const Login = () => {
        if (typeof window !== "undefined") {
            localStorage.setItem('token', JSON.stringify({token: token, token_expiration: expiration, refresh_token: RefreshToken}))
            localStorage.setItem('v', "2.2")
            router.replace(`/${params.lng}/`)
        }
    }

    return (
        <>
            <div className="h-[100vh] flex flex-col justify-between p-6">
                <div className="flex flex-col space-y-4 justify-center items-center w-[90svw]">
                    <h1 className='font-bold text-xl'>Force Login</h1>
                    <input
                        onChange={newtoken => setToken(newtoken.target.value)}
                        type="text" 
                        placeholder="Token" 
                        className="p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full"
                    />
                    <input
                        onChange={newRefreshToken => setRefreshToken(newRefreshToken.target.value)}
                        type="text" 
                        placeholder="Refresh Token" 
                        className="p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full"
                    />
                    <input
                        onChange={newExpiration => setExpiration(+newExpiration.target.value)}
                        type="number" 
                        placeholder="Token Expiration" 
                        className="p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full"
                    />
                    <button className='bg-gray-800 border border-gray-700 py-4 px-6 rounded-lg' onClick={Login}>Login</button>
                </div>
                <p className='text-center'>{t("forceLogin1")}</p>
                <p className='text-center'>{t("forceLogin2")}</p>
            </div>
        </>
    );    
};