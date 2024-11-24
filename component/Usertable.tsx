'use client'
import React, { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'




interface User {
    _id: string;
    username: string;
    role: string;
    isActive: boolean;
    permission?: string[];
}

interface UserTableProps {
    permissions: string[];
    role: string;
}

const Usertable = ({ permissions, role }: UserTableProps) => {

    console.log(permissions);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState<User[]>([]);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(true);
    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [editModal, setEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/user/getalluser', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });


            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
            } else {
                throw new Error(data.message);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch('/api/user/deleteuser', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: userId }),
                });
                if (response.ok) {
                    fetchUsers();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };
    // Memoize filtered users
    const filteredUsers = React.useMemo(() =>
        users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !(role === 'superuser' && user.role === 'admin')
        ),
        [users, searchTerm, role]
    );
    // Get current page users
    const currentUsers = React.useMemo(() =>
        filteredUsers.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        ),
        [filteredUsers, currentPage, itemsPerPage]
    );

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                setShowModal(false);
                setNewUser({ username: '', password: '' });
                fetchUsers(); // Refresh the list
            } else {
                throw new Error('Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setEditModal(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const response = await fetch('/api/user/edituser', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingUser._id,
                    username: editingUser.username,
                    isActive: editingUser.isActive,
                    role: editingUser.role,
                    permission: editingUser.permission
                }),
            });

            if (response.ok) {
                setEditModal(false);
                setEditingUser(null);
                fetchUsers();
            } else {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="py-6">
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Header Section */}
                        <div className="p-6 bg-gray-50 border-b">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search User"
                                            className="px-4 py-2 border rounded-lg w-64"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    {permissions?.includes('add_user') && (
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500"
                                        >
                                            Add User
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' :
                                                        user.role === 'superuser' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`h-2.5 w-2.5 rounded-full mr-2 
                                                        ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex space-x-3">
                                                    {permissions?.includes('edit_user') && (
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <FiEdit2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {user.role !== 'admin' &&
                                                        !(role === 'superuser' && user.role === 'superuser') &&
                                                        permissions?.includes('delete_user') && (
                                                            <button
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <FiTrash2 className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section */}
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, totalUsers)} of {totalUsers} users
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        First
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1">Page {currentPage}</span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Last
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <form onSubmit={handleAddUser}>
                            <div className="mb-4">
                                <label className="block mb-2">Username</label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                >
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {editModal && editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <form onSubmit={handleUpdateUser}>
                            <div className="mb-4">
                                <label className="block mb-2">Username</label>
                                <input
                                    type="text"
                                    value={editingUser.username}
                                    className="w-full px-3 py-2 border rounded bg-gray-100"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Status</label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={editingUser.isActive}
                                        onChange={(e) => setEditingUser({
                                            ...editingUser,
                                            isActive: e.target.checked
                                        })}
                                        className="mr-2"
                                    />
                                    <span>Active</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Role</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        role: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="user">User</option>
                                    <option value="superuser">Superuser</option>
                                    {role === 'admin' && <option value="admin">Admin</option>}
                                </select>
                            </div>
                            {permissions?.includes('edit_permission') && editingUser.role !== 'user' && (
                                <div className="mb-4">
                                    <label className="block mb-2">Permissions</label>
                                    <div className="space-y-2">
                                        {[
                                            'add_user',
                                            'edit_user',
                                            'delete_user',
                                            'add_task',
                                            'edit_task',
                                            'delete_task',
                                            'edit_permission',
                                            'complete_task'
                                        ].map((perm) => (
                                            <div key={perm} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={editingUser.permission?.includes(perm)}
                                                    onChange={(e) => {
                                                        const newPermissions = e.target.checked
                                                            ? [...(editingUser.permission || []), perm]
                                                            : editingUser.permission?.filter(p => p !== perm) || [];
                                                        setEditingUser({
                                                            ...editingUser,
                                                            permission: newPermissions
                                                        });
                                                    }}
                                                    className="mr-2"
                                                />
                                                <span className="capitalize">{perm.replace('_', ' ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditModal(false);
                                        setEditingUser(null);
                                    }}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                >
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Usertable