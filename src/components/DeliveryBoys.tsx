import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Trash2 } from 'lucide-react';

export default function DeliveryBoys() {
  const [boys, setBoys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBoy, setNewBoy] = useState({ name: '', phone: '', vehicleNumber: '' });

  const fetchBoys = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'delivery_boys'));
      setBoys(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoys();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'delivery_boys'), newBoy);
    setShowAddForm(false);
    setNewBoy({ name: '', phone: '', vehicleNumber: '' });
    fetchBoys();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this delivery boy?')) {
      await deleteDoc(doc(db, 'delivery_boys', id));
      fetchBoys();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Delivery Boys</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Delivery Boy
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-md shadow mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required placeholder="Name" className="border p-2 rounded" value={newBoy.name} onChange={e => setNewBoy({...newBoy, name: e.target.value})} />
            <input required placeholder="Phone" className="border p-2 rounded" value={newBoy.phone} onChange={e => setNewBoy({...newBoy, phone: e.target.value})} />
            <input required placeholder="Vehicle Number" className="border p-2 rounded" value={newBoy.vehicleNumber} onChange={e => setNewBoy({...newBoy, vehicleNumber: e.target.value})} />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? <div className="p-4">Loading...</div> : (
          <ul className="divide-y divide-gray-200">
            {boys.map((boy) => (
              <li key={boy.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{boy.name}</h3>
                  <p className="text-sm text-gray-500">{boy.phone} &bull; {boy.vehicleNumber}</p>
                </div>
                <button onClick={() => handleDelete(boy.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-5 w-5" /></button>
              </li>
            ))}
            {boys.length === 0 && <li className="p-4 text-center text-gray-500">No delivery boys found</li>}
          </ul>
        )}
      </div>
    </div>
  );
}
