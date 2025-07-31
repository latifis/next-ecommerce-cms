"use client";

import { useAddBrand } from "@/satelite/services/brandService";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import ErrorComponent from "@/components/ui/feedback/Error";
import ModalBox from "@/components/ui/modal/ModalBox";
import FormField from "@/components/ui/forms/FormField";
import Button from "@/components/ui/button/Button";
import FormFileUpload from "@/components/ui/forms/FormFileUpload";

type AddBrandModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function AddBrandModal({
    isOpen,
    onClose,
    onDone,
}: AddBrandModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { mutate: addBrand, isPending, isError } = useAddBrand();

    const handleClose = () => {
        resetValue()
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

        const newBrand = new FormData();
        newBrand.append("name", name);
        newBrand.append("description", description);
        if (imageFile) {
            newBrand.append("file", imageFile);
        }

        addBrand(newBrand, {
            onSuccess: () => {
                toast.success("Brand added successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to add brand: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to add brand: Unknown error");
                }
            }
        });;
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Add Brand</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                <FormField
                    label="Name"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter brand name"
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
                />

                <FormFileUpload
                    label="Brand Logo"
                    file={imageFile}
                    setFile={setImageFile}
                    maxSize={200_000}
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
