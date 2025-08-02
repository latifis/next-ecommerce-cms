"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useUpdateThisUser, useUser } from "@/satelite/services/userService";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Gender } from "@/enum/gender";
import { Language } from "@/enum/language";
import PersonalSection from "../dashboard/PersonalSection";
import StateIndicator from "../ui/feedback/StateIndicator";
import ModalBox from "../ui/modal/ModalBox";

type UpdateUserModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UpdateUserModal({
    isOpen,
    onClose,
}: UpdateUserModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        birthDate: "",
        gender: Gender.MALE,
        languagePreference: Language.EN,
    });

    const { data: user, isPending, isError, refetch } = useUser();
    const { mutate: updateUser, isPending: isPendingUpdateUser } = useUpdateThisUser();

    const handleClose = () => {
        onClose(false);
    };

    useEffect(() => {
        if (user?.data) {
            setFormData({
                name: user.data.name || "",
                phone: user.data.phone || "",
                address: user.data.address || "",
                birthDate: user.data.birthDate?.slice(0, 10) || "",
                gender: user.data.gender || Gender.MALE,
                languagePreference: user.data.languagePreference || Language.EN,
            });
        }
    }, [user]);

    const isFormChanged =
        formData.name !== (user?.data.name || "") ||
        formData.phone !== (user?.data.phone || "") ||
        formData.address !== (user?.data.address || "") ||
        formData.birthDate !== (user?.data.birthDate?.slice(0, 10) || "") ||
        formData.gender !== (user?.data.gender || Gender.MALE) ||
        formData.languagePreference !== (user?.data.languagePreference || Language.EN);

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("Name cannot be empty.");
            return false;
        }

        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Phone must be a valid number.");
            return false;
        }

        if (!formData.address.trim()) {
            toast.error("Address cannot be empty.");
            return false;
        }

        if (!formData.birthDate) {
            toast.error("Birth date is required.");
            return false;
        }

        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        updateUser(formData, {
            onSuccess: () => {
                toast.success("User profile updated successfully.");
                refetch();
            },
            onError: () => {
                toast.error("Failed to update user profile.");
            },
        });
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Update User</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                {isPending ? (
                    <StateIndicator
                        isLoading={isPending}
                        isError={isError}
                        className="my-12"
                    />
                ) : user ? (
                    <div>
                        {/* Form */}
                        <PersonalSection
                            userEmail={user.data.email || ""}
                            formData={formData}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            isPendingUpdateUser={isPendingUpdateUser}
                            isFormChanged={isFormChanged}
                        />
                    </div>
                ) : (
                    <ErrorComponent />
                )}
            </ModalBox.Body>
        </ModalBox>
    );
}
