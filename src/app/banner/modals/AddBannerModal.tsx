"use client"

import React, { useState } from "react";
import { useAddBanner } from "@/satelite/services/bannerService";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { FaSpinner } from "react-icons/fa";
import ErrorComponent from "@/components/ui/feedback/Error";
import ModalBox from "@/components/ui/modal/ModalBox";
import FormField from "@/components/ui/forms/FormField";
import FormFileUpload from "@/components/ui/forms/FormFileUpload";
import Button from "@/components/ui/button/Button";

type AddBannerModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
}

export default function AddBannerModal({
    isOpen,
    onClose,
    onDone,
}: AddBannerModalProps) {
    const [name, setName] = useState("");
    const [mediaType, setMediaType] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [sequence, setSequence] = useState(0);

    const { mutate: addBanner, isPending, isError } = useAddBanner();

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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !mediaType || !imageFile || !description || !sequence) {
            toast.error("Please fill all fields");
            return;
        }

        const newBanner = new FormData();
        newBanner.append("name", name);
        newBanner.append("description", description);
        newBanner.append("sequence", sequence.toString());
        newBanner.append("mediaType", mediaType);
        if (imageFile) {
            newBanner.append("file", imageFile);
        }

        addBanner(newBanner, {
            onSuccess: () => {
                toast.success("Banner added successfully");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to add banner: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to add banner: Unknown error");
                }
            }
        })
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Add Banner</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                <FormField
                    label="Name"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter banner name"
                    required
                />

                <FormField
                    label="Description"
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter banner description"
                    rows={4}
                    type="textarea"
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
                />

                <FormField
                    label="Media Type"
                    id="mediaType"
                    value={mediaType}
                    onChange={e => setMediaType(e.target.value)}
                    placeholder="Enter banner media type"
                    required
                />

                <FormFileUpload
                    label="Banner Image"
                    file={imageFile}
                    setFile={setImageFile}
                    maxSize={200_000}
                    required
                />
            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={handleSave}
                    loading={isPending}
                    disabled={isPending}
                    variant="primary"
                    icon={!isPending ? undefined : <FaSpinner className="animate-spin" />}
                >
                    {isPending ? "Adding" : "Add"}
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