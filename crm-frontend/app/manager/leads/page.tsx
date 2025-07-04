
    'use client';

    import React, { useState, useEffect, useRef } from 'react'; // Added useRef for dropdown

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

    const ManagerLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingLead, setViewingLead] = useState<Lead | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [actionLead, setActionLead] = useState<Lead | null>(null);
    const [actionType, setActionType] = useState<'accept' | 'deny' | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string>('');
    // New states for search and filter
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false); // New state for custom dropdown visibility
    const statusDropdownRef = useRef<HTMLDivElement>(null); // Ref for detecting clicks outside dropdown

    const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'CONVERTED', 'APPROVAL_PENDING', 'APPROVED', 'REJECTED'];

    const getStatusColor = (status: string) => {
        switch (status) {
        case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'CONTACTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'QUALIFIED': return 'bg-green-100 text-green-800 border-green-200';
        case 'LOST': return 'bg-red-100 text-red-800 border-red-200';
        case 'CONVERTED': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'APPROVAL_PENDING': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'APPROVED': return 'bg-teal-100 text-teal-800 border-teal-200';
        case 'REJECTED': return 'bg-gray-400 text-gray-900 border-gray-500';
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
        case 'APPROVAL_PENDING': return '⏳';
        case 'APPROVED': return '👍';
        case 'REJECTED': return '👎';
        default: return '⚪';
        }
    };

    const getCurrentStatusIndex = (status: string) => {
        return statuses.indexOf(status);
    };

    const [isScrolled, setIsScrolled] = useState(false);
    const [username, setUsername] = useState('Manager');

    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
        };

        const storedUsername = typeof window !== 'undefined' ? localStorage?.getItem('managerUsername') : null;
        if (storedUsername) setUsername(storedUsername);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effect to close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
            setShowStatusDropdown(false);
        }
        };

        if (showStatusDropdown) {
        document.addEventListener('mousedown', handleClickOutside);
        } else {
        document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showStatusDropdown]);


    const handleLogout = async () => {
        try {
        await fetch('http://localhost:8080/logout', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        localStorage.removeItem('managerUsername');
        window.location.href = '/login';
        } catch (err) {
        console.error('Logout error:', err);
        localStorage.removeItem('managerUsername');
        window.location.href = '/login';
        }
    };

    const navigationItems = [
        {
        name: 'Dashboard',
        href: '/manager/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
        ),
        },
        {
        name: 'Leads',
        href: '/manager/leads',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        },
        {
        name: 'Clients',
        href: '/manager/clients',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        },
    ];

    const fetchLeads = async () => {
        setIsLoading(true);
        setError(null);
        try {
        const response = await fetch('http://localhost:8080/api/manager/leads', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            if (response.status === 401) throw new Error('Please log in to access leads');
            if (response.status === 403) throw new Error('Access denied: Manager role required');
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

    const handleLeadApproval = async () => {
        if (!actionLead || !actionType) return;

        setIsLoading(true);
        setError(null);
        try {
        const body: { leadId: string; action: 'approve' | 'reject'; rejectionReason?: string } = {
            leadId: actionLead.id,
            action: actionType === 'accept' ? 'approve' : 'reject'
        };

        if (actionType === 'deny') {
            body.rejectionReason = rejectionReason;
        }

        const response = await fetch('http://localhost:8080/api/manager/approve-or-reject', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to ${actionType} lead: ${response.status}`);
        }

        setShowConfirmationModal(false);
        setActionLead(null);
        setActionType(null);
        setRejectionReason('');
        await fetchLeads();
        } catch (err: any) {
        setError(err.message || `Failed to ${actionType} lead`);
        } finally {
        setIsLoading(false);
        }
    };

    // Handler for custom status dropdown checkbox change
    const handleStatusChange = (status: string) => {
        setSelectedStatuses(prev =>
        prev.includes(status)
            ? prev.filter(s => s !== status)
            : [...prev, status]
        );
    };


    // Filter leads based on search query and selected statuses
    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(lead.status);
        return matchesSearch && matchesStatus;
    });

    const approvalPendingLeads = filteredLeads.filter(lead => lead.status === 'APPROVAL_PENDING');

    useEffect(() => {
        fetchLeads();
    }, []);

    return (
        <html lang="en">
        <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50' : 'bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200/30'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                <div className="flex items-center space-x-4 sm:space-x-8">
                    <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">CRM Pro</h1>
                        <p className="text-xs text-gray-500 font-medium hidden sm:block">Customer Management</p>
                    </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-gray-50/80 rounded-2xl p-2 backdrop-blur-sm">
                    {navigationItems.map((item) => {
                        const isActive = false;
                        return (
                        <a key={item.name} href={item.href}>
                            <button className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden group ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-md'}`}>
                            <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                            <span className="font-semibold">{item.name}</span>
                            {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 transform scale-x-100 transition-transform duration-300"></div>}
                            </button>
                        </a>
                        );
                    })}
                    </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="hidden sm:flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl px-3 sm:px-4 py-2 border border-gray-200/50">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs sm:text-sm font-bold text-white">{username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">Welcome back</p>
                        <p className="text-xs text-gray-600">{username}</p>
                    </div>
                    </div>
                    <button onClick={handleLogout} className="group flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 border border-red-200/50 hover:border-red-300 hover:shadow-md">
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium text-xs sm:text-sm hidden sm:block">Logout</span>
                    </button>
                </div>
                </div>
            </div>
            </nav>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50">
            <div className="flex justify-around items-center py-2">
                {navigationItems.map((item) => {
                const isActive = false;
                return (
                    <a key={item.name} href={item.href}>
                    <button className={`flex flex-col items-center space-y-1 px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}>
                        <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                        <span className="text-xs font-medium">{item.name}</span>
                    </button>
                    </a>
                );
                })}
            </div>
            </div>
            <main className="pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
                <div className="max-w-7xl mx-auto p-6 flex items-center justify-center text-gray-700">Loading...</div>
            ) : error ? (
                <div className="max-w-7xl mx-auto p-6 flex items-center justify-center text-red-600">
                <div className="text-center">
                    <p>{error}</p>
                    <button
                    onClick={fetchLeads}
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                    Retry
                    </button>
                </div>
                </div>
            ) : (
                <>
                {/* Refactored Search and Filter UI */}
                <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-2.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search leads by name, email, company..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md text-base"
                    />
                    </div>

                    {/* Custom Status Filter Dropdown */}
                    <div className="relative w-full sm:w-64" ref={statusDropdownRef}>
                    <button
                        type="button"
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="relative w-full flex justify-between items-center px-4 py-3 text-left bg-gray-50 border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-gray-900"
                    >
                        <span className="block truncate">
                        {selectedStatuses.length === 0 ? 'Filter by Status' : `Statuses (${selectedStatuses.length})`}
                        </span>
                        <svg className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Selected Status Tags */}
                    {selectedStatuses.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                        {selectedStatuses.map(status => (
                            <span
                            key={status}
                            className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} shadow-sm`}
                            >
                            {getStatusIcon(status)} {status}
                            <button
                                type="button"
                                onClick={(e) => {
                                e.stopPropagation(); // Prevent dropdown from closing
                                handleStatusChange(status);
                                }}
                                className="ml-2 text-current hover:text-gray-900" // Adjust color based on status color for contrast
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            </span>
                        ))}
                        <button
                            type="button"
                            onClick={() => setSelectedStatuses([])}
                            className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shadow-sm"
                        >
                            Clear All
                        </button>
                        </div>
                    )}

                    {/* Dropdown Menu */}
                    {showStatusDropdown && (
                        <div className="absolute right-0 mt-2 w-full sm:w-64 bg-white border border-gray-200 rounded-xl shadow-lg animate-fade-in-down z-10 origin-top-right">
                        <div className="py-2">
                            {statuses.map(status => (
                            <label
                                key={status}
                                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <input
                                type="checkbox"
                                value={status}
                                checked={selectedStatuses.includes(status)}
                                onChange={() => handleStatusChange(status)}
                                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-800 flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status).split(' ')[0]} ${getStatusColor(status).split(' ')[1]}`}></span> {/* Visual color dot */}
                                {status}
                                </span>
                            </label>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                </div>

                {/* Approval Pending Leads Section */}
                {approvalPendingLeads.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-orange-600 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Leads Awaiting Approval
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 text-left">
                            <th className="pb-3 text-sm font-semibold text-gray-700">Name</th>
                            <th className="pb-3 text-sm font-semibold text-gray-700">Email</th>
                            <th className="pb-3 text-sm font-semibold text-gray-700">Company</th>
                            <th className="pb-3 text-sm font-semibold text-gray-700">Assigned To</th>
                            <th className="pb-3 text-sm font-semibold text-gray-700">Created At</th>
                            <th className="pb-3 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {approvalPendingLeads.map((lead) => (
                            <tr key={lead.id} className="border-b border-gray-100 hover:bg-orange-50">
                                <td className="py-4 font-medium text-gray-900">{lead.name}</td>
                                <td className="py-4 text-gray-600">{lead.email}</td>
                                <td className="py-4 text-gray-600">{lead.company}</td>
                                <td className="py-4 text-gray-600">{lead.assignedToName}</td>
                                <td className="py-4 text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                <td className="py-4 flex space-x-3">
                                <button
                                    onClick={() => {
                                    setActionLead(lead);
                                    setActionType('accept');
                                    setShowConfirmationModal(true);
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Approve
                                </button>
                                <button
                                    onClick={() => {
                                    setActionLead(lead);
                                    setActionType('deny');
                                    setShowConfirmationModal(true);
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Reject
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                )}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">All Leads</h2>
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
                            <th className="pb-3 text-sm font-semibold text-gray-700">Assigned To</th>
                            <th className="pb-3 text-sm font-semibold text-gray-700">Last Updated</th>
                            <th className="pb-3 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 font-medium text-gray-900">{lead.name}</td>
                            <td className="py-4 text-gray-600">{lead.email}</td>
                            <td className="py-4 text-gray-600">{lead.phone}</td>
                            <td className="py-4 text-gray-600">{lead.company}</td>
                            <td className="py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                {getStatusIcon(lead.status)} {lead.status}
                                </span>
                            </td>
                            <td className="py-4 text-gray-600">{lead.assignedToName}</td>
                            <td className="py-4 text-gray-600">{new Date(lead.updatedAt).toLocaleDateString()}</td>
                            <td className="py-4 flex space-x-2">
                                <button
                                onClick={() => {
                                    setViewingLead(lead);
                                    setShowViewModal(true);
                                }}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs font-medium"
                                >
                                View
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                </>
            )}
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
                            width: viewingLead.status === 'LOST' || viewingLead.status === 'REJECTED' ? '0%' : `${(getCurrentStatusIndex(viewingLead.status) / (statuses.length - 1)) * 100}%`
                        }}
                        ></div>
                        <div className="flex justify-between relative z-10">
                        {statuses.filter(s => s !== 'APPROVAL_PENDING' && s !== 'APPROVED' && s !== 'REJECTED').map((status, index) => {
                            const isActive = status === viewingLead.status;
                            const isPassed = index < getCurrentStatusIndex(viewingLead.status);
                            const isLostOrRejected = viewingLead.status === 'LOST' || viewingLead.status === 'REJECTED';

                            return (
                            <div key={status} className="flex flex-col items-center">
                                <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-4 transition-all duration-500 ${
                                    isActive
                                    ? isLostOrRejected
                                        ? 'bg-red-500 text-white border-red-300 shadow-lg shadow-red-200'
                                        : 'bg-blue-500 text-white border-blue-300 shadow-lg shadow-blue-200'
                                    : isPassed && !isLostOrRejected
                                    ? 'bg-green-500 text-white border-green-300'
                                    : 'bg-white text-gray-400 border-gray-300'
                                }`}
                                >
                                {getStatusIcon(status)}
                                </div>
                                <div className={`mt-3 px-2 py-1 rounded-md text-xs font-semibold text-center min-w-[80px] ${
                                isActive
                                    ? isLostOrRejected
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                    : isPassed && !isLostOrRejected
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                {status}
                                </div>
                                {isActive && (
                                <div className="mt-1 text-xs text-gray-500 font-medium">
                                    Current
                                </div>
                                )}
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {getCurrentStatusIndex(viewingLead.status) + 1}
                        </div>
                        <div className="text-xs text-gray-500">Current Stage</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {viewingLead.status === 'LOST' || viewingLead.status === 'REJECTED' ? '0' : Math.round((getCurrentStatusIndex(viewingLead.status) / (statuses.length - 1)) * 100)}%
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
            {showConfirmationModal && actionLead && actionType && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Action</h3>
                    <p className="text-gray-700 mb-6">
                    Are you sure you want to {actionType === 'accept' ? 'approve' : 'reject'} the lead "{actionLead.name}"?
                    </p>
                    {actionType === 'deny' && (
                    <div className="mb-4">
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Rejection (Optional)
                        </label>
                        <textarea
                        id="rejectionReason"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g., Not a good fit, Duplicate lead, etc."
                        ></textarea>
                    </div>
                    )}
                    <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => {
                        setShowConfirmationModal(false);
                        setActionLead(null);
                        setActionType(null);
                        setRejectionReason('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLeadApproval}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                        actionType === 'accept'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        } disabled:opacity-50`}
                    >
                        {isLoading ? 'Processing...' : `Yes, ${actionType === 'accept' ? 'Approve' : 'Reject'}`}
                    </button>
                    </div>
                </div>
                </div>
            )}
            </main>
        </body>
        </html>
    );
    };

    export default ManagerLeads;

