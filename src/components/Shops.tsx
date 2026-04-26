import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Trash2, Check, X } from 'lucide-react';

export default function Shops() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShop, setNewShop] = useState({ name: '', owner: '', phone: '', status: 'Pending' });

  const fetchShops = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'shops'));
      setShops(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'shops'), newShop);
    setShowAddForm(false);
    setNewShop({ name: '', owner: '', phone: '', status: 'Pending' });
    fetchShops();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'shops', id), { status });
    fetchShops();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this shop?')) {
      await deleteDoc(doc(db, 'shops', id));
      fetchShops();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Shops</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Shop
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-md shadow mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required placeholder="Shop Name" className="border p-2 rounded" value={newShop.name} onChange={e => setNewShop({...newShop, name: e.target.value})} />
            <input required placeholder="Owner Name" className="border p-2 rounded" value={newShop.owner} onChange={e => setNewShop({...newShop, owner: e.target.value})} />
            <input required placeholder="Phone" className="border p-2 rounded" value={newShop.phone} onChange={e => setNewShop({...newShop, phone: e.target.value})} />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save Shop</button>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? <div className="p-4">Loading...</div> : (
          <ul className="divide-y divide-gray-200">
            {shops.map((shop) => (
              <li key={shop.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{shop.name}</h3>
                  <p className="text-sm text-gray-500">{shop.owner} &bull; {shop.phone}</p>
                  <span className={`inline-flex px-2 text-xs font-semibold rounded-full mt-1 ${
                    shop.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    shop.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {shop.status || 'Pending'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateStatus(shop.id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve"><Check className="h-5 w-5" /></button>
                  <button onClick={() => handleUpdateStatus(shop.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Reject"><X className="h-5 w-5" /></button>
                  <button onClick={() => handleDelete(shop.id)} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Delete"><Trash2 className="h-5 w-5" /></button>
                </div>
              </li>
            ))}
            {shops.length === 0 && <li className="p-4 text-center text-gray-500">No shops found</li>}
          </ul>
        )}
      </div>
    </div>
  );
}
