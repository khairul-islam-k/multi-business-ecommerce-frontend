

export default function DashboardPage() {
    return (

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Orders</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">120</h2>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Products</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">45</h2>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Revenue</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">৳25,000</h2>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Customers</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">320</h2>
            </div>
        </div>
    );
}