/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';

import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Shops from './components/Shops';
import DeliveryBoys from './components/DeliveryBoys';
import Medicines from './components/Medicines';
import Orders from './components/Orders';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Re-validate that the logged-in user is an admin
      const ALLOWED_ADMIN_EMAILS = [
        'admin@example.com',
        'harshvardhantiwari39@gmail.com'
      ];
      
      if (currentUser && currentUser.email && !ALLOWED_ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
        await auth.signOut();
        setUser(null);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <Users />;
      case 'shops': return <Shops />;
      case 'delivery': return <DeliveryBoys />;
      case 'medicines': return <Medicines />;
      case 'orders': return <Orders />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gray-100">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <div className="flex flex-col w-full md:w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
