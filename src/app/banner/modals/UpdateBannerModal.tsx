"use client"

import ErrorComponent from "@/components/ui/feedback/Error";
import { useBannerById, useUpdateBanner } from "@/satelite/services/bannerService";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Button from "@/components/ui/button/Button";
import ModalBox from "@/components/ui/modal/ModalBox";
import FormField from "@/components/ui/forms/FormField";
import FormFileUpload from "@/components/ui/forms/FormFileUpload";
import FormBannerSkeleton from "@/components/skeletons/inputForm/formBannerSkeleton";

type UpdateBannerModalProps = {
    bannerIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateBannerModal({
    bannerIdToUpdate,
    isOpen,
    onClose,
    onDone
}: UpdateBannerModalProps) {
    const [name, setName] = useState("");
    const [mediaType, setMediaType] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [sequence, setSequence] = useState(0);

    const { mutate: updateBanner, isPending: isPendingUpdate } = useUpdateBanner(bannerIdToUpdate);
    const { data: banner, isPending, isError } = useBannerById(bannerIdToUpdate);

    const handleClose = () => {
        resetValue();
        onClose(false);
    }

    const resetValue = () => {
        setName("");
        setMediaType("");
        setImageFile(null);
        setDescription("");
        setSequence(0);
    }

    useEffect(() => {
        if (isOpen && banner) {
            setName(banner.data.name || "");
            setMediaType(banner.data.mediaType || "");
            setDescription(banner.data.description || "");
            setSequence(banner.data.sequence || 0);
        }
    }, [isOpen, banner]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedBanner = new FormData();
        updatedBanner.append("name", name);
        updatedBanner.append("description", description);
        updatedBanner.append("sequence", sequence.toString());
        updatedBanner.append("mediaType", mediaType);
        if (imageFile) {
            updatedBanner.append("file", imageFile);
        }

        updateBanner(updatedBanner, {
            onSuccess: () => {
                toast.success("Banner updated successfully");
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
        })
    }

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Update Banner</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                {isPending ? (
                    <FormBannerSkeleton />
                ) : (
                    <>
                        <FormField
                            label="Name"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter banner name"
                            required
                            disabled={isPendingUpdate || isPending}
                        />

                        <FormField
                            label="Description"
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Enter banner description"
                            rows={4}
                            type="textarea"
                            disabled={isPendingUpdate || isPending}
                        />

                        <FormField
                            label="Sequence"
                            id="sequence"
                            type="number"
                            value={sequence}
                            onChange={(e) => setSequence(Number(e.target.value))}
                            placeholder="Enter banner sequence"
                            required
                            min={0}
                            disabled={isPendingUpdate || isPending}
                        />

                        <FormField
                            label="Media Type"
                            id="mediaType"
                            value={mediaType}
                            onChange={e => setMediaType(e.target.value)}
                            placeholder="Enter banner media type"
                            required
                            disabled={isPendingUpdate || isPending}
                        />

                        <FormFileUpload
                            label="Banner Image"
                            file={imageFile}
                            setFile={setImageFile}
                            maxSize={200_000}
                            disabled={isPendingUpdate || isPending}
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
                    icon={!isPendingUpdate ? undefined : <FaSpinner className="animate-spin" />}
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
    )
} 