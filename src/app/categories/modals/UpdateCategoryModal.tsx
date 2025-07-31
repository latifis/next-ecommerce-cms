"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useCategoryById, useUpdateCategory } from "@/satelite/services/categoryService";
import { Category } from "@/types/category/category";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import FormField from "@/components/ui/forms/FormField";
import Button from "@/components/ui/button/Button";
import FormCategorySkeleton from "@/components/skeletons/inputForm/formCategorySkeleton";
import ModalBox from "@/components/ui/modal/ModalBox";

type UpdateCategoryModalProps = {
    categoryIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateCategoryModal({
    categoryIdToUpdate,
    isOpen,
    onClose,
    onDone,
}: UpdateCategoryModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { mutate: updateCategory, isPending: isPendingUpdate } = useUpdateCategory();
    const { data: category, isPending, isError } = useCategoryById(categoryIdToUpdate);

    useEffect(() => {
        if (isOpen && category) {
            setName(category.data.name || "");
            setDescription(category.data.description || "");
        }
    }, [isOpen, category]);

    const resetValue = () => {
        setName("");
        setDescription("");
    };

    const handleClose = () => {
        resetValue();
        onClose(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a category name.");
            return;
        }

        const updatedCategory: Category = {
            id: categoryIdToUpdate,
            name,
            description,
        };

        updateCategory(updatedCategory, {
            onSuccess: () => {
                toast.success("Category updated successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to update category: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to update category: Unknown error");
                }
            }
        });
    };

    if (!isOpen) return null;

    if (isError) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Update Category</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                {isPending ? (
                    <FormCategorySkeleton />
                ) : (
                    <>
                        <FormField
                            label="Name"
                            id="name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter category name"
                            disabled={isPending || isPendingUpdate}
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
                            disabled={isPending || isPendingUpdate}
                        />
                    </>
                )}
            </ModalBox.Body>

            <ModalBox.Footer>
                <Button
                    onClick={handleSave}
                    loading={isPendingUpdate}
                    disabled={isPendingUpdate || isPending}
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
