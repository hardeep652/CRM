"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MainPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleLoginClick = () => {
    router.push("/login")
  }

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      title: "Task Management",
      description:
        "Create, edit, and track tasks with statuses and priorities. Assign tasks to team members and link them to leads, demonstrating robust data handling and UI design.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Lead Management",
      description:
        "Manage leads with detailed information like company and contact data, showcasing advanced data structures and efficient state management in React.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Role-Based Access",
      description:
        "Implements secure authentication with role-based permissions using Spring Security, highlighting my expertise in building secure full-stack applications.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Responsive Design",
      description:
        "Features a mobile-first, responsive interface with smooth animations and a cohesive blue gradient theme, built with Tailwind CSS and Next.js.",
    },
  ]

  const techStack = [
    { name: "React", color: "from-blue-500 to-cyan-500" },
    { name: "TypeScript", color: "from-blue-600 to-indigo-600" },
    { name: "Next.js", color: "from-gray-800 to-gray-900" },
    { name: "Tailwind CSS", color: "from-teal-500 to-blue-500" },
    { name: "Chart.js", color: "from-blue-500 to-indigo-500" },
    { name: "Spring Boot", color: "from-green-500 to-emerald-500" },
  ]

  const quickLinks = [
    { name: "Task Management", href: "/tasks", icon: "📋" },
    { name: "Lead Management", href: "/leads", icon: "👥" },
    { name: "User Management", href: "/users", icon: "⚙" },
    { name: "Analytics Dashboard", href: "/dashboard", icon: "📊" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent">
                CRM Demo
              </h1>
            </div>
            <button
              onClick={handleLoginClick}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 font-semibold flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="mb-8">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
                Full-Stack CRM Demo
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 font-medium max-w-4xl mx-auto leading-relaxed">
                A showcase of my full-stack development skills with a modern CRM system built using React, TypeScript, Next.js, and Spring Boot. Explore the live demo to see my work in action.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleLoginClick}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 font-semibold text-lg flex items-center gap-3"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Try the Demo
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>

              <button className="group relative overflow-hidden bg-white/90 backdrop-blur-sm text-slate-700 px-10 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg border border-white/40 flex items-center gap-3">
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  View Features
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {techStack.map((tech, index) => (
                <div
                  key={tech.name}
                  className={`group px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/40 cursor-pointer`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? `slideInUp 0.6s ease-out ${index * 0.1}s both` : "none",
                  }}
                >
                  <span
                    className={`font-semibold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block`}
                  >
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent mb-6">
              Key Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore the core functionalities I built to demonstrate my skills in full-stack development and UI/UX design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 p-8 cursor-pointer relative overflow-hidden"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: isVisible ? `slideInUp 0.8s ease-out ${index * 0.2}s both` : "none",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/50">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how I designed an intuitive interface with powerful features for this portfolio project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Getting Started",
                description:
                  "Log in with role-based credentials to access a tailored dashboard, showcasing my implementation of secure authentication and permission controls.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Manage Operations",
                description:
                  "Create and track tasks with priorities and due dates, and manage leads with detailed data, demonstrating my skills in data management and UI design.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Track & Optimize",
                description:
                  "View real-time analytics and use pagination for large datasets, highlighting my ability to build responsive and scalable applications.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ),
              },
            ].map((step, index) => (
              <div
                key={step.step}
                className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 p-8 cursor-pointer relative overflow-hidden"
                style={{
                  animationDelay: `${index * 300}ms`,
                  animation: isVisible ? `slideInUp 1s ease-out ${index * 0.3}s both` : "none",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      {step.step}
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="relative py-20 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent mb-6">
              Explore Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Navigate through key sections of the demo to see my implementation of modern web development techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={handleLoginClick}
                className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 p-8 cursor-pointer relative overflow-hidden text-left"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: isVisible ? `slideInUp 0.7s ease-out ${index * 0.15}s both` : "none",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {link.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
                    {link.name}
                  </h3>
                  <div className="mt-2 text-blue-600 group-hover:text-blue-700 transition-colors duration-300 flex items-center gap-2">
                    <span className="text-sm font-medium">Explore Now</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Check Out My Work</h2>
              <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                This CRM demo showcases my skills in building modern, scalable, and secure full-stack applications. Try it out to see the results!
              </p>
              <button
                onClick={handleLoginClick}
                className="group relative overflow-hidden bg-white text-blue-600 px-12 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-lg flex items-center gap-3 mx-auto"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Explore the Demo
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-white/50 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent">
                CRM Demo
              </h3>
            </div>
            <p className="text-slate-600 mb-6">Built with React, TypeScript, Next.js, and Spring Boot to showcase my full-stack development skills.</p>
            <p className="text-sm text-slate-500">
              © 2025 CRM Demo. A portfolio project demonstrating modern web development techniques.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}