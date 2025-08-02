"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import CloseButton from "../button/CloseButton";

type ModalBoxProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

function ModalBox({ isOpen, onClose, children }: ModalBoxProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-3xl mx-auto p-7 rounded-2xl shadow-xl relative">
                <CloseButton onClick={onClose} className="absolute top-4 right-4" />
                {children}
            </div>
        </div>,
        document.body
    );
}

type SectionProps = {
    children: ReactNode,
    className?: string;
};

function ModalHeader({ children }: SectionProps) {
    return <div className="text-xl font-bold mb-4 border-b pb-3 px-1 text-gray-800 text-center">{children}</div>;
}
ModalHeader.displayName = "ModalBox.Header";

function ModalBody({ children, className = "" }: SectionProps) {
    return <div className={`space-y-5 max-h-[60vh] overflow-y-auto px-1 my-6 ${className}`}>{children}</div>;
}
ModalBody.displayName = "ModalBox.Body";

function ModalFooter({ children }: SectionProps) {
    return <div className={`grid ${React.Children.count(children) > 1 ? "grid-cols-2" : "grid-cols-1"} gap-4 my-4 px-1`}>{children}</div>;
}
ModalFooter.displayName = "ModalBox.Footer";

ModalBox.Header = ModalHeader;
ModalBox.Body = ModalBody;
ModalBox.Footer = ModalFooter;

export default ModalBox;