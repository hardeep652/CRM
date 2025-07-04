'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import EmployeeLayout from '../EmployeeLayout';

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

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'CONVERTED'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'QUALIFIED': return 'bg-green-100 text-green-800 border-green-200';
      case 'LOST': return 'bg-red-100 text-red-800 border-red-200';
      case 'CONVERTED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW': return '🆕';
      case 'CONTACTED': return '📞';
      case 'QUALIFIED': return '✅';
      case 'LOST': return '❌';
      case 'CONVERTED': return '🎉';
      default: return '⚪';
    }
  };

  const getCurrentStatusIndex = (status: string) => {
    return statuses.indexOf(status);
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/allLeads`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Please log in to access leads');
        if (response.status === 403) throw new Error('Access denied: Admin role required');
        throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`);
      }
      const data: Lead[] = await response.json();
      setLeads(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load leads');
      console.error('Leads error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        (lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesStatus = !filterStatus || lead.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, leads]);

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
            onClick={fetchLeads}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <EmployeeLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Leads</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, email, phone, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm placeholder-gray-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full lg:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm bg-white appearance-none pr-10 cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 text-sm font-semibold text-gray-700">Name</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Email</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Phone</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Company</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Status</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">New Lead</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Last Updated</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-700">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-gray-700 text-lg font-medium">No leads found matching your criteria.</p>
                        <p className="text-gray-500 mt-2">Try adjusting your search or status filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-900">{lead.name}</td>
                      <td className="py-4 text-gray-600">{lead.email}</td>
                      <td className="py-4 text-gray-600">{lead.phone}</td>
                      <td className="py-4 text-gray-600">{lead.company || 'Not specified'}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {getStatusIcon(lead.status)} {lead.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-green-600 font-medium">
                          {new Date(lead.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600">{new Date(lead.updatedAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <button
                          onClick={() => {
                            setViewingLead(lead);
                            setShowViewModal(true);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showViewModal && viewingLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingLead.status)}`}>
                    {getStatusIcon(viewingLead.status)} {viewingLead.status}
                  </span>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Pipeline Progress
                </h3>

                <div className="relative">
                  <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 rounded-full"></div>
                  <div
                    className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                    style={{
                      width: viewingLead.status === 'LOST' ? '0%' : `${(getCurrentStatusIndex(viewingLead.status) / (statuses.length - 1)) * 100}%`,
                    }}
                  ></div>

                  <div className="flex justify-between relative z-10">
                    {statuses.map((status, index) => {
                      const isActive = status === viewingLead.status;
                      const isPassed = index < getCurrentStatusIndex(viewingLead.status);
                      const isLost = viewingLead.status === 'LOST';

                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-4 transition-all duration-500 ${
                              isActive
                                ? status === 'LOST'
                                  ? 'bg-red-500 text-white border-red-300 shadow-lg shadow-red-200'
                                  : 'bg-blue-500 text-white border-blue-300 shadow-lg shadow-blue-200'
                                : isPassed && !isLost
                                ? 'bg-green-500 text-white border-green-300'
                                : 'bg-white text-gray-400 border-gray-300'
                            }`}
                          >
                            {getStatusIcon(status)}
                          </div>
                          <div
                            className={`mt-3 px-2 py-1 rounded-md text-xs font-semibold text-center min-w-[80px] ${
                              isActive
                                ? status === 'LOST'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                                : isPassed && !isLost
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {status}
                          </div>
                          {isActive && (
                            <div className="mt-1 text-xs text-gray-500 font-medium">Current</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{getCurrentStatusIndex(viewingLead.status) + 1}</div>
                    <div className="text-xs text-gray-500">Current Stage</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {viewingLead.status === 'LOST' ? '0' : Math.round((getCurrentStatusIndex(viewingLead.status) / (statuses.length - 1)) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Progress</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.ceil((new Date().getTime() - new Date(viewingLead.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs text-gray-500">Days Active</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                        <p className="text-gray-900 font-semibold">{viewingLead.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                        <p className="text-gray-900 font-semibold">{viewingLead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                        <p className="text-gray-900 font-semibold">{viewingLead.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Company</label>
                        <p className="text-gray-900 font-semibold">{viewingLead.company || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Lead Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <div>
                        <label className="block text-xs font-medium text-green-600 uppercase tracking-wide">Created</label>
                        <p className="text-gray-900 font-semibold">{new Date(viewingLead.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(viewingLead.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <div>
                        <label className="block text-xs font-medium text-blue-600 uppercase tracking-wide">Last Updated</label>
                        <p className="text-gray-900 font-semibold">{new Date(viewingLead.updatedAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(viewingLead.updatedAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <label className="block text-xs font-medium text-purple-600 uppercase tracking-wide">Assigned To</label>
                        <p className="text-gray-900 font-semibold">{viewingLead.assignedToName}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                      <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Lead ID</label>
                        <p className="text-gray-900 font-semibold font-mono text-sm">{viewingLead.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <div className="text-sm text-gray-500">
                  Lead has been active for {Math.ceil((new Date().getTime() - new Date(viewingLead.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default Leads;