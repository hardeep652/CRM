'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock, Shield, Briefcase, Building, Users as UsersIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import EmployeeLayout from '../EmployeeLayout';

interface Employee {
  name: string;
  email: string;
  phone_number: string;
  address: string;
  username: string;
  password: string;
  role: string;
  position: string;
  department: string;
  manager?: {
    id: number;
    name: string;
  } | null;
}

interface Manager {
  id: number;
  name: string;
  position: string;
  department: string;
}

const AddEmployee: React.FC = () => {
  const [formData, setFormData] = useState<Employee>({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    username: '',
    password: '',
    role: '',
    position: '',
    department: '',
    manager: null,
  });

  const [managers, setManagers] = useState<Manager[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [managerLoading, setManagerLoading] = useState(true);
  const [managerError, setManagerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagers = async () => {
      setManagerLoading(true);
      setManagerError(null);
      try {
        const response = await fetch('http://localhost:8080/api/admin/allEmployees', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error('Please log in to access managers');
          if (response.status === 403) throw new Error('Access denied: Admin role required');
          throw new Error(`Failed to fetch managers: ${response.status} ${response.statusText}`);
        }

        const data: any[] = await response.json();
        const filteredManagers = data
          .filter((emp) => emp.role?.toUpperCase() === 'MANAGER')
          .map((emp) => ({
            id: emp.id,
            name: emp.name || 'Unknown',
            position: emp.position || 'N/A',
            department: emp.department || 'N/A',
          }));

        setManagers(filteredManagers);
      } catch (err: any) {
        console.error('Error fetching managers:', err);
        setManagerError(err.message || 'Failed to load managers. Please try again.');
      } finally {
        setManagerLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email must be valid';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else {
      const phoneNum = formData.phone_number.replace(/[^0-9]/g, '');
      if (phoneNum.length !== 10) {
        newErrors.phone_number = 'Phone number must be exactly 10 digits';
      }
    }

    if (formData.address && formData.address.length > 200) {
      newErrors.address = 'Address cannot exceed 200 characters';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3 || formData.username.length > 50) {
      newErrors.username = 'Username must be between 3 and 50 characters';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (formData.position && formData.position.length > 50) {
      newErrors.position = 'Position cannot exceed 50 characters';
    }

    if (formData.department && formData.department.length > 50) {
      newErrors.department = 'Department cannot exceed 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const managerId = parseInt(e.target.value);
    const selectedManager = managers.find((m) => m.id === managerId);
    setFormData((prev) => ({
      ...prev,
      manager: selectedManager ? { id: selectedManager.id, name: selectedManager.name } : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors above' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const apiData = {
        ...formData,
        phone_number: formData.phone_number.replace(/[^0-9]/g, ''),
        manager_id: formData.manager?.id || null,
      };

      const response = await fetch('http://localhost:8080/api/admin/addEmployee', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        const result = await response.text();
        setMessage({ type: 'success', text: result || 'Employee added successfully' });
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          address: '',
          username: '',
          password: '',
          role: '',
          position: '',
          department: '',
          manager: null,
        });
        setErrors({});
      } else {
        const errorText = await response.text();
        setMessage({ type: 'error', text: errorText || 'Failed to add employee' });
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      address: '',
      username: '',
      password: '',
      role: '',
      position: '',
      department: '',
      manager: null,
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  return (
    <EmployeeLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
                <p className="text-gray-600">Fill in the details to add a new employee to the system</p>
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border-green-400' 
                : 'bg-red-50 text-red-800 border-red-400'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
              )}
              <div>
                <p className="font-medium">{message.type === 'success' ? 'Success!' : 'Error'}</p>
                <p className="text-sm opacity-90">{message.text}</p>
              </div>
            </div>
          )}

          {managerError && (
            <div className="mb-6 p-4 rounded-lg border-l-4 bg-red-50 text-red-800 border-red-400 flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm opacity-90">{managerError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <User className="w-4 h-4 text-gray-400 mr-3" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`flex-1 bg-transparent outline-none ${errors.name ? 'text-red-600' : 'text-gray-900'}`}
                      placeholder="Enter full name"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                        className={`flex-1 bg-transparent outline-none ${errors.email ? 'text-red-600' : 'text-gray-900'}`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`flex-1 bg-transparent outline-none ${errors.phone_number ? 'text-red-600' : 'text-gray-900'}`}
                      placeholder="10-digit phone number"
                    />
                  </div>
                  {errors.phone_number && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.phone_number}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`flex-1 bg-transparent outline-none resize-none ${errors.address ? 'text-red-600' : 'text-gray-900'}`}
                      placeholder="Enter full address"
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.address}</p>}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Account & Work Information</h3>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <User className="w-4 h-4 text-gray-400 mr-3" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`flex-1 bg-transparent outline-none ${errors.username ? 'text-red-600' : 'text-gray-900'}`}
                      placeholder="Enter username"
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.username}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <Lock className="w-4 h-4 text-gray-400 mr-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`flex-1 bg-transparent outline-none ${errors.password ? 'text-red-600' : 'text-gray-900'}`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <Shield className="w-4 h-4 text-gray-400 mr-3" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`flex-1 bg-transparent outline-none ${errors.role ? 'text-red-600' : 'text-gray-900'}`}
                    >
                      <option value="">Select Role</option>
                      <option value="MANAGER">Manager</option>
                      <option value="EMPLOYEE">Employee</option>
                    </select>
                  </div>
                  {errors.role && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.role}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <Briefcase className="w-4 h-4 text-gray-400 mr-3" />
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`flex-1 bg-transparent outline-none ${errors.position ? 'text-red-600' : 'text-gray-900'}`}
                      placeholder="e.g., Senior Developer"
                    />
                  </div>
                  {errors.position && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.position}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <Building className="w-4 h-4 text-gray-400 mr-3" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`flex-1 bg-transparent outline-none ${errors.department ? 'text-red-600' : 'text-gray-900'}`}
                    >
                      <option value="">Select Department</option>
                      <option value="IT">Information Technology</option>
                      <option value="HR">Human Resources</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  {errors.department && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.department}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Manager</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <UsersIcon className="w-4 h-4 text-gray-400 mr-3" />
                    {managerLoading ? (
                      <div className="flex items-center text-gray-500">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading managers...
                      </div>
                    ) : (
                      <select
                        value={formData.manager?.id || ''}
                        onChange={handleManagerChange}
                        className="flex-1 bg-transparent outline-none text-gray-900"
                        disabled={managerError !== null || managers.length === 0}
                      >
                        <option value="">No Manager</option>
                        {managers.map((manager) => (
                          <option key={manager.id} value={manager.id}>
                            {manager.name} - {manager.position} ({manager.department})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={loading || managerLoading || !!managerError}
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                >
                  {loading ? (
                    <>
0                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Employee...
                    </>
                  ) : (
                    <>
                      <UsersIcon className="w-4 h-4 mr-2" />
                      Add Employee
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default AddEmployee;
