'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, TrendingUp, DollarSign, AlertTriangle, Target, Award } from 'lucide-react';
import EmployeeLayout from '../ManagerLayout'; // Import the layout

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedTo: string | null;
  createdAt?: string;
  source?: string;
  status?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedTo: string | null;
  createdAt?: string;
}

interface MonthlyData {
  month: string;
  leads: number;
  clients: number;
  revenue: number;
}

interface LeadSource {
  name: string;
  value: number;
  color: string;
}

const ManagerDashboard = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [leadSourceData, setLeadSourceData] = useState<LeadSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch team leads using manager API
      const leadsResponse = await fetch('http://localhost:8080/api/manager/leads', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!leadsResponse.ok) {
        if (leadsResponse.status === 403) throw new Error('Access denied: Manager role required');
        else if (leadsResponse.status === 401) throw new Error('Please log in to access the dashboard');
        throw new Error(`Failed to fetch team leads: ${leadsResponse.status} ${leadsResponse.statusText}`);
      }
      const leadsData: Lead[] = await leadsResponse.json();
      setLeads(leadsData);

      // Fetch team clients using manager API
      const clientsResponse = await fetch('http://localhost:8080/api/manager/team-clients', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!clientsResponse.ok) {
        if (clientsResponse.status === 403) throw new Error('Access denied: Manager role required');
        else if (clientsResponse.status === 401) throw new Error('Please log in to access the dashboard');
        throw new Error(`Failed to fetch team clients: ${clientsResponse.status} ${clientsResponse.statusText}`);
      }
      const clientsData: Client[] = await clientsResponse.json();
      setClients(clientsData);

      // Process monthly data
      const currentYear = new Date().getFullYear();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const monthlyMetrics: MonthlyData[] = months.map((month, index) => {
        const monthLeads = leadsData.filter(lead => {
          if (!lead.createdAt) return index === 0;
          const leadDate = new Date(lead.createdAt);
          return leadDate.getMonth() === index && leadDate.getFullYear() === currentYear;
        }).length;

        const monthClients = clientsData.filter(client => {
          if (!client.createdAt) return index === 0;
          const clientDate = new Date(client.createdAt);
          return clientDate.getMonth() === index && clientDate.getFullYear() === currentYear;
        }).length;

        const revenue = monthClients * 1000; // Assumed revenue per client
        return { month, leads: monthLeads, clients: monthClients, revenue };
      }).filter(data => data.leads > 0 || data.clients > 0);

      setMonthlyData(monthlyMetrics);

      // Process lead sources
      const sourceCounts = leadsData.reduce((acc, lead) => {
        const source = lead.source || 'Unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalLeads = leadsData.length;
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
      const sources: LeadSource[] = Object.entries(sourceCounts).map(([name, count], index) => ({
        name,
        value: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
        color: colors[index % colors.length]
      }));

      setLeadSourceData(sources);

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Manager Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const totalLeads = leads.length;
  const totalClients = clients.length;
  const conversionRate = totalLeads > 0 ? ((totalClients / totalLeads) * 100).toFixed(1) : '0.0';
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate additional metrics
  const unassignedLeads = leads.filter(lead => !lead.assignedTo).length;
  const hotLeads = leads.filter(lead => lead.status === 'hot' || lead.status === 'interested').length;
  const avgRevenuePerClient = totalClients > 0 ? (totalRevenue / totalClients) : 0;
  
  const calculateChange = (data: MonthlyData[], key: keyof MonthlyData) => {
    if (data.length < 2) return '0.0%';
    const current = data[data.length - 1][key] as number;
    const previous = data[data.length - 2][key] as number;
    return previous > 0 ? ((current - previous) / previous * 100).toFixed(1) + '%' : 'N/A';
  };

  const StatCard: React.FC<{
    icon: React.ElementType;
    title: string;
    value: string | number;
    change: string;
    color: string;
  }> = ({ icon: Icon, title, value, change, color }) => (
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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="text-center">
          <p>{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
          {error.includes('log in') && (
            <button
              onClick={() => window.location.href = '/login'}
              className="ml-4 mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <EmployeeLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Performance Dashboard</h1>
                <p className="text-gray-600">Monitor your team's leads, conversions, and performance metrics</p>
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
                  Export Team Report
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="Team Leads"
              value={totalLeads.toLocaleString()}
              change={calculateChange(monthlyData, 'leads')}
              color="bg-blue-500"
            />
            <StatCard
              icon={UserCheck}
              title="Team Clients"
              value={totalClients.toLocaleString()}
              change={calculateChange(monthlyData, 'clients')}
              color="bg-green-500"
            />
            <StatCard
              icon={TrendingUp}
              title="Team Conversion Rate"
              value={`${conversionRate}%`}
              change={calculateChange(monthlyData, 'clients')}
              color="bg-purple-500"
            />
            <StatCard
              icon={DollarSign}
              title="Team Revenue"
              value={`$${(totalRevenue / 1000).toFixed(0)}K`}
              change={calculateChange(monthlyData, 'revenue')}
              color="bg-orange-500"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Team Leads vs Clients</h2>
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

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Team Lead Sources</h2>
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Team Revenue Trend</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>{calculateChange(monthlyData, 'revenue')}</span>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
              <AlertTriangle className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-bold mb-2">Unassigned Leads</h3>
              <p className="text-red-100 mb-4">{unassignedLeads} leads need immediate assignment</p>
              <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">
                Assign Leads
              </button>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
              <Target className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-bold mb-2">Hot Prospects</h3>
              <p className="text-amber-100 mb-4">{hotLeads} high-priority leads ready to convert</p>
              <button className="bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors">
                Review Prospects
              </button>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
              <Award className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-bold mb-2">Revenue per Client</h3>
              <p className="text-emerald-100 mb-4">${avgRevenuePerClient.toLocaleString()} average value per client</p>
              <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                Revenue Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default ManagerDashboard;