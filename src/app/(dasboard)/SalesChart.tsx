"use client";

import React, { useEffect, useRef } from "react";
import {
    Chart,
    LineController,
    BarController,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { MonthlySales } from "@/types/statistics/monthlySales";
import { TopSellingProducts } from "@/types/statistics/topSellingProducts";
import { TopCategories } from "@/types/statistics/topCategories";
import { TopPaymentMethods } from "@/types/statistics/topPaymentMethods";

Chart.register(
    LineController,
    BarController,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
);

interface SalesChartProps {
    monthlySales: MonthlySales[];
    topSellingProducts: TopSellingProducts[];
    topCategories: TopCategories[];
    topPaymentMethods: TopPaymentMethods[];
}

export default function SalesChart({
    monthlySales,
    topSellingProducts,
    topCategories,
    topPaymentMethods,
}: SalesChartProps) {
    const monthlySalesRef = useRef<HTMLCanvasElement>(null);
    const topProductsRef = useRef<HTMLCanvasElement>(null);
    const topCategoriesRef = useRef<HTMLCanvasElement>(null);
    const topPaymentsRef = useRef<HTMLCanvasElement>(null);

    const monthlySalesLabels = monthlySales.map((item) => {
        const date = new Date(0);
        date.setMonth(item.month - 1);
        return date.toLocaleString("default", { month: "long" });
    });

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const monthlySalesData = monthlySales.map((item) => item.totalRevenue);

    const renderChart = (
        ref: React.RefObject<HTMLCanvasElement | null>,
        type: "line" | "bar",
        labels: string[],
        dataset: { label: string; data: number[]; backgroundColor: string },
        title: string,
        hoverTooltip: (context: { dataIndex: number; raw: number }) => string
    ) => {
        const ctx = ref.current?.getContext("2d");
        if (ctx) {
            new Chart(ctx, {
                type,
                data: {
                    labels,
                    datasets: [dataset],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        title: {
                            display: true,
                            text: title,
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => hoverTooltip({ dataIndex: tooltipItem.dataIndex, raw: tooltipItem.raw as number }),
                            },
                        },
                    },
                },
            });
        }
    };

    useEffect(() => {
        renderChart(
            monthlySalesRef,
            "line",
            monthlySalesLabels,
            {
                label: "Sales (IDR)",
                data: monthlySalesData,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            "Monthly Sales",
            (context) => `Sales: ${context.raw.toLocaleString()} IDR`
        );

        renderChart(
            topProductsRef,
            "bar",
            topSellingProducts.map((product) => product.name),
            {
                label: "Sales (IDR)",
                data: topSellingProducts.map((product) => product.totalSales),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            "Top Selling Products",
            (context) => {
                const product = topSellingProducts[context.dataIndex];
                return `Revenue: ${product.totalRevenue.toLocaleString()} IDR\nPrice: ${product.price.toLocaleString()} IDR`;
            }
        );

        renderChart(
            topCategoriesRef,
            "bar",
            topCategories.map((category) => category.category),
            {
                label: "Sales (IDR)",
                data: topCategories.map((category) => category.totalSales),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            "Top Categories",
            (context) => {
                const category = topCategories[context.dataIndex];
                return `Revenue: ${category.totalRevenue.toLocaleString()} IDR`;
            }
        );

        renderChart(
            topPaymentsRef,
            "bar",
            topPaymentMethods.map((payment) => payment.paymentMethod),
            {
                label: "Transactions",
                data: topPaymentMethods.map((payment) => payment.totalTransactions),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
            "Top Payment Methods",
            (context) => {
                const paymentMethod = topPaymentMethods[context.dataIndex];
                return `Revenue: ${paymentMethod.totalRevenue.toLocaleString()} IDR`;
            }
        );
    }, [
        monthlySalesLabels,
        monthlySalesData,
        topSellingProducts,
        topCategories,
        topPaymentMethods,
    ]);

    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 mx-2">
            <div className="grid gap-4 w-full">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800">Sales Overview</h2>
                    <p className="text-gray-600 text-sm mt-2">
                        A quick summary of the latest orders in your system and sales performance, helping you make better business decisions.
                    </p>
                </div>

                {/* Monthly Sales and Top Payment Methods Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Monthly Sales */}
                    <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-2">Monthly Sales</h2>
                        <div className="w-full h-[500px]">
                            <canvas ref={monthlySalesRef}></canvas>
                        </div>
                    </div>

                    {/* Top Payment Methods */}
                    <div className="col-span-1 bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-2">
                            {currentMonth}&apos;s Top Payment Methods
                        </h2>
                        <div className="w-full h-[500px]">
                            <canvas ref={topPaymentsRef} style={{ height: "100%", width: "100%" }}></canvas>
                        </div>
                    </div>
                </div>

                {/* Top Selling Products and Top Categories Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Top Selling Products */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-2">
                            {currentMonth}&apos;s Top Selling Products
                        </h2>
                        <div className="w-full h-[300px]">
                            <canvas ref={topProductsRef}></canvas>
                        </div>
                    </div>

                    {/* Top Categories */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-2">
                            {currentMonth}&apos;s Top Categories
                        </h2>
                        <div className="w-full h-[300px]">
                            <canvas ref={topCategoriesRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
