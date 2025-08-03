"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useCategories } from "@/satelite/services/categoryService";
import { useProductById, useUpdateProduct } from "@/satelite/services/productService";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useBrands } from "@/satelite/services/brandService";
import Button from "@/components/ui/button/Button";
import ModalBox from "@/components/ui/modal/ModalBox";
import FormField from "@/components/ui/forms/FormField";
import FormSelect from "@/components/ui/forms/FormSelect";
import FormFileUpload from "@/components/ui/forms/FormFileUpload";
import { toOptions } from "@/utils/options";
import FormProductSkeleton from "@/components/skeletons/inputForm/formProductSkeleton";
import { FaSpinner } from "react-icons/fa";

type UpdateProductModalProps = {
    productIdToUpdate: string | undefined;
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone: () => void;
};

export default function UpdateProductModal({
    productIdToUpdate,
    isOpen,
    onClose,
    onDone,
}: UpdateProductModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(2500);
    const [stock, setStock] = useState<number>(100);
    const [categoryId, setCategoryId] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [brandId, setBrandId] = useState("");
    const [unit, setUnit] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [minQuantityForDiscount, setMinQuantityForDiscount] = useState<number>(10);
    const [bulkDiscountPrice, setBulkDiscountPrice] = useState<number>(2000);
    const [code, setCode] = useState("");

    const units = [
        'Piece', 'Box', 'Kilogram', 'Gram', 'Liter', 'Milliliter', 'Pack', 'Bottle',
        'Can', 'Bag', 'Sachet', 'Tube', 'Jar', 'Bar', 'Roll', 'Dozen', 'Set', 'Bundle',
        'Carton', 'Pouch'
    ];

    const filters = { limit: 10000 };
    const { mutate: updateProduct, isPending: isPendingUpdate } = useUpdateProduct(productIdToUpdate)
    const { data: product, isPending, isError } = useProductById(productIdToUpdate);
    const { data: categoryData, isPending: isPendingCategory, isError: isErrorCategory } = useCategories(filters)
    const { data: brandData, isPending: isPendingBrand, isError: isErrorBrand } = useBrands(filters);

    const categoryOptions = toOptions(categoryData?.data.data, "id", "name");
    const brandOptions = toOptions(brandData?.data.data, "id", "name");

    const handleClose = () => {
        resetValue();
        onClose(false);
    };

    const resetValue = () => {
        setName("");
        setDescription("");
        setPrice(2500);
        setStock(100);
        setCategoryId("");
        setImageFile(null);
        setImageUrl(undefined);
        setBrandId("");
        setUnit("");
        setDiscountPercentage(0);
        setMinQuantityForDiscount(10);
        setBulkDiscountPrice(2000);
        setCode("");
    }

    useEffect(() => {
        if (isOpen && product) {
            setName(product.data.name || "");
            setDescription(product.data.description || "");
            setPrice(product.data.price || 0);
            setStock(product.data.stock || 0);
            setCategoryId(product.data.categoryId || "");
            setBrandId(product.data.brandId || "");
            setImageFile(null);
            setUnit(product.data.unit || "");
            setDiscountPercentage(product.data.discountPercentage || 0);
            setMinQuantityForDiscount(product.data.minQuantityForDiscount || 0);
            setBulkDiscountPrice(product.data.bulkDiscountPrice || 0);
            setCode(product.data.code || "");
            setImageUrl(product.data.imageUrl)
        }
    }, [isOpen, product]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a product name.");
            return;
        } else if (!categoryId) {
            toast.error("Please enter a product category.");
            return;
        } else if (!brandId) {
            toast.error("Please enter a product brand.");
            return;
        } else if (!code) {
            toast.error("Please enter a product code.");
            return;
        } else if (bulkDiscountPrice >= price) {
            toast.error("Bulk discount price must be less than the regular price.");
            return;
        }

        if (!productIdToUpdate) return <ErrorComponent />

        const updatedProduct = new FormData();
        updatedProduct.append("name", name);
        updatedProduct.append("description", description);
        updatedProduct.append("price", price.toString());
        updatedProduct.append("stock", stock.toString());
        updatedProduct.append("categoryId", categoryId);
        updatedProduct.append("brandId", brandId);
        updatedProduct.append("unit", unit);
        updatedProduct.append("discountPercentage", discountPercentage.toString());
        updatedProduct.append("minQuantityForDiscount", minQuantityForDiscount.toString());
        updatedProduct.append("bulkDiscountPrice", bulkDiscountPrice.toString());
        updatedProduct.append("code", code);

        if (imageFile) {
            updatedProduct.append("file", imageFile);
        }

        updateProduct(updatedProduct, {
            onSuccess: () => {
                toast.success("Product updated successfully.");
                onDone();
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to update product: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to update product: Unknown error");
                }
            }
        });
    }

    const handleRemoveImage = () => {
        setImageFile(null);
        setImageUrl(undefined);
    };

    if (isError || isErrorCategory || isErrorBrand) return <ErrorComponent />

    if (!isOpen) return null;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Update Product</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                {isPending ? (
                    <FormProductSkeleton />
                ) : (
                    <>
                        <FormField
                            label="Name"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter product name"
                            disabled={isPendingUpdate}
                            required
                        />

                        <FormField
                            label="Description"
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Enter product description"
                            disabled={isPendingUpdate}
                            rows={4}
                            type="textarea"
                        />

                        <FormField
                            label="Code"
                            id="code"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            disabled={isPendingUpdate}
                            placeholder="Enter code name"
                            required
                        />

                        <FormField
                            label="Price"
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            disabled={isPendingUpdate}
                            placeholder="Enter product price"
                            required
                            min={0}
                        />

                        <FormSelect
                            label="Unit"
                            id="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            disabled={isPendingUpdate}
                            options={units.map((unitOption) => ({
                                value: unitOption,
                                label: unitOption,
                            }))}
                            required
                            placeholder="Select unit"
                        />

                        <FormField
                            label="Discount Percentage"
                            id="discountPercentage"
                            type="number"
                            value={discountPercentage}
                            onChange={e => setDiscountPercentage(Number(e.target.value))}
                            disabled={isPendingUpdate}
                            placeholder="Enter product discount percentage"
                            min={0}
                            required
                        />

                        <FormField
                            label="Min Quantity For Discount"
                            id="minQuantityForDiscount"
                            type="number"
                            value={minQuantityForDiscount}
                            onChange={e => setMinQuantityForDiscount(Number(e.target.value))}
                            disabled={isPendingUpdate}
                            placeholder="Enter product min quantity for discount"
                            min={0}
                            required
                        />

                        <FormField
                            label="Bulk Discount Price"
                            id="bulkDiscountPrice"
                            type="number"
                            value={bulkDiscountPrice}
                            onChange={e => setBulkDiscountPrice(Number(e.target.value))}
                            disabled={isPendingUpdate}
                            placeholder="Enter product bulk discount price"
                            min={0}
                            required
                        />

                        <FormField
                            label="Stock"
                            id="stock"
                            type="number"
                            value={stock}
                            onChange={e => setStock(Number(e.target.value))}
                            disabled={isPendingUpdate}
                            placeholder="Enter product stock"
                            min={0}
                            required
                        />

                        <FormFileUpload
                            label="Product Logo"
                            file={imageFile}
                            setFile={setImageFile}
                            url={imageUrl}
                            onRemoveUrl={handleRemoveImage}
                            disabled={isPendingUpdate}
                            maxSize={200_000}
                        />

                        <FormSelect
                            label="Category Name"
                            id="categoryName"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            options={categoryOptions}
                            required
                            placeholder="Select a category"
                            disabled={isPendingCategory || isPendingUpdate}
                            isLoading={isPendingCategory}
                        />

                        <FormSelect
                            label="Brand Name"
                            id="brandName"
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            options={brandOptions}
                            required
                            placeholder="Select a brand"
                            disabled={isPendingBrand || isPendingUpdate}
                            isLoading={isPendingBrand}
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
    )
}
