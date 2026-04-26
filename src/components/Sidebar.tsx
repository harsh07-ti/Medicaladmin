import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Bike, 
  Pill, 
  ShoppingCart,
  LogOut
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

type Props = {
  currentView: string;
  onChangeView: (view: string) => void;
};

export default function Sidebar({ currentView, onChangeView }: Props) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'shops', label: 'Shops', icon: Store },
    { id: 'delivery', label: 'Delivery Boys', icon: Bike },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="flex md:flex-shrink-0">
      <div className="flex flex-row md:flex-col w-full md:w-64 bg-slate-900 border-b md:border-b-0 border-slate-800">
        <div className="flex flex-col md:h-0 flex-1">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-slate-900 border-b border-slate-800">
            <h1 className="text-xl font-bold text-white flex items-center">
              <Pill className="h-6 w-6 mr-2 text-blue-400" />
              RSMediHub
            </h1>
          </div>
          <div className="flex-1 flex overflow-x-auto md:flex-col md:overflow-y-auto">
            <nav className="flex-1 flex md:flex-col px-2 space-x-2 md:space-x-0 md:space-y-1 py-2 md:py-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChangeView(item.id)}
                    className={`
                      ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                      group flex items-center px-3 py-2 text-sm font-medium rounded-md w-auto md:w-full text-left whitespace-nowrap
                    `}
                  >
                    <Icon className={`
                      ${isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}
                      mr-2 md:mr-3 flex-shrink-0 h-5 w-5 md:h-6 md:w-6
                    `} />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-slate-800 p-2 md:p-4 mt-auto md:mt-0 items-center justify-center">
            <button
              onClick={() => signOut(auth)}
              className="group block text-slate-300 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-slate-400 group-hover:text-slate-300" />
                <span className="hidden md:block text-sm font-medium">Log out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
