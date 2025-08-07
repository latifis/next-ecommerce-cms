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
import FormSelect from "@/components/ui/forms/FormSelect";
import { LinkType } from "@/enum/linkType";
import { useProducts } from "@/satelite/services/productService";
import { useCategories } from "@/satelite/services/categoryService";
import { useBrands } from "@/satelite/services/brandService";

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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [sequence, setSequence] = useState(0);
    const [linkType, setLinkType] = useState<LinkType>(LinkType.PRODUCT)
    const [linkValue, setLinkValue] = useState("");

    const filters = { limit: 10000 };
    const { mutate: addBanner, isPending, isError } = useAddBanner();
    const { data: productData, isPending: isPendingProduct, isError: isErrorProduct } = useProducts(filters);
    const { data: categoryData, isPending: isPendingCategory, isError: isErrorCategory } = useCategories(filters);
    const { data: brandData, isPending: isPendingBrand, isError: isErrorBrand } = useBrands(filters);

    const handleClose = () => {
        resetValue();
        onClose(false);
    }

    const resetValue = () => {
        setName("");
        setLinkType(LinkType.PRODUCT);
        setImageFile(null);
        setDescription("");
        setSequence(0);
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !linkType || !imageFile || !description || !sequence) {
            toast.error("Please fill all fields");
            return;
        }

        const newBanner = new FormData();
        newBanner.append("name", name);
        newBanner.append("description", description);
        newBanner.append("sequence", sequence.toString());
        newBanner.append("mediaType", "Banner");
        newBanner.append("linkType", linkType);
        newBanner.append("linkValue", linkValue);
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

    if (isError || isErrorProduct || isErrorCategory || isErrorBrand) return <ErrorComponent />;

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

                <FormSelect
                    label="Link Type"
                    id="linkType"
                    value={linkType}
                    onChange={(e) => {
                        setLinkType(e.target.value as LinkType);
                        setLinkValue("");
                    }}
                    options={Object.values(LinkType).map((linkTypeOption) => ({
                        value: linkTypeOption,
                        label: linkTypeOption.charAt(0).toUpperCase() + linkTypeOption.slice(1),
                    }))}
                    required
                    placeholder="Select link type"
                />

                {linkType === LinkType.PRODUCT && (
                    <FormSelect
                        label="Select Product"
                        id="linkValue"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        options={productData?.data?.data?.map((p) => ({
                            value: p.id,
                            label: p.name,
                        })) ?? []}
                        required
                        isLoading={isPendingProduct}
                    />
                )}

                {linkType === LinkType.CATEGORY && (
                    <FormSelect
                        label="Select Category"
                        id="linkValue"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        options={categoryData?.data?.data?.map((p) => ({
                            value: p.name.toLowerCase(),
                            label: p.name,
                        })) ?? []}
                        required
                        isLoading={isPendingCategory}
                    />
                )}

                {linkType === LinkType.BRAND && (
                    <FormSelect
                        label="Select Brand"
                        id="linkValue"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        options={brandData?.data?.data?.map((p) => ({
                            value: p.name.toLowerCase(),
                            label: p.name,
                        })) ?? []}
                        required
                        isLoading={isPendingBrand}
                    />
                )}

                {linkType === LinkType.SEARCH && (
                    <FormField
                        label="Search Keyword"
                        id="linkValue"
                        value={linkValue}
                        onChange={e => setLinkValue(e.target.value)}
                        placeholder="Enter search keyword"
                        required
                    />
                )}

                {linkType === LinkType.CUSTOM && (
                    <FormField
                        label="Custom URL"
                        id="linkValue"
                        value={linkValue}
                        onChange={e => setLinkValue(e.target.value)}
                        placeholder="https://example.com"
                        required
                    />
                )}

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