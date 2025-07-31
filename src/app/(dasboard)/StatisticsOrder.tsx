"use client";

import ErrorComponent from "@/components/ui/feedback/Error";
import StatisticsSkeleton from "@/components/skeletons/dashboard/StatisticsSkeleton";
import { useStatistics } from "@/satelite/services/statisticService";
import Link from "next/link";
import { FaBox, FaShoppingCart, FaTags, FaUsers } from "react-icons/fa";
import { FaRupiahSign } from "react-icons/fa6";

export default function StatisticsOrders() {

    const { data: statistics, isPending, isError } = useStatistics();

    if (isError) return <ErrorComponent />;

    if (isPending || !statistics) return <StatisticsSkeleton />;

    statisticsData[0].value = statistics.data.statistics.totalProducts;
    statisticsData[1].value = statistics.data.statistics.totalCategories;
    statisticsData[2].value = statistics.data.statistics.totalUsers;
    statisticsData[3].value = statistics.data.statistics.totalOrders;
    statisticsData[4].value = `${parseInt(statistics.data.statistics.totalRevenue).toLocaleString('id-ID')}`;

    return (
        <>
            {
                statisticsData.map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                        <Link href={stat.link} className="flex items-center w-full">
                            <div className="mr-4">{stat.icon}</div>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-500 mb-1 flex items-center">
                                    {index == 4
                                        ? <>
                                            {stat.name}
                                            <span className="text-xs text-gray-300 ml-1">(IDR)</span>
                                        </>
                                        : stat.name
                                    }
                                </h2>
                                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString('id-ID')}</p>
                            </div>
                        </Link>
                    </div>
                ))
            }
        </>
    );
}

const statisticsData = [
    {
        name: "Total Products",
        value: 0,
        link: "/products",
        icon: <FaBox className="text-blue-500 text-3xl" />,
    },
    {
        name: "Total Categories",
        value: 0,
        link: "/categories",
        icon: <FaTags className="text-green-500 text-3xl" />,
    },
    {
        name: "Total Users",
        value: 0,
        link: "/users",
        icon: <FaUsers className="text-purple-500 text-3xl" />,
    },
    {
        name: "Total Orders",
        value: 0,
        link: "/orders",
        icon: <FaShoppingCart className="text-yellow-500 text-3xl" />,
    },
    {
        name: "Total Revenue",
        value: "",
        link: "/",
        icon: <FaRupiahSign className="text-red-500 text-3xl" />,
    },
];