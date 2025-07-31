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
    ChartTypeRegistry
} from "chart.js";

import {
    useMonthlySales,
    useTopCategories,
    useTopPaymentMethods,
    useTopSellingProducts
} from "@/satelite/services/statisticService";
import ErrorComponent from "@/components/ui/feedback/Error";
import SalesChartSkeleton from "@/components/skeletons/dashboard/SalesChartSkeleton";
import PageHeader from "@/components/ui/layout/PageHeader";

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

export default function SalesChart() {
    const monthlySalesRef = useRef<HTMLCanvasElement>(null!);
    const topProductsRef = useRef<HTMLCanvasElement>(null!);
    const topCategoriesRef = useRef<HTMLCanvasElement>(null!);
    const topPaymentsRef = useRef<HTMLCanvasElement>(null!);

    const chartInstances = useRef<Record<string, Chart | null>>({
        monthly: null,
        topProducts: null,
        topCategories: null,
        topPayments: null,
    });

    const currentYear = new Date().getFullYear().toString();
    const currentMonth2 = new Date().getMonth() + 1;
    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    const filter = {
        year: currentYear,
        topCount: 5,
        month: currentMonth2,
    };

    const {
        data: monthlySales,
        isPending: isPendingMonthlySales,
        isError: isErrorMonthlySales
    } = useMonthlySales({ year: currentYear });

    const {
        data: topSellingProducts,
        isPending: isPendingTopSellingProducts,
        isError: isErrorTopSellingProducts
    } = useTopSellingProducts(filter);

    const {
        data: topCategories,
        isPending: isPendingTopCategories,
        isError: isErrorTopCategories
    } = useTopCategories(filter);

    const {
        data: topPaymentMethods,
        isPending: isPendingTopPaymentMethods,
        isError: isErrorTopPaymentMethods
    } = useTopPaymentMethods(filter);

    useEffect(() => {
        if (
            !monthlySales ||
            !topSellingProducts ||
            !topCategories ||
            !topPaymentMethods
        ) return;

        const chartRefSnapshot = chartInstances.current;

        const renderChart = (
            key: keyof typeof chartRefSnapshot,
            ref: React.RefObject<HTMLCanvasElement>,
            type: keyof ChartTypeRegistry,
            labels: string[],
            dataset: {
                label: string;
                data: number[];
                backgroundColor: string;
            },
            title: string,
            hoverTooltip: (context: { dataIndex: number; raw: number }) => string
        ) => {
            const ctx = ref.current?.getContext("2d");
            if (!ctx) return;

            if (chartRefSnapshot[key]) {
                chartRefSnapshot[key]!.destroy();
            }

            chartRefSnapshot[key] = new Chart(ctx, {
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
                                label: (tooltipItem) =>
                                    hoverTooltip({
                                        dataIndex: tooltipItem.dataIndex,
                                        raw: tooltipItem.raw as number,
                                    }),
                            },
                        },
                    },
                },
            });
        };

        const msData = monthlySales.data.monthlySales;
        const msLabels = msData.map((item) => {
            const date = new Date(0);
            date.setMonth(item.month - 1);
            return date.toLocaleString("default", { month: "long" });
        });

        renderChart(
            "monthly",
            monthlySalesRef,
            "line",
            msLabels,
            {
                label: "Sales (IDR)",
                data: msData.map((item) => item.totalRevenue),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            "Monthly Sales",
            (context) => `Sales: ${context.raw.toLocaleString()} IDR`
        );

        renderChart(
            "topProducts",
            topProductsRef,
            "bar",
            topSellingProducts.data.topSellingProducts.map((p) => p.name),
            {
                label: "Sales (IDR)",
                data: topSellingProducts.data.topSellingProducts.map((p) => p.totalSales),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            "Top Selling Products",
            (context) => {
                const p = topSellingProducts.data.topSellingProducts[context.dataIndex];
                return `Revenue: ${p.totalRevenue.toLocaleString()} IDR\nPrice: ${p.price.toLocaleString()} IDR`;
            }
        );

        renderChart(
            "topCategories",
            topCategoriesRef,
            "bar",
            topCategories.data.topCategories.map((c) => c.category),
            {
                label: "Sales (IDR)",
                data: topCategories.data.topCategories.map((c) => c.totalSales),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            "Top Categories",
            (context) => {
                const c = topCategories.data.topCategories[context.dataIndex];
                return `Revenue: ${c.totalRevenue.toLocaleString()} IDR`;
            }
        );

        renderChart(
            "topPayments",
            topPaymentsRef,
            "bar",
            topPaymentMethods.data.topPaymentMethods.map((p) => p.paymentMethod),
            {
                label: "Transactions",
                data: topPaymentMethods.data.topPaymentMethods.map((p) => p.totalTransactions),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
            "Top Payment Methods",
            (context) => {
                const p = topPaymentMethods.data.topPaymentMethods[context.dataIndex];
                return `Revenue: ${p.totalRevenue.toLocaleString()} IDR`;
            }
        );

        return () => {
            Object.values(chartRefSnapshot).forEach((chart) => chart?.destroy());
        };
    }, [
        monthlySales,
        topSellingProducts,
        topCategories,
        topPaymentMethods
    ]);

    if (
        isErrorMonthlySales ||
        isErrorTopSellingProducts ||
        isErrorTopCategories ||
        isErrorTopPaymentMethods
    ) return <ErrorComponent />;

    if (
        isPendingMonthlySales ||
        isPendingTopSellingProducts ||
        isPendingTopCategories ||
        isPendingTopPaymentMethods
    ) return <SalesChartSkeleton />;

    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 mx-2">
            <div className="grid gap-4 w-full">

                <PageHeader
                    title="Sales Overview"
                    subtitle="A quick summary of the latest orders in your system and sales performance, helping you make better business decisions."
                    className="mb-2 mx-2"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-2">Monthly Sales</h2>
                        <div className="w-full h-[500px]">
                            <canvas ref={monthlySalesRef}></canvas>
                        </div>
                    </div>

                    <div className="col-span-1 bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-2">
                            {currentMonth}&apos;s Top Payment Methods
                        </h2>
                        <div className="w-full h-[500px]">
                            <canvas ref={topPaymentsRef}></canvas>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-2">
                            {currentMonth}&apos;s Top Selling Products
                        </h2>
                        <div className="w-full h-[300px]">
                            <canvas ref={topProductsRef}></canvas>
                        </div>
                    </div>

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
