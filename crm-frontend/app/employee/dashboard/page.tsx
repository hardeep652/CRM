'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, TrendingUp, Phone, UserPlus, CheckSquare } from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedToName: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  assignedTo: string | null;
  relatedLeadName: string | null;
  relatedCompany: string | null;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
  assignedToName: string;
}

interface MonthlyData {
  month: string;
  myLeads: number;
  converted: number;
  calls: number;
}

interface TaskStatus {
  name: string;
  value: number;
  color: string;
}

const EmployeeDashboard = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employeeData, setEmployeeData] = useState<MonthlyData[]>([]);
  const [taskData, setTaskData] = useState<TaskStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current time: 3:33 PM IST, June 27, 2025
  const now = new Date('2025-06-27T15:33:00+05:30');

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const leadsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/myLeads`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!leadsResponse.ok) {
        if (leadsResponse.status === 401) throw new Error('Please log in to access the dashboard');
        if (leadsResponse.status === 403) throw new Error('Access denied: Employee role required');
        throw new Error(`Failed to fetch leads: ${leadsResponse.status} ${leadsResponse.statusText}`);
      }
      const leadsData: Lead[] = await leadsResponse.json();
      setLeads(leadsData);

      const tasksResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/myTasks`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!tasksResponse.ok) {
        if (tasksResponse.status === 401) throw new Error('Please log in to access the dashboard');
        if (tasksResponse.status === 403) throw new Error('Access denied: Employee role required');
        throw new Error(`Failed to fetch tasks: ${tasksResponse.status} ${tasksResponse.statusText}`);
      }
      const tasksData: Task[] = await tasksResponse.json();
      setTasks(tasksData);

      const clientsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clients/myClients`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!clientsResponse.ok) {
        if (clientsResponse.status === 401) throw new Error('Please log in to access the dashboard');
        if (clientsResponse.status === 403) throw new Error('Access denied: Employee role required');
        throw new Error(`Failed to fetch clients: ${clientsResponse.status} ${clientsResponse.statusText}`);
      }
      const clientsData: Client[] = await clientsResponse.json();
      setClients(clientsData);

      const currentYear = now.getFullYear();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData: MonthlyData[] = months.map((month, index) => {
        const monthLeads = leadsData.filter(lead => {
          const leadDate = new Date(lead.createdAt);
          return leadDate.getMonth() === index && leadDate.getFullYear() === currentYear;
        }).length;
        const monthConversions = clientsData.filter(client => {
          const clientDate = new Date(client.createdAt);
          return clientDate.getMonth() === index && clientDate.getFullYear() === currentYear;
        }).length;
        const monthCalls = tasksData.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate.getMonth() === index && taskDate.getFullYear() === currentYear && task.description?.toLowerCase().includes('call');
        }).length;
        return { month, myLeads: monthLeads, converted: monthConversions, calls: monthCalls };
      }).filter(data => data.myLeads > 0 || data.converted > 0 || data.calls > 0);
      setEmployeeData(monthlyData);

      const statusCounts = tasksData.reduce((acc, task) => {
        const status = task.status || 'Pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const totalTasks = tasksData.length;
      const taskStatusData: TaskStatus[] = Object.entries(statusCounts).map(([name, count], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
        color: ['#10B981', '#F59E0B', '#EF4444'][index % 3],
      }));
      setTaskData(taskStatusData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const myLeads = leads.length;
  const myConversions = clients.length;
  const myConversionRate = myLeads > 0 ? ((myConversions / myLeads) * 100).toFixed(1) : '0.0';
  const totalCalls = tasks.filter(task => task.description?.toLowerCase().includes('call')).length;

  const StatCard = ({ icon: Icon, title, value, change, color }: { icon: React.ElementType; title: string; value: string | number; change: string; color: string }) => (
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
    return <div className="max-w-7xl mx-auto p-6 flex items-center justify-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center text-red-600">
        <div className="text-center">
          <p>{error}</p>
          {error.includes('log in') && (
            <button
              onClick={() => (window.location.href = '/employee/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          )}
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="My Leads"
          value={myLeads.toString()}
          change={employeeData.length > 1 ? `+${((employeeData[employeeData.length - 1].myLeads - employeeData[employeeData.length - 2].myLeads) / (employeeData[employeeData.length - 2].myLeads || 1) * 100).toFixed(1)}%` : '0.0%'}
          color="bg-blue-500"
        />
        <StatCard
          icon={UserCheck}
          title="Conversions"
          value={myConversions.toString()}
          change={employeeData.length > 1 ? `+${((employeeData[employeeData.length - 1].converted - employeeData[employeeData.length - 2].converted) / (employeeData[employeeData.length - 2].converted || 1) * 100).toFixed(1)}%` : '0.0%'}
          color="bg-green-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Conversion Rate"
          value={`${myConversionRate}%`}
          change={employeeData.length > 1 ? `+${((myConversions / (myLeads || 1) - (employeeData[employeeData.length - 2].converted / (employeeData[employeeData.length - 2].myLeads || 1))) * 100).toFixed(1)}%` : '0.0%'}
          color="bg-purple-500"
        />
        <StatCard
          icon={Phone}
          title="Total Calls"
          value={totalCalls.toString()}
          change={employeeData.length > 1 ? `+${((employeeData[employeeData.length - 1].calls - employeeData[employeeData.length - 2].calls) / (employeeData[employeeData.length - 2].calls || 1) * 100).toFixed(1)}%` : '0.0%'}
          color="bg-orange-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Performance</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Leads</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Converted</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="myLeads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="converted" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Task Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={taskData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {taskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {taskData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Call Activity</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-green-500" />
            <span>{employeeData.length > 1 ? `+${((employeeData[employeeData.length - 1].calls - employeeData[employeeData.length - 2].calls) / (employeeData[employeeData.length - 2].calls || 1) * 100).toFixed(1)}%` : '0.0%'} vs last period</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={employeeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="calls"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#F59E0B', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <UserPlus className="w-8 h-8 mb-4 opacity-80" />
          <h3 className="text-lg font-bold mb-2">New Lead</h3>
          <p className="text-blue-100 mb-4">Add a new lead to your pipeline</p>
          <Link href="/employee/leads">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Add Lead
            </button>
          </Link>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <Phone className="w-8 h-8 mb-4 opacity-80" />
          <h3 className="text-lg font-bold mb-2">Follow-up Calls</h3>
          <p className="text-green-100 mb-4">{tasks.filter(t => t.description?.toLowerCase().includes('call') && t.status === 'pending' && new Date(t.dueDate).toDateString() === now.toDateString()).length} leads need follow-up today</p>
          <Link href="/employee/tasks">
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
              View Calls
            </button>
          </Link>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <CheckSquare className="w-8 h-8 mb-4 opacity-80" />
          <h3 className="text-lg font-bold mb-2">Pending Tasks</h3>
          <p className="text-purple-100 mb-4">{tasks.filter(t => t.status === 'pending' && new Date(t.dueDate).toDateString() === now.toDateString()).length} tasks due today</p>
          <Link href="/employee/tasks">
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              View Tasks
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;