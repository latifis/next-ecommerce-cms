"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useUserById, useUpdateUser } from "@/satelite/services/userService";
import { User } from "@/types/user/user";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { UserRole } from "@/enum/userRole";
import Button from "@/components/ui/button/Button";
import ModalBox from "@/components/ui/modal/ModalBox";
import FormSelect from "@/components/ui/forms/FormSelect";
import FormUserSkeleton from "@/components/skeletons/inputForm/formUserSkeleton";

type UpdateUserModalProps = {
    userIdToUpdate: string;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateUserModal({
    userIdToUpdate,
    isOpen,
    onClose,
    onDone,
}: UpdateUserModalProps) {
    const [role, setRole] = useState<UserRole>(UserRole.USER);
    const [isActive, setIsActive] = useState<boolean>(true);

    const { mutate: updateUser, isPending: isPendingUpdate } = useUpdateUser();
    const { data: user, isPending, isError } = useUserById(userIdToUpdate);

    useEffect(() => {
        if (isOpen && user) {
            setRole(user.data.role || UserRole.USER);
            setIsActive(user.data.isActive);
        }
    }, [isOpen, user]);

    const handleClose = () => {
        resetValue();
        onClose(false);
    };

    const resetValue = () => {
        setRole(UserRole.USER);
        setIsActive(true);
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedUser: Partial<User> = {
            id: userIdToUpdate,
            role: role,
            isActive: isActive,
        };

        updateUser(updatedUser, {
            onSuccess: () => {
                toast.success("User updated successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to update user: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to update user: Unknown error");
                }
            }
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
                    <FormUserSkeleton />
                ) : (
                    <>
                        <FormSelect
                            label="Role"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            options={Object.values(UserRole).map((r) => ({ value: r, label: r }))}
                            required
                            placeholder="Select a role"
                            disabled={isPending || isPendingUpdate}
                            isLoading={isPendingUpdate}
                        />

                        <FormSelect
                            label="Status"
                            id="status"
                            value={isActive ? "active" : "inactive"}
                            onChange={(e) => setIsActive(e.target.value === "active")}
                            options={[
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ]}
                            required
                            placeholder="Select a status"
                            disabled={isPending || isPendingUpdate}
                            isLoading={isPendingUpdate}
                        />
                    </>
                )}
            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={handleSave}
                    loading={isPendingUpdate}
                    disabled={isPendingUpdate}
                    variant="primary"
                    icon={isPendingUpdate ? <FaSpinner className="animate-spin" /> : undefined}
                >
                    {isPendingUpdate ? "Updating" : "Update"}
                </Button>

                <Button
                    onClick={handleClose}
                    variant="secondary"
                >
                    Cancel
                </Button>
            </ModalBox.Footer>
        </ModalBox>
    );
}
