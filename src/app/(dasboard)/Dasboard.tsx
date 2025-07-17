import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";
import StatisticsOrders from "./StatisticsOrder";

export default async function Dashboard() {
    return (
        <div className="min-h-screen text-gray-800 p-4 sm:p-6 lg:p-8">
            {/* Statistics Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                <StatisticsOrders />
            </section>

            {/* Graph Section */}
            <section className="mb-10">
                <SalesChart />
            </section>

            {/* Recent Orders Section */}
            <section>
                <RecentOrders />
            </section>
        </div>
    );
}
