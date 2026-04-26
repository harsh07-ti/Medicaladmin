import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function Medicines() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', price: '', image: '', description: '', shopId: 'Admin' });

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'medicines'));
      setMedicines(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'medicines'), { ...newMed, price: parseFloat(newMed.price) });
    setShowAddForm(false);
    setNewMed({ name: '', price: '', image: '', description: '', shopId: 'Admin' });
    fetchMedicines();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this medicine?')) {
      await deleteDoc(doc(db, 'medicines', id));
      fetchMedicines();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Medicines</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Medicine
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-md shadow mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Medicine Name" className="border p-2 rounded" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
            <input required type="number" step="0.01" placeholder="Price" className="border p-2 rounded" value={newMed.price} onChange={e => setNewMed({...newMed, price: e.target.value})} />
            <input placeholder="Image URL (Optional)" className="border p-2 rounded" value={newMed.image} onChange={e => setNewMed({...newMed, image: e.target.value})} />
            <input placeholder="Description" className="border p-2 rounded" value={newMed.description} onChange={e => setNewMed({...newMed, description: e.target.value})} />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save Medicine</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? <div className="col-span-full text-center">Loading...</div> : null}
        {!loading && medicines.length === 0 ? <div className="col-span-full text-center text-gray-500">No medicines found</div> : null}
        {medicines.map((med) => (
          <div key={med.id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
            <img 
              src={med.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'} 
              alt={med.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">{med.name}</h3>
              <p className="text-gray-500 text-sm flex-1">{med.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">${med.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(med.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-5 w-5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
