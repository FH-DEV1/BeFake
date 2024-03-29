"use client"
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";

export default function Error({ params }: { params: { lng: string }}) {
    const router = useRouter()
    const { t } = useTranslation(params.lng, 'client-page', {})

    const handleLogout = () => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
        if (confirmation) {
            localStorage.clear();
            router.replace("/login/phone-number");
        }
    };

    return (
        <>
        <div className="flex h-[calc(100vh-80px)] items-center justify-center p-5 w-full">
            <div className="text-center">
                <div className="inline-flex rounded-full bg-red-100 p-4">
                    <div className="rounded-full stroke-red-600 bg-red-200 p-4">
                    <svg
                        className="w-16 h-16"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M6 8H6.01M6 16H6.01M6 12H18C20.2091 12 22 10.2091 22 8C22 5.79086 20.2091 4 18 4H6C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12ZM6 12C3.79086 12 2 13.7909 2 16C2 18.2091 3.79086 20 6 20H14"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        ></path>
                        <path
                        d="M17 16L22 21M22 16L17 21"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        ></path>
                    </svg>
                    </div>
                </div>
                <h1 className="mt-5 text-[36px] font-bold lg:text-[50px] text-red-600">
                {t("ServerErrorTitle")}
                </h1>
                <p className="text-white mt-5 lg:text-lg">
                {t("ServerErrorP1")}
                <br />
                {t("ServerErrorP2")}
                <br />
                {t("ServerErrorP3")}
                </p>

                <button
                    className="mt-5 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full"
                    onClick={handleLogout}
                >
                {t("Logout")}
                </button>
            </div>
        </div>
        </>
    );
};