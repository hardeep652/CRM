'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search, Mail, Phone, MapPin, Users, TrendingUp, Award, Plus, MoreVertical,
  Calendar, Eye, Edit, Trash2, X, Briefcase, DollarSign, Activity, HardHat,
  Info, AlertCircle, Save, UserCheck,
} from 'lucide-react';
import EmployeeLayout from '../EmployeeLayout';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  username: string;
  role: string;
  position: string;
  department: string;
  manager: string | null; // Stores manager's name for display
  avatar?: string;
  status?: 'Active' | 'Inactive';
  performance?: number;
  salary?: string;
  projects?: number;
  phone?: string;
  location?: string;
  joinDate?: string;
}

const PerformanceBar: React.FC<{ score: number }> = ({ score }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-700 ease-out 
        ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
      style={{ width: `${score}%` }}
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    />
  </div>
);

const StatusBadge: React.FC<{ status: string | undefined }> = ({ status }) => {
  const styles: { [key: string]: string } = {
    Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Inactive: 'bg-gray-50 text-gray-700 border border-gray-200',
    DEFAULT: 'bg-gray-50 text-gray-700 border border-gray-200',
  };

  const displayStatus = status || 'Inactive';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[displayStatus] || styles.DEFAULT}`}>
      {displayStatus}
    </span>
  );
};

interface EmployeeDetailPanelProps {
  employee: Employee;
  onClose: () => void;
  onUpdate: (updatedEmployee: Employee) => void;
  panelMode: 'view' | 'edit';
  setPanelMode: (mode: 'view' | 'edit') => void;
  allEmployees: Employee[];
}

const EmployeeDetailPanel: React.FC<EmployeeDetailPanelProps> = ({
  employee,
  onClose,
  onUpdate,
  panelMode,
  setPanelMode,
  allEmployees,
}) => {
  const [formData, setFormData] = useState<Employee>({ ...employee, phone_number: String(employee.phone_number || '') });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const potentialManagers = useMemo(() => {
    return allEmployees.filter(emp => emp.id !== employee.id);
  }, [allEmployees, employee.id]);

  useEffect(() => {
    setFormData({ ...employee, phone_number: String(employee.phone_number || '') });
    setError(null);
    setPhoneError(null);
  }, [employee]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone_number') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length > 10) {
        setPhoneError('Phone number cannot exceed 10 digits');
      } else if (numericValue.length < 10 && numericValue.length > 0) {
        setPhoneError('Phone number must have at least 10 digits');
      } else {
        setPhoneError(null);
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate phone number
    const phoneNumber = formData.phone_number.replace(/[^0-9]/g, '');
    if (phoneNumber && (phoneNumber.length !== 10 || isNaN(Number(phoneNumber)))) {
      setError('Phone number must be a 10-digit number');
      setLoading(false);
      return;
    }

    try {
      // Find the manager's ID based on the selected manager's name
      const selectedManager = formData.manager
        ? allEmployees.find(emp => emp.name === formData.manager)
        : null;

      const payload = {
        name: formData.name || undefined,
        email: formData.email || undefined,
        phone_number: phoneNumber ? Number(phoneNumber) : undefined,
        address: formData.address || undefined,
        username: formData.username || undefined,
        role: formData.role || undefined,
        position: formData.position || undefined,
        department: formData.department || undefined,
        manager: selectedManager ? { id: selectedManager.id } : null, // Send manager as { id: number } or null
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/updateEmployee/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update employee: ${errorText || response.statusText}`);
      }

      const result = await response.text();
      // Ensure manager name is preserved in the updated employee
      onUpdate({ ...formData, id: employee.id, phone_number: phoneNumber || '', manager: formData.manager || null });
      alert(result);
      setPanelMode('view');
    } catch (err: any) {
      console.error('Error updating employee:', err);
      setError(err.message || 'Failed to update employee. Please ensure the selected manager exists in the database and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={panelRef}
      className={`fixed right-0 top-0 h-full w-full md:w-1/2 lg:w-1/3 bg-white shadow-2xl z-40 
                  transform transition-transform duration-300 ease-out p-6 md:p-8 overflow-y-auto
                  ${employee ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center border-b pb-4 mb-6 sticky top-0 bg-white z-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          {panelMode === 'view' ? 'Employee Details' : 'Edit Employee'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center space-x-3 border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {panelMode === 'view' ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <img
              src={employee.avatar || 'https://via.placeholder.com/150/4299e1/ffffff?text=E'}
              alt={employee.name || 'Employee Avatar'}
              className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white ring-2 ring-blue-200 mb-4"
            />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{employee.name || 'N/A'}</h3>
            <p className="text-blue-600 font-semibold mb-1">{employee.position || 'N/A'}</p>
            <p className="text-gray-600 text-sm">{employee.department || 'N/A'}</p>
            <div className="mt-3">
              <StatusBadge status={employee.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <h4 className="text-lg font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-4 flex items-center"><Info className="w-5 h-5 mr-2 text-blue-500" /> Contact Information</h4>
              <div className="space-y-3">
                <p className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="font-medium">{employee.email || 'N/A'}</span>
                </p>
                <p className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="font-medium">{employee.phone || (employee.phone_number ? `+${String(employee.phone_number).replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')}` : 'N/A')}</span>
                </p>
                <p className="flex items-start text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-gray-500 mt-1" />
                  <span className="font-medium leading-relaxed">{employee.address || 'N/A'}</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 border-b-2 border-purple-100 pb-2 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-purple-500" /> Professional Details</h4>
              <div className="space-y-3">
                <p className="flex items-center text-gray-700">
                  <UserCheck className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="font-medium">Username: {employee.username || 'N/A'}</span>
                </p>
                <p className="flex items-center text-gray-700">
                  <HardHat className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="font-medium">Role: {employee.role || 'N/A'}</span>
                </p>
                <p className="flex items-center text-gray-700">
                  <Users className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="font-medium">Manager: {employee.manager || 'N/A'}</span>
                </p>
                <p className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="font-medium">Joined: {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'N/A'}</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 border-b-2 border-orange-100 pb-2 mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-orange-500" /> Performance & Compensation</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">Performance</span>
                    <span className="text-md font-bold text-gray-900">{employee.performance || 0}%</span>
                  </div>
                  <PerformanceBar score={employee.performance || 0} />
                </div>
                <p className="flex justify-between items-center text-gray-700">
                  <span className="font-medium flex items-center"><DollarSign className="w-4 h-4 mr-3 text-gray-500" />Salary</span>
                  <span className="text-md font-bold text-gray-900">{employee.salary || 'N/A'}</span>
                </p>
                <p className="flex justify-between items-center text-gray-700">
                  <span className="font-medium flex items-center"><Briefcase className="w-4 h-4 mr-3 text-gray-500" />Projects Completed</span>
                  <span className="text-md font-bold text-gray-900">{employee.projects || 0}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
            <button
              onClick={() => setPanelMode('edit')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Employee</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-blue-100 pb-2 flex items-center"><Info className="w-5 h-5 mr-2 text-blue-500" /> Personal Details</h3>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                className={`w-full px-4 py-2.5 border ${phoneError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm`}
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-600">{phoneError}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-purple-100 pb-2 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-purple-500" /> Professional Details</h3>
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
              />
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
              <select
                id="manager"
                name="manager"
                value={formData.manager || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm bg-white appearance-none pr-10 cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">No Manager</option>
                {potentialManagers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.position})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setPanelMode('view')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!phoneError}
              className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ${loading || phoneError ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2`}
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const EmployeeCard: React.FC<{ employee: Employee; onSelect: (employee: Employee, mode: 'view' | 'edit') => void }> = ({ employee, onSelect }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group relative overflow-hidden cursor-pointer"
    onClick={() => onSelect(employee, 'view')}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    <div className="p-6 relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={employee.avatar || `https://via.placeholder.com/64/4299e1/ffffff?text=${(employee.name || 'U').charAt(0).toUpperCase()}`}
              alt={employee.name || 'Unknown'}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                employee.status === 'Active' ? 'bg-emerald-400' : 'bg-gray-400'
              }`}
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{employee.name || 'Unknown'}</h3>
            <p className="text-blue-700 font-medium text-sm">{employee.position || 'N/A'}</p>
            <p className="text-gray-500 text-xs">{employee.department || 'N/A'}</p>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(employee, 'edit'); }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            aria-label={`Edit ${employee.name}`}
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-blue-500" />
          {employee.email || 'N/A'}
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-2 text-blue-500" />
          {employee.phone || (employee.phone_number ? `+${String(employee.phone_number).replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')}` : 'N/A')}
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          {employee.location || employee.address || 'N/A'}
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
          Joined {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 mt-3">
        <span className="text-lg font-bold text-gray-900">{employee.salary || 'N/A'}</span>
        <StatusBadge status={employee.status} />
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Performance</span>
            <span className="text-xs font-semibold text-gray-900">{employee.performance || 0}%</span>
          </div>
          <PerformanceBar score={employee.performance || 0} />
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Projects: <span className="font-semibold text-gray-900">{employee.projects || 0}</span></span>
        </div>
      </div>
    </div>
  </div>
);

const EmployeeDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [panelMode, setPanelMode] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/allEmployees`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.statusText}`);
        }

        const data: any[] = await response.json();
        console.log('Raw API response:', JSON.stringify(data, null, 2));

        // Map employees first to get the full list for manager lookup
        const mappedData = data.map(emp => ({
          id: emp.id,
          name: emp.name || 'N/A',
          email: emp.email || 'N/A',
          phone_number: String(emp.phone_number || ''),
          address: emp.address || 'N/A',
          username: emp.username || 'N/A',
          role: emp.role || 'N/A',
          position: emp.position || 'N/A',
          department: emp.department || 'N/A',
          managerId: emp.manager?.id || null, // Store manager ID temporarily
          manager: emp.manager?.name || null, // Try to use manager.name if available
          avatar: emp.avatar || `https://via.placeholder.com/64/4299e1/ffffff?text=${(emp.name || 'U').charAt(0).toUpperCase()}`,
          status: emp.status || (emp.role === 'Inactive' ? 'Inactive' : 'Active'),
          performance: emp.performance ?? Math.floor(Math.random() * 40) + 60,
          salary: emp.salary || `$${(Math.floor(Math.random() * 50) + 50) * 1000} (USD)`,
          projects: emp.projects ?? Math.floor(Math.random() * 10) + 1,
          phone: emp.phone_number ? `+${String(emp.phone_number).replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')}` : 'N/A',
          location: emp.address,
          joinDate: emp.joinDate || new Date(new Date().setFullYear(new Date().getFullYear() - (Math.floor(Math.random() * 5) + 1))).toISOString().split('T')[0],
        }));

        console.log('Mapped data:', JSON.stringify(mappedData, null, 2));

        // Map manager names using managerId if manager.name is null
        const finalData = mappedData.map(emp => {
          let manager = emp.manager;
          if (!manager && emp.managerId) {
            manager = mappedData.find(m => m.id === emp.managerId)?.name || 'N/A';
          }
          return { ...emp, manager, managerId: undefined }; // Remove temporary managerId
        });

        console.log('Final data:', JSON.stringify(finalData, null, 2));

        setEmployees(finalData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees. Please check your connection or login status.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp))
    );
    setSelectedEmployee(updatedEmployee);
  };

  const departments = useMemo(() => {
    const deps = employees.map(emp => emp.department).filter(dep => dep && dep !== 'N/A');
    return [...new Set(deps)] as string[];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch =
        (employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (employee.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (employee.phone_number?.includes(searchTerm) || false) ||
        (employee.address?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, filterDepartment, employees]);

  const stats = useMemo(() => ({
    total: employees.length,
    managers: employees.filter(emp => emp.role?.toUpperCase() === 'MANAGER').length,
    departments: departments.length,
  }), [employees, departments]);

  const handleSelectEmployee = (employee: Employee, mode: 'view' | 'edit') => {
    setSelectedEmployee(employee);
    setPanelMode(mode);
  };

  const handleClosePanel = () => {
    setSelectedEmployee(null);
    setPanelMode('view');
  };

  return (
    <EmployeeLayout>
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pb-12 flex ${selectedEmployee ? 'pr-80 lg:pr-[33.333%]' : ''} transition-all duration-300 ease-out`}>
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="bg-white shadow-sm border-b border-gray-200 py-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Employee Management</h1>
                <p className="text-gray-600 mt-1 text-lg">Efficiently manage and monitor your team members</p>
              </div>
              <Link href="/admin/add-employee">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 transform hover:-translate-y-0.5">
                  <Plus className="w-5 h-5" />
                  <span>Add New Employee</span>
                </button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-700 mt-2 text-lg font-medium">Loading employee data, please wait...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-red-50 rounded-xl shadow-lg border-2 border-red-200 flex flex-col items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Error Loading Data</h3>
              <p className="text-red-700 text-base max-w-md">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition-colors transform hover:scale-105"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex items-center justify-between hover:shadow-lg transition-shadow">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Employees</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex items-center justify-between hover:shadow-lg transition-shadow">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Managers</p>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.managers}</p>
                  </div>
                  <div className="bg-indigo-100 p-4 rounded-full">
                    <TrendingUp className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex items-center justify-between hover:shadow-lg transition-shadow">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Departments</p>
                    <p className="text-4xl font-bold text-purple-600 mt-2">{stats.departments}</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-full">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 animate-fade-in-up delay-100">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search by name, email, username, position, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm placeholder-gray-500"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full lg:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm bg-white appearance-none pr-10 cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="">All Departments</option>
                    {departments.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
                {filteredEmployees.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 text-lg font-medium">No employees found matching your criteria.</p>
                    <p className="text-gray-500 mt-2">Try adjusting your search or department filter.</p>
                  </div>
                ) : (
                  filteredEmployees.map(employee => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      onSelect={handleSelectEmployee}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {selectedEmployee && (
          <EmployeeDetailPanel
            employee={selectedEmployee}
            onClose={handleClosePanel}
            onUpdate={handleUpdateEmployee}
            panelMode={panelMode}
            setPanelMode={setPanelMode}
            allEmployees={employees}
          />
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;