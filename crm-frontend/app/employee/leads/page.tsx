"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: string
  createdAt: string
  updatedAt: string
  assignedToName: string
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", company: "", status: "NEW" })
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [viewingLead, setViewingLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  const statuses = ["NEW", "CONTACTED", "QUALIFIED", "LOST", "CONVERTED"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "CONTACTED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "QUALIFIED":
        return "bg-green-100 text-green-800 border-green-200"
      case "LOST":
        return "bg-red-100 text-red-800 border-red-200"
      case "CONVERTED":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "NEW":
        return "🆕"
      case "CONTACTED":
        return "📞"
      case "QUALIFIED":
        return "✅"
      case "LOST":
        return "❌"
      case "CONVERTED":
        return "🎉"
      default:
        return "⚪"
    }
  }

  const getCurrentStatusIndex = (status: string) => {
    return statuses.indexOf(status)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,15}$/
    return phoneRegex.test(phone)
  }

  const fetchLeads = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/myLeads`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) {
        if (response.status === 401) throw new Error("Please log in to access leads")
        if (response.status === 403) throw new Error("Access denied: Employee role required")
        throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`)
      }
      const data: Lead[] = await response.json()
      setLeads(data)
    } catch (err: any) {
      setError(err.message || "Failed to load leads")
      console.error("Leads error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePhone(newLead.phone)) {
      setError("Phone number must be 10-15 digits")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/newLead`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to add lead: ${response.status}`)
      }
      setShowLeadForm(false)
      setNewLead({ name: "", email: "", phone: "", company: "", status: "NEW" })
      await fetchLeads()
    } catch (err: any) {
      setError(err.message || "Failed to add lead")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLead || !validatePhone(editingLead.phone)) {
      setError("Phone number must be 10-15 digits")
      return
    }
    setIsLoading(true)
    setError(null)

    if (editingLead.status === "CONVERTED") {
      editingLead.status = "APPROVAL_PENDING"
      alert("🎉 Approval request sent to manager for conversion!")
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/updateLead`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingLead),
      })
      if (!response.ok) {
        throw new Error(`Failed to update lead: ${response.status}`)
      }
      setShowUpdateForm(false)
      setEditingLead(null)
      await fetchLeads()
    } catch (err: any) {
      setError(err.message || "Failed to update lead")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  // Filter leads based on search query and selected statuses
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === "" ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(lead.status)

    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (isLoading) {
    return <div className="max-w-7xl mx-auto p-6 flex items-center justify-center text-gray-700">Loading...</div>
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center text-red-600">
        <div className="text-center">
          <p>{error}</p>
          {error.includes("log in") && (
            <button
              onClick={() => (window.location.href = "/employee/login")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          )}
          <button onClick={fetchLeads} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Leads</h2>
          <button
            onClick={() => setShowLeadForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Lead
          </button>
        </div>
        {/* Search and Filter UI */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m1.85-2.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
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
                {selectedStatuses.length === 0 ? "Filter by Status" : `Statuses (${selectedStatuses.length})`}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${showStatusDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Selected Status Tags */}
            {selectedStatuses.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedStatuses.map((status) => (
                  <span
                    key={status}
                    className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} shadow-sm`}
                  >
                    {getStatusIcon(status)} {status}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStatusChange(status)
                      }}
                      className="ml-2 text-current hover:text-gray-900"
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
                  {statuses.map((status) => (
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
                        <span
                          className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status).split(" ")[0]} ${getStatusColor(status).split(" ")[1]}`}
                        ></span>
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredLeads.length} of {leads.length} leads
            {searchQuery && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Search: "{searchQuery}"
              </span>
            )}
          </p>
          {(searchQuery || selectedStatuses.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedStatuses([])
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          )}
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
                <th className="pb-3 text-sm font-semibold text-gray-700">Last Updated</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v3.306"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-400 mb-2">No leads found</p>
                      <p className="text-sm text-gray-400">
                        {searchQuery || selectedStatuses.length > 0
                          ? "Try adjusting your search or filter criteria"
                          : "Start by adding your first lead"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
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
                    <td className="py-4 text-gray-600">{new Date(lead.updatedAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <button
                        onClick={() => {
                          setEditingLead({ ...lead })
                          setShowUpdateForm(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setViewingLead(lead)
                          setShowViewModal(true)
                        }}
                        className="text-green-600 hover:text-green-800 font-medium"
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

      {/* Add Lead Form */}
      {/* Enhanced Add Lead Form */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Lead</h2>
                <p className="text-sm text-gray-600 mt-1">Create a new lead entry in your pipeline</p>
              </div>
              <button
                onClick={() => setShowLeadForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* New Lead Indicator */}
            <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  🆕
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Starting Your Lead Journey</h3>
                <p className="text-sm text-blue-700">
                  This lead will begin at the "NEW" status and progress through your pipeline
                </p>
              </div>
            </div>

            <form onSubmit={handleAddLead} className="space-y-6">
              {/* Personal Information Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newLead.name}
                        onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter full name"
                        required
                      />
                      <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={newLead.email}
                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter email address"
                        required
                      />
                      <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={newLead.phone}
                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter phone number"
                        required
                        pattern="[0-9]{10,15}"
                        title="Phone number must be 10-15 digits"
                      />
                      <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">10-15 digits only</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newLead.company}
                        onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter company name"
                      />
                      <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Selection */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Initial Status
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setNewLead({ ...newLead, status })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        newLead.status === status
                          ? `${getStatusColor(status)} border-current shadow-md`
                          : "bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">{getStatusIcon(status)}</span>
                        <span className="text-sm font-medium">{status}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">💡 Tip: Most new leads start with "NEW" status</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowLeadForm(false)
                    setError(null)
                    setNewLead({ name: "", email: "", phone: "", company: "", status: "NEW" })
                  }}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all flex items-center space-x-2 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Adding Lead...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Add Lead</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Update Form */}
      {showUpdateForm && editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Update Lead</h2>
              <div className="text-sm text-gray-500">ID: {editingLead.id}</div>
            </div>

            {/* Pipeline Progress */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pipeline Progress</h3>
              <div className="flex items-center justify-between">
                {statuses.map((status, index) => {
                  const isActive = status === editingLead.status
                  const isPassed = index < getCurrentStatusIndex(editingLead.status)
                  const isLost = editingLead.status === "LOST" && status !== "LOST"

                  return (
                    <div key={status} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                          isActive
                            ? "bg-blue-500 text-white border-blue-500"
                            : isPassed
                              ? "bg-green-500 text-white border-green-500"
                              : isLost
                                ? "bg-gray-200 text-gray-400 border-gray-300"
                                : "bg-white text-gray-400 border-gray-300"
                        }`}
                      >
                        {getStatusIcon(status)}
                      </div>
                      <div
                        className={`mt-2 text-xs font-medium ${
                          isActive ? "text-blue-600" : isPassed ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {status}
                      </div>
                      {index < statuses.length - 1 && (
                        <div
                          className={`absolute h-0.5 w-full mt-5 ${
                            isPassed && !isLost ? "bg-green-500" : "bg-gray-300"
                          }`}
                          style={{ left: "50%", width: "100%", zIndex: -1 }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleUpdateLead} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={editingLead.name}
                    onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    pattern="[0-9]{10,15}"
                    title="Phone number must be 10-15 digits"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={editingLead.company}
                    onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setEditingLead({ ...editingLead, status })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        editingLead.status === status
                          ? `${getStatusColor(status)} border-current`
                          : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>{getStatusIcon(status)}</span>
                        <span className="text-sm font-medium">{status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Lead Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-800">{new Date(editingLead.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="ml-2 text-gray-800">{new Date(editingLead.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Assigned To:</span>
                    <span className="ml-2 text-gray-800">{editingLead.assignedToName}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateForm(false)
                    setError(null)
                  }}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Updating..." : "Update Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced View Modal with Pipeline Flow */}
      {showViewModal && viewingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingLead.status)}`}>
                  {getStatusIcon(viewingLead.status)} {viewingLead.status}
                </span>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Pipeline Flow Visualization */}
            <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Pipeline Progress
              </h3>

              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 rounded-full"></div>
                <div
                  className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                  style={{
                    width:
                      viewingLead.status === "LOST"
                        ? "0%"
                        : `${(getCurrentStatusIndex(viewingLead.status) / (statuses.length - 1)) * 100}%`,
                  }}
                ></div>

                {/* Status Points */}
                <div className="flex justify-between relative z-10">
                  {statuses.map((status, index) => {
                    const isActive = status === viewingLead.status
                    const isPassed = index < getCurrentStatusIndex(viewingLead.status)
                    const isLost = viewingLead.status === "LOST"

                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-4 transition-all duration-500 ${
                            isActive
                              ? status === "LOST"
                                ? "bg-red-500 text-white border-red-300 shadow-lg shadow-red-200"
                                : "bg-blue-500 text-white border-blue-300 shadow-lg shadow-blue-200"
                              : isPassed && !isLost
                                ? "bg-green-500 text-white border-green-300"
                                : "bg-white text-gray-400 border-gray-300"
                          }`}
                        >
                          {getStatusIcon(status)}
                        </div>
                        <div
                          className={`mt-3 px-2 py-1 rounded-md text-xs font-semibold text-center min-w-[80px] ${
                            isActive
                              ? status === "LOST"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                              : isPassed && !isLost
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {status}
                        </div>
                        {isActive && <div className="mt-1 text-xs text-gray-500 font-medium">Current</div>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Progress Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {getCurrentStatusIndex(viewingLead.status) + 1}
                  </div>
                  <div className="text-xs text-gray-500">Current Stage</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {viewingLead.status === "LOST"
                      ? "0"
                      : Math.round((getCurrentStatusIndex(viewingLead.status) / (statuses.length - 1)) * 100)}
                    %
                  </div>
                  <div className="text-xs text-gray-500">Progress</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.ceil(
                      (new Date().getTime() - new Date(viewingLead.createdAt).getTime()) / (1000 * 60 * 60 * 24),
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Days Active</div>
                </div>
              </div>
            </div>

            {/* Lead Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>

                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                      <p className="text-gray-900 font-semibold">{viewingLead.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <p className="text-gray-900 font-semibold">{viewingLead.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                      <p className="text-gray-900 font-semibold">{viewingLead.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Company</label>
                      <p className="text-gray-900 font-semibold">{viewingLead.company || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Lead Timeline</h3>

                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <div>
                      <label className="block text-xs font-medium text-green-600 uppercase tracking-wide">
                        Created
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {new Date(viewingLead.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(viewingLead.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <div>
                      <label className="block text-xs font-medium text-blue-600 uppercase tracking-wide">
                        Last Updated
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {new Date(viewingLead.updatedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(viewingLead.updatedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                    <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <div>
                      <label className="block text-xs font-medium text-purple-600 uppercase tracking-wide">
                        Assigned To
                      </label>
                      <p className="text-gray-900 font-semibold">{viewingLead.assignedToName}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Lead ID</label>
                      <p className="text-gray-900 font-semibold font-mono text-sm">{viewingLead.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <div className="text-sm text-gray-500">
                Lead has been active for{" "}
                {Math.ceil((new Date().getTime() - new Date(viewingLead.createdAt).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                days
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setViewingLead(null)
                    setShowViewModal(false)
                    setEditingLead({ ...viewingLead })
                    setShowUpdateForm(true)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Edit Lead</span>
                </button>
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
  )
}

export default Leads
