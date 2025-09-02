'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Todo App
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A modern todo application built with FastAPI backend and Next.js frontend
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {isAuthenticated ? (
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-6">
                  Welcome back, <span className="font-semibold">{user?.username}</span>!
                </p>
                <div className="space-x-4">
                  <Link
                    href="/todos"
                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Manage Todos
                  </Link>
                  <Link
                    href="/users"
                    className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    View Users
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Management
              </h3>
              <p className="text-gray-600">
                Create, update, and manage user accounts with secure authentication.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Todo Management
              </h3>
              <p className="text-gray-600">
                Create, organize, and track your todos with different states and filters.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                FastAPI Backend
              </h3>
              <p className="text-gray-600">
                Powered by FastAPI with async database operations and JWT authentication.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
