'use client';

import React, { useState, useEffect } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
  assignedToName: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/clients/myClients', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Please log in to access clients');
        if (response.status === 403) throw new Error('Access denied: Employee role required');
        throw new Error(`Failed to fetch clients: ${response.status} ${response.statusText}`);
      }
      const data: Client[] = await response.json();
      setClients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients');
      console.error('Clients error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

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
            onClick={fetchClients}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Clients</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
              <p className="text-gray-600 text-sm">Email: {client.email}</p>
              <p className="text-gray-600 text-sm">Phone: {client.phone}</p>
              <p className="text-gray-600 text-sm">Company: {client.company}</p>
              <p className="text-gray-600 text-sm">Assigned To: {client.assignedToName}</p>
              <p className="text-gray-500 text-xs mt-2">Joined: {new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clients;