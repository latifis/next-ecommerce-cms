"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import { useCategories } from "@/satelite/services/categoryService";
import { useAddProduct } from "@/satelite/services/productService";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useBrands } from "@/satelite/services/brandService";
import ModalBox from "@/components/ui/modal/ModalBox";
import FormField from "@/components/ui/forms/FormField";
import FormSelect from "@/components/ui/forms/FormSelect";
import FormFileUpload from "@/components/ui/forms/FormFileUpload";
import Button from "@/components/ui/button/Button";
import { toOptions } from "@/utils/options";

type AddProductModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDone?: () => void;
    onDirectAdd?: (code: string) => void;
    initialCode?: string;
};

export default function AddProductModal({
    isOpen,
    onClose,
    onDone,
    onDirectAdd,
    initialCode = "",
}: AddProductModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(2500);
    const [purchasePrice, setPurchasePrice] = useState<number>(2200);
    const [stock, setStock] = useState<number>(100);
    const [weight, setWeight] = useState<number>(0);
    const [categoryId, setCategoryId] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [brandId, setBrandId] = useState("");
    const [unit, setUnit] = useState("");
    const [weightUnit, setWeightUnit] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [minQuantityForDiscount, setMinQuantityForDiscount] = useState<number>(10);
    const [bulkDiscountPrice, setBulkDiscountPrice] = useState<number>(2000);
    const [code, setCode] = useState("");

    const nameInputRef = useRef<HTMLInputElement>(null);

    const units = [
        'Piece', 'Pack', 'Box', 'Dozen', 'Bottle', 'Can',
        'Bag', 'Sachet', 'Roll', 'Carton', 'Set', 'Bundle'
    ];

    const weightUnits = [
        'Kilogram', 'Gram', 'Liter', 'Milliliter', 'Pound', 'Ounce', 'Sheet'
    ];

    const filters = { limit: 10000 };
    const { mutate: addProduct, isPending, isError } = useAddProduct();
    const { data: categoryData, isPending: isPendingCategory, isError: isErrorCategory } = useCategories(filters);
    const { data: brandData, isPending: isPendingBrand, isError: isErrorBrand } = useBrands(filters);

    const categoryOptions = toOptions(categoryData?.data.data, "id", "name");
    const brandOptions = toOptions(brandData?.data.data, "id", "name");

    useEffect(() => {
        if (isOpen) {
            setCode(initialCode);
        }
    }, [initialCode, isOpen]);

    useEffect(() => {
        if (isOpen && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isOpen]);

    const handleClose = () => {
        resetValue()
        onClose(false);
    };

    const resetValue = () => {
        setName("");
        setDescription("");
        setPrice(2500);
        setPurchasePrice(2200);
        setStock(100);
        setCategoryId("")
        setImageFile(null);
        setBrandId("");
        setUnit("");
        setDiscountPercentage(0);
        setMinQuantityForDiscount(10);
        setBulkDiscountPrice(2000);
        setCode("");
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error("Please enter a product name.");
            return;
        } else if (!price) {
            toast.error("Please enter a product price.");
            return;
        } else if (!purchasePrice) {
            toast.error("Please enter a product purchase price.");
            return;
        } else if (!stock) {
            toast.error("Please enter a product stock.");
            return;
        } else if (!unit) {
            toast.error("Please enter a product unit.");
            return;
        } else if (!weight) {
            toast.error("Please enter a product weight.");
            return;
        } else if (!weightUnit) {
            toast.error("Please enter a product weight unit.");
            return;
        } else if (!discountPercentage && discountPercentage !== 0) {
            toast.error("Please enter a discount percentage.");
            return;
        } else if (!minQuantityForDiscount) {
            toast.error("Please enter a min quantity for discount.");
            return;
        } else if (!bulkDiscountPrice) {
            toast.error("Please enter a bulk discount price.");
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

        const newProduct = new FormData();
        newProduct.append("name", name);
        newProduct.append("description", description);
        newProduct.append("price", price.toString());
        newProduct.append("purchasePrice", purchasePrice.toString());
        newProduct.append("stock", stock.toString());
        newProduct.append("unit", unit);
        newProduct.append("weight", weight.toString());
        newProduct.append("weightUnit", weightUnit);
        newProduct.append("categoryId", categoryId);
        newProduct.append("brandId", brandId);
        newProduct.append("discountPercentage", discountPercentage.toString());
        newProduct.append("minQuantityForDiscount", minQuantityForDiscount.toString());
        newProduct.append("bulkDiscountPrice", bulkDiscountPrice.toString());
        if (imageFile) {
            newProduct.append("file", imageFile);
        }
        newProduct.append("code", code);

        addProduct(newProduct, {
            onSuccess: (data) => {
                toast.success("Product added successfully.");
                if (onDone) onDone();
                if (onDirectAdd) onDirectAdd(data.data.code);
                resetValue();
                onClose(false);
            },
            onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                    if (error.response?.data?.message) {
                        toast.error("Failed to add product: " + error.response.data.message);
                    }
                } else {
                    toast.error("Failed to add product: Unknown error");
                }
            }
        });;
    };

    if (!isOpen) return null;

    if (isError || isErrorCategory || isErrorBrand) return <ErrorComponent />;

    return (
        <ModalBox isOpen={isOpen} onClose={handleClose}>
            <ModalBox.Header>
                <h2>Add Product</h2>
            </ModalBox.Header>

            <ModalBox.Body>
                <FormField
                    label="Name"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter product name"
                    required
                />

                <FormField
                    label="Description"
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    type="textarea"
                />

                <FormField
                    label="Code"
                    id="code"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Enter code name"
                    required
                />

                <FormField
                    label="Purchase Price"
                    id="purchasePrice"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    placeholder="Enter product purchase price"
                    required
                    min={0}
                />

                <FormField
                    label="Price"
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="Enter product price"
                    required
                    min={0}
                />

                <FormField
                    label="Stock"
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    placeholder="Enter product stock"
                    min={0}
                    required
                />

                <FormSelect
                    label="Unit"
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    options={units.map((unitOption) => ({
                        value: unitOption,
                        label: unitOption,
                    }))}
                    required
                    placeholder="Select unit"
                />

                <FormField
                    label="Weight"
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={e => setWeight(Number(e.target.value))}
                    placeholder="Enter product weight"
                    min={0}
                    required
                />

                <FormSelect
                    label="Weight Unit"
                    id="weightUnit"
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    options={weightUnits.map((weightUnitOption) => ({
                        value: weightUnitOption,
                        label: weightUnitOption,
                    }))}
                    required
                    placeholder="Select weight unit"
                />

                <FormField
                    label="Discount Percentage"
                    id="discountPercentage"
                    type="number"
                    value={discountPercentage}
                    onChange={e => setDiscountPercentage(Number(e.target.value))}
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
                    placeholder="Enter product bulk discount price"
                    min={0}
                    required
                />

                <FormFileUpload
                    label="Product Logo"
                    file={imageFile}
                    setFile={setImageFile}
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
                    isLoading={isPendingBrand}
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
