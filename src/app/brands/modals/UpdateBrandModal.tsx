"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useBrandById, useUpdateBrand } from "@/satelite/services/brandService";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import ModalBox from "@/components/ui/modal/ModalBox";
import Button from "@/components/ui/button/Button";
import FormField from "@/components/ui/forms/FormField";
import FormBrandSkeleton from "@/components/skeletons/inputForm/formBrandSkeleton";
import FormFileUpload from "@/components/ui/forms/FormFileUpload";

type UpdateBrandModalProps = {
    brandIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateBrandModal({
    brandIdToUpdate,
    isOpen,
    onClose,
    onDone,
}: UpdateBrandModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { mutate: updateBrand, isPending: isPendingUpdate } = useUpdateBrand(brandIdToUpdate);
    const { data: brand, isPending, isError } = useBrandById(brandIdToUpdate);

    useEffect(() => {
        if (isOpen && brand) {
            setName(brand.data.name || "");
            setDescription(brand.data.description || "");
        }
    }, [isOpen, brand]);

    const handleClose = () => {
        resetValue();
        onClose(false);
    };

    const resetValue = () => {
        setName("");
        setDescription("");
        setImageFile(null);
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a brand name.");
            return;
        }

        const updatedBrand = new FormData();
        updatedBrand.append("name", name);
        updatedBrand.append("description", description);
        if (imageFile) {
            updatedBrand.append("file", imageFile);
        }

        updateBrand(updatedBrand, {
            onSuccess: () => {
                toast.success("Brand updated successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to update brand: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to update brand: Unknown error");
                }
            }
        });
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Update Brand</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                {isPending ? (
                    <FormBrandSkeleton />
                ) : (
                    <>
                        <FormField
                            label="Name"
                            id="name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter brand name"
                            disabled={isPendingUpdate || isPending}
                            required
                        />

                        <FormField
                            label="Description"
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Enter brand description"
                            rows={4}
                            type="textarea"
                            disabled={isPendingUpdate || isPending}
                        />

                        <FormFileUpload
                            label="Logo"
                            file={imageFile}
                            setFile={setImageFile}
                            maxSize={200_000}
                            disabled={isPendingUpdate}
                        />
                    </>
                )}
            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={handleSave}
                    loading={isPendingUpdate}
                    disabled={isPending || isPendingUpdate}
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
