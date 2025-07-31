"use client";

import { useAddCategory } from "@/satelite/services/categoryService";
import { Category } from "@/types/category/category";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import ErrorComponent from "@/components/ui/feedback/Error";
import FormField from "@/components/ui/forms/FormField";
import Button from "@/components/ui/button/Button";
import ModalBox from "@/components/ui/modal/ModalBox";

type AddCategoryModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function AddCategoryModal({
    isOpen,
    onClose,
    onDone,
}: AddCategoryModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { mutate: addCategory, isPending, isError } = useAddCategory();

    const handleClose = () => {
        resetValue()
        onClose(false);
    };

    const resetValue = () => {
        setName("");
        setDescription("");
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a category name.");
            return;
        }

        const newCategory: Category = {
            name: name,
            description: description,
        };

        addCategory(newCategory, {
            onSuccess: () => {
                toast.success("Category added successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to add category: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to add category: Unknown error");
                }
            }
        });;
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Add Category</h2>
            </ModalBox.Header>
            <ModalBox.Body>
                <FormField
                    label="Name"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter category name"
                    required
                />
                <FormField
                    label="Description"
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter category description"
                    rows={4}
                    type="textarea"
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
    );
}
