import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersSnap, boysSnap] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'delivery_boys'))
      ]);
      setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
      setDeliveryBoys(boysSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'orders', id), { status: newStatus });
    fetchData();
  };

  const handleAssignBoy = async (id: string, boyId: string) => {
    await updateDoc(doc(db, 'orders', id), { assignedDeliveryBoy: boyId });
    fetchData();
  };

  const filteredOrders = filterStatus === 'All' ? orders : orders.filter(o => o.status === filterStatus);

  const statuses = ['Placed', 'Accepted', 'Packed', 'Assigned', 'Delivered'];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <select 
          className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? <div className="p-4">Loading...</div> : (
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <li key={order.id} className="p-4 hover:bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">Order #{order.id.slice(0,8)}</p>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {order.timestamp?.seconds ? format(new Date(order.timestamp.seconds * 1000), 'MMM d, yyyy h:mm a') : 'Unknown Date'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-900">User: {order.userName || order.userId || 'Unknown'}</p>
                    <p className="text-sm text-gray-500 text-wrap">Items: {order.items ? (typeof order.items === 'string' ? order.items : JSON.stringify(order.items)) : 'No items listed'}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">Total: ${order.total?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    <select
                      className="block w-full text-sm border-gray-300 rounded-md"
                      value={order.status || 'Placed'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Assign Delivery Boy</label>
                    <select
                      className="block w-full text-sm border-gray-300 rounded-md"
                      value={order.assignedDeliveryBoy || ''}
                      onChange={(e) => handleAssignBoy(order.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {deliveryBoys.map(boy => <option key={boy.id} value={boy.id}>{boy.name}</option>)}
                    </select>
                  </div>
                </div>
              </li>
            ))}
            {filteredOrders.length === 0 && <li className="p-4 text-center text-gray-500">No orders found</li>}
          </ul>
        )}
      </div>
    </div>
  );
}
