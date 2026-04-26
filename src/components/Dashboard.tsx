import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users as UsersIcon, Store, Bike, ShoppingCart, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    shops: 0,
    deliveryBoys: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const shopsSnap = await getDocs(collection(db, 'shops'));
        const boysSnap = await getDocs(collection(db, 'delivery_boys'));
        const ordersSnap = await getDocs(collection(db, 'orders'));

        let totalRev = 0;
        ordersSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.status === 'Delivered') {
            totalRev += (data.total || 0);
          }
        });

        setStats({
          users: usersSnap.size,
          shops: shopsSnap.size,
          deliveryBoys: boysSnap.size,
          orders: ordersSnap.size,
          revenue: totalRev,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Users', value: stats.users, icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Total Shops', value: stats.shops, icon: Store, color: 'bg-green-500' },
    { name: 'Delivery Boys', value: stats.deliveryBoys, icon: Bike, color: 'bg-yellow-500' },
    { name: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-purple-500' },
    { name: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'bg-indigo-500' },
  ];

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${item.color}`}>
                      <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{item.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
