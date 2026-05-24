'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Menu,
  X,
  Home,
  Settings,
  FileText,
  Users,
} from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { colors } from '../utils/colors';

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Redux state
  const { user } = useAppSelector(state => state.auth as any);

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (!user) {
      router.push('/authScreens');
      return;
    }
  }, [user, router]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.creamBackground }}>
      {/* Floating Sidebar */}
      <div className={`fixed z-50 w-64 floating-island rounded-card hover-lift transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}
           style={{ 
             height: '70vh', 
             left: '2.4%', 
             top: '10%',
             backgroundColor: colors.cardBackground 
           }}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg mr-3" style={{ backgroundColor: colors.primarySage }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Homesty</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 4rem)' }}>
          <a href="/dashboard/basicUserData" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-purple-50 text-purple-700">
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 mt-1">
            <FileText className="mr-3 h-5 w-5" />
            Reports
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 mt-1">
            <Users className="mr-3 h-5 w-5" />
            Users
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 mt-1">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div>
        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome! Here's what's happening with your app today.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
