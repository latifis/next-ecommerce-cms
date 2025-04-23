import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";
import { fetchOrders } from "@/satelite/hook/order/useOrders";
import StatisticsOrders from "./StatisticsOrder";
import { fetchStatistics } from "@/satelite/hook/statistics/useStatistics";
import { fetchMonthlySales } from "@/satelite/hook/statistics/useMonthlySales";
import { fetchTopSellingProducts } from "@/satelite/hook/statistics/useTopSellingProducts";
import { fetchTopCategories } from "@/satelite/hook/statistics/useTopCategories";
import { fetchTopPaymentMethods } from "@/satelite/hook/statistics/useTopPaymentMethods";

export default async function Dashboard() {

    const currentYear = new Date().getFullYear().toString();
    const currentMonth = new Date().getMonth() + 1;
    const filter = {
        year: currentYear,
        topCount: 5,
        month: currentMonth,
    }

    const orders = await fetchOrders({
        sortField: "updatedAt"
    });

    const statistics = await fetchStatistics();
    const monthlySales = await fetchMonthlySales({ year: currentYear });
    const topSellingProducts = await fetchTopSellingProducts(filter);
    const topCategories = await fetchTopCategories(filter);
    const topPayment = await fetchTopPaymentMethods(filter);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8">
            {/* Statistics Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                <StatisticsOrders statistics={statistics.data.statistics} />
            </section>

            {/* Graph Section */}
            <section className="mb-10">
                <SalesChart
                    monthlySales={monthlySales.data.monthlySales}
                    topSellingProducts={topSellingProducts.data.topSellingProducts}
                    topCategories={topCategories.data.topCategories}
                    topPaymentMethods={topPayment.data.topPaymentMethods}
                />
            </section>

            {/* Recent Orders Section */}
            <section>
                <RecentOrders recentOrders={orders?.data.data || []} />
            </section>
        </div>
    );
}
