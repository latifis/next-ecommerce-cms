"use client"

import React from "react";
import ModalBox from "@/components/ui/modal/ModalBox";
import Image from "next/image";

type ShowBannerImageModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    url: string;
}

export default function ShowBannerImageModal({
    isOpen,
    onClose,
    url,
}: ShowBannerImageModalProps) {

    if (!isOpen) return null;

    return (
        <ModalBox isOpen={isOpen} onClose={() => onClose(false)}>
            <ModalBox.Header>
                <h2>Banner Image</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                <div className="text-center">
                    <Image
                        src={url}
                        alt="Banner"
                        width={800}
                        height={400}
                        className="mx-auto w-full h-auto"
                    />
                </div>
            </ModalBox.Body>
        </ModalBox>
    )
}