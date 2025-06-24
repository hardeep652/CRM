
'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, TrendingUp, Target, Calendar, Phone, Mail, DollarSign } from 'lucide-react';

const Dashboard = () => {
  // Sample data - in real app this would come from API
  const [timeframe, setTimeframe] = useState('month');
  
  const monthlyData = [
    { month: 'Jan', leads: 245, clients: 68, revenue: 45000 },
    { month: 'Feb', leads: 312, clients: 89, revenue: 58000 },
    { month: 'Mar', leads: 289, clients: 76, revenue: 52000 },
    { month: 'Apr', leads: 356, clients: 102, revenue: 67000 },
    { month: 'May', leads: 298, clients: 84, revenue: 55000 },
    { month: 'Jun', leads: 389, clients: 118, revenue: 78000 }
  ];

  const leadSourceData = [
    { name: 'Website', value: 35, color: '#3B82F6' },
    { name: 'Social Media', value: 28, color: '#10B981' },
    { name: 'Referrals', value: 20, color: '#F59E0B' },
    { name: 'Email', value: 17, color: '#EF4444' }
  ];

  const totalLeads = monthlyData.reduce((sum, item) => sum + item.leads, 0);
  const totalClients = monthlyData.reduce((sum, item) => sum + item.clients, 0);
  const conversionRate = ((totalClients / totalLeads) * 100).toFixed(1);
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);

  type StatCardProps = {
    icon: React.ElementType;
    title: string;
    value: string | number;
    change: string;
    color: string;
  };

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
              <p className="text-gray-600">Track your leads, conversions, and business growth</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Leads"
            value={totalLeads.toLocaleString()}
            change="+12.5%"
            color="bg-blue-500"
          />
          <StatCard
            icon={UserCheck}
            title="Active Clients"
            value={totalClients.toLocaleString()}
            change="+8.2%"
            color="bg-green-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Conversion Rate"
            value={`${conversionRate}%`}
            change="+2.1%"
            color="bg-purple-500"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${(totalRevenue / 1000).toFixed(0)}K`}
            change="+15.3%"
            color="bg-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Leads vs Clients Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Leads vs Clients</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Leads</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Clients</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="leads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clients" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lead Sources Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Lead Sources</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {leadSourceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>+15.3% vs last period</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value/1000}K`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#F59E0B', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <Phone className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-lg font-bold mb-2">Follow-up Calls</h3>
            <p className="text-blue-100 mb-4">12 leads need follow-up today</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              View Calls
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <Mail className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-lg font-bold mb-2">Email Campaigns</h3>
            <p className="text-green-100 mb-4">3 campaigns running this week</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
              Manage Emails
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <Calendar className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-lg font-bold mb-2">Meetings Today</h3>
            <p className="text-purple-100 mb-4">5 client meetings scheduled</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              View Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;