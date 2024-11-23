'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

interface User {
    _id: string;
    username: string;
    role: 'user';
}

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    assignedTo: User;
    dueDate: string;
}

const SuperUserDashboard = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
    });

    useEffect(() => {
        checkUser();
        fetchUsers();
        fetchTasks();
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
        } else if (data.role === 'admin') {
            router.push('/admindashboard');
        }
    }
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users?role=user');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newTask,
                    assignedTo: selectedUser,
                }),
            });

            if (response.ok) {
                setShowAddTaskModal(false);
                setNewTask({ title: '', description: '', dueDate: '' });
                setSelectedUser('');
                fetchTasks();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchTasks();
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        Superuser Portal
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Hello, Superuser</span>
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
                            <h1 className="text-2xl font-bold">Task Management</h1>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Search tasks or users..."
                                    className="px-4 py-2 border rounded-lg w-64 text-gray-800"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button
                                    onClick={() => setShowAddTaskModal(true)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
                                >
                                    <FiPlus /> Assign New Task
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-b-lg shadow">
                        {loading ? (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            </div>
                        ) : (
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTasks.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                No tasks found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTasks.map((task) => (
                                            <tr key={task._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{task.title}</div>
                                                    <div className="text-sm text-gray-500">{task.description}</div>
                                                </td>
                                                <td className="px-6 py-4">{task.assignedTo.username}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${task.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : task.status === 'in_progress'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => router.push(`/superuser/tasks/edit/${task._id}`)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <FiEdit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTask(task._id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {showAddTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Assign New Task</h2>
                        <form onSubmit={handleAddTask}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Assign To</label>
                                <select
                                    className="w-full px-3 py-2 border rounded"
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border rounded"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddTaskModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SuperUserDashboard;