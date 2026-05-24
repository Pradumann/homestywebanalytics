'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  LogIn, 
  Home, 
  Building,
  TrendingUp,
  UserPlus,
  MessageCircle,
  LogOut
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { colors } from '../../utils/colors';

export default function BasicUserData() {
  const router = useRouter();
  
  // Redux state
  const { user } = useAppSelector(state => state.auth as any);

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (!user) {
      router.push('/authScreens');
      return;
    }
  }, [user, router]);

  // Mock data for demonstration
  const statsData = [
    {
      title: 'Total Sign Up',
      value: '12,847',
      icon: UserPlus,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Users registered on platform'
    },
    {
      title: 'Login Today',
      value: '3,421',
      icon: LogIn,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      description: 'Active users today'
    },
    {
      title: 'Total Tenants',
      value: '8,234',
      icon: Home,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      description: 'Registered tenants'
    },
    {
      title: 'Total Landlords',
      value: '4,613',
      icon: Building,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      description: 'Property owners'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.creamBackground }}>
      {/* Floating Sidebar */}
      <div className="fixed z-50 w-64 floating-island rounded-card hover-lift transform translate-x-0"
           style={{ 
             height: '70vh', 
             left: '2.4%', 
             top: '13.6%',
             backgroundColor: colors.cardBackground 
           }}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg mr-3" style={{ backgroundColor: colors.primarySage }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Homesty</span>
          </div>
        </div>
        
        <div className="flex flex-col h-full">
          <nav className="mt-8 px-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 8rem)' }}>
            <a href="/dashboard/basicUserData" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-purple-50 text-purple-700">
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <a href="/dashboard/customerSupport" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 mt-1">
              <MessageCircle className="mr-3 h-5 w-5" />
              Customer support
            </a>
          </nav>
          
          {/* Sign Out Button at Bottom */}
          <div className="px-4 pb-4 mt-auto">
            <button 
              onClick={() => router.push('/authScreens')}
              className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Dashboard Content */}
        <main className="p-6" style={{ marginLeft: '18%' }}>
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Basic User Data</h1>
              <p className="text-gray-600 mt-2">Platform statistics and user information overview</p>
            </div>

            {/* Scrollable Floating Island Container */}
            <div className="floating-island rounded-card hover-lift p-8 overflow-y-auto" 
                 style={{ height: '70vh' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</h3>
                    <p className="text-sm text-gray-600">{stat.description}</p>
                  </div>
                ))}
              </div>

              {/* Additional Information Section */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">New registrations today</span>
                      <span className="text-sm font-semibold text-gray-900">+127</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Active sessions</span>
                      <span className="text-sm font-semibold text-gray-900">892</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">New properties listed</span>
                      <span className="text-sm font-semibold text-gray-900">+34</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Growth</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Monthly growth rate</span>
                      <span className="text-sm font-semibold text-green-600">+12.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">User retention</span>
                      <span className="text-sm font-semibold text-gray-900">87.3%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Avg. session duration</span>
                      <span className="text-sm font-semibold text-gray-900">4m 32s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">17,460</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">89.2%</div>
                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <div className="text-sm text-gray-600">Support Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
