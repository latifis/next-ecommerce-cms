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
import { LinkType } from "@/enum/linkType";
import { useProducts } from "@/satelite/services/productService";
import { useCategories } from "@/satelite/services/categoryService";
import { useBrands } from "@/satelite/services/brandService";
import FormSelect from "@/components/ui/forms/FormSelect";

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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState("");
    const [sequence, setSequence] = useState(0);
    const [linkType, setLinkType] = useState<LinkType>(LinkType.PRODUCT)
    const [linkValue, setLinkValue] = useState("");

    const filters = { limit: 10000 };
    const { mutate: updateBanner, isPending: isPendingUpdate } = useUpdateBanner(bannerIdToUpdate);
    const { data: banner, isPending, isError } = useBannerById(bannerIdToUpdate);
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
        setLinkValue("");
        setImageFile(null);
        setDescription("");
        setSequence(0);
    }

    useEffect(() => {
        if (isOpen && banner) {
            setName(banner.data.name || "");
            setLinkType(banner.data.linkType || LinkType.PRODUCT)
            setLinkValue(banner.data.linkValue || "");
            setDescription(banner.data.description || "");
            setSequence(banner.data.sequence || 0);
            setImageUrl(banner.data.url);
        }
    }, [isOpen, banner]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedBanner = new FormData();
        updatedBanner.append("name", name);
        updatedBanner.append("description", description);
        updatedBanner.append("sequence", sequence.toString());
        updatedBanner.append("linkType", linkType);
        updatedBanner.append("linkValue", linkValue);
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

    const handleRemoveImage = () => {
        setImageFile(null);
        setImageUrl(undefined);
    };

    if (!isOpen) return null;

    if (isError || isErrorProduct || isErrorCategory || isErrorBrand) return <ErrorComponent />;

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
                            disabled={isPendingUpdate || isPending}
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
                                disabled={isPendingUpdate || isPending}
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
                                disabled={isPendingUpdate || isPending}
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
                                disabled={isPendingUpdate || isPending}
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
                                disabled={isPendingUpdate || isPending}
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
                                disabled={isPendingUpdate || isPending}
                                required
                            />
                        )}

                        <FormFileUpload
                            label="Banner Image"
                            file={imageFile}
                            setFile={setImageFile}
                            url={imageUrl}
                            onRemoveUrl={handleRemoveImage}
                            maxSize={200_000}
                            disabled={isPendingUpdate || isPending}
                            required
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