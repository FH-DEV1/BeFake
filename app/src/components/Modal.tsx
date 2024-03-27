import React, { ReactNode } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { OptionsMenu } from "./Types";
import { Fragment } from "react";

interface ModalProps {
    title: string;
    options: OptionsMenu;
    setOptions: React.Dispatch<React.SetStateAction<OptionsMenu>>;
    t: Function;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, options, setOptions, t, children }) => {
    return (
        <Transition appear show={options.show} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[60]"
                onClose={() => setOptions(prevState => ({
                    ...prevState,
                    show: false
                }))}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black backdrop-blur bg-opacity-25" />
                </Transition.Child>

                <div className="fixed lg:inset-0 bottom-0 inset-x-0 overflow-y-hidden w-full">
                    <div className="flex min-h-full items-center justify-center text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="bottom-0 opacity-0 lg:scale-95 translate-y-10 lg:translate-y-0 translate-x-0"
                            enterTo="opacity-100 lg:scale-100 translate-y-0 translate-x-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 lg:scale-100 translate-y-0 translate-x-0"
                            leaveTo="opacity-0 lg:scale-95 translate-y-10 lg:translate-y-0 translate-x-0"
                        >
                            <Dialog.Panel
                                className={`
                                    lg:max-w-md max-w-none w-full z-[70]
                                    transform overflow-hidden rounded-t-lg lg:rounded-b-lg mx-4 max-h-[90vh]
                                    border-2 border-white/10 bg-[#0d0d0d] lg:border-b-2 border-b-0
                                    text-left align-middle shadow-xl transition-all overflow-y-auto
                                `}
                            >
                                <div className="m-6 mb-4 pb-4 border-b-2 border-white/10">
                                    <Dialog.Title
                                        as="h2"
                                        className={"m-0 text-center text-2xl font-bold"}
                                    >
                                        {title}
                                    </Dialog.Title>
                                    {options.subtitle &&
                                        <p className={"m-0 text-center opacity-75 text-sm mt-2"}>
                                            {options.subtitle}
                                        </p>
                                    }
                                </div>

                                <div className="mx-6 mb-2 mt-2">
                                    {children}
                                </div>

                                <div className="grid gap-y-4 mb-6 mx-6">
                                    <button
                                        className={`
                                            text-center  py-2 px-4 w-full rounded-lg outline-none bg-red-600 relative 
                                            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out hover:bg-red-500 
                                        `}
                                        onClick={() => setOptions(prevState => ({
                                            ...prevState,
                                            show: false
                                        }))}
                                    >
                                        {t("Close")}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;