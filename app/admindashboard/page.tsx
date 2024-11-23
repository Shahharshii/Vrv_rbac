'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import User from '@/models/Usermodel';


interface User {
    _id: string;
    username: string;
    role: string;
    isActive: boolean;
}

const AdminDashboard = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        checkUser();
        fetchUsers();

    }, []);

    const checkUser = async () => {
        const response = await fetch('/api/auth/checkuser', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            router.push('/login');

        } else if (data.role === 'user') {
            router.push('/userdashboard');
        } else if (data.role === 'superuser') {
            router.push('/superuserdashboard');
        }
    }

    const fetchUsers = async () => {
        try {

            const response = await fetch('/api/auth/checkuser');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchUsers(); // Refresh the list
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-emerald-500 text-white p-4 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-semibold">
                        Admin Portal
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Hello, Admin</span>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="py-6">
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="bg-slate-200 p-6 rounded-t-lg shadow-lg mb-0">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">User Management</h1>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search User"
                                        className="px-4 py-2 border rounded-lg w-64 text-gray-800"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => router.push('/admin/users/add')}
                                    className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500"
                                >
                                    Add User
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-b-lg shadow">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-6 py-3 text-left">Username</th>
                                    <th className="px-6 py-3 text-left">User Role</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.username}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'admin'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : user.role === 'superuser'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => router.push(`/admin/users/edit/${user._id}`)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <FiEdit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-6 py-4 flex items-center justify-between border-t">
                            <div>
                                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded border disabled:opacity-50"
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded border disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1">Page {currentPage}</span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded border disabled:opacity-50"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded border disabled:opacity-50"
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;