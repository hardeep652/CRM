'use client';

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import EmployeeLayout from '../EmployeeLayout'; // Assuming this is the correct import path for admin layout

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedTo: string | null;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/admin/allClients', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Please log in to access clients');
        if (response.status === 403) throw new Error('Access denied: Admin role required');
        throw new Error('Failed to fetch clients');
      }
      const data: Client[] = await response.json();
      setClients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients');
      toast.error(err.message || 'Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  return (
    <EmployeeLayout>
      <div className="max-w-7xl mx-auto p-6">
        <Toaster position="top-right" />
        {isLoading ? (
          <div className="flex items-center justify-center text-gray-700 min-h-screen">
            Loading clients...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center text-red-600 min-h-screen">
            <div className="text-center">
              <p>{error}</p>
              {error.includes('log in') && (
                <button
                  onClick={() => (window.location.href = '/admin/login')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Login
                </button>
              )}
              <button
                onClick={fetchClients}
                className="mt-4 ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Clients</h2>
            {clients.length === 0 ? (
              <p className="text-gray-600">No clients found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => handleClientClick(client)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-gray-600 text-sm">Email: {client.email}</p>
                    <p className="text-gray-600 text-sm">Phone: {client.phone}</p>
                    <p className="text-gray-600 text-sm">Assigned To: {client.assignedTo || 'Unassigned'}</p>
                    <div className="mt-3 text-blue-600 text-sm font-medium">
                      View details
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isModalOpen && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-lg text-gray-900">{selectedClient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Client ID</label>
                  <p className="text-gray-900">{selectedClient.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">
                    <a href={`mailto:${selectedClient.email}`} className="text-blue-600 hover:underline">
                      {selectedClient.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">
                    <a href={`tel:${selectedClient.phone}`} className="text-blue-600 hover:underline">
                      {selectedClient.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned To</label>
                  <p className="text-gray-900">{selectedClient.assignedTo || 'Unassigned'}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default AdminClients;