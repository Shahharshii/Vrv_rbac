'use client'

import React, { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

interface TaskTableProps {
    permissions: string[];
    role: string;
}

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
    assignedTo: User[];
}


const Tasktable = ({ permissions = [], role }: TaskTableProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
    });
    const [loading, setLoading] = useState(true);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editTaskForm, setEditTaskForm] = useState({
        title: '',
        description: '',
        assignedTo: [] as string[]
    });



    const canAddTask = Array.isArray(permissions) ? permissions.includes('add_task') : false;
    const canDeleteTask = Array.isArray(permissions) ? permissions.includes('delete_task') : false;
    const canEditTask = Array.isArray(permissions) ? permissions.includes('edit_task') : false;
    const canCompleteTask = Array.isArray(permissions) ? permissions.includes('complete_task') : false;

    useEffect(() => {
        fetchUsers();
        fetchTasks();
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

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/task/getalltask', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });


            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setTasks(data.tasks);
            } else {
                throw new Error(data.message);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };
    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/task/addtask', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newTask.title,
                    description: newTask.description,
                    assignedTo: [selectedUser],
                }),
            });

            if (response.ok) {
                setShowAddTaskModal(false);
                setNewTask({ title: '', description: '' });
                setSelectedUser('');
                fetchTasks();
            } else {
                const errorData = await response.json();
                console.error('Error adding task:', errorData);
                alert(errorData.message || 'Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch('/api/task/delete', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: taskId }),
                });
                if (response.ok) {
                    fetchTasks();
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleMarkComplete = async (taskId: string) => {
        try {
            const task = tasks.find(t => t._id === taskId);
            const newStatus = task?.status === 'completed' ? 'pending' : 'completed';

            const response = await fetch('/api/task/edit', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: taskId,
                    status: newStatus
                }),
            });

            if (response.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleEditTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask) return;

        try {
            const response = await fetch('/api/task/edit', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingTask._id,
                    ...editTaskForm
                }),
            });

            if (response.ok) {
                setShowEditTaskModal(false);
                setEditingTask(null);
                fetchTasks();
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setEditTaskForm({
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo.map(user => user._id)
        });
        setShowEditTaskModal(true);
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.some(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div>
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
                                {canAddTask && (
                                    <button
                                        onClick={() => setShowAddTaskModal(true)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
                                    >
                                        <FiPlus /> Assign New Task
                                    </button>
                                )}
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
                                        {canCompleteTask && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complete</th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                                                {canCompleteTask && (
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={task.status === 'completed'}
                                                            onChange={() => handleMarkComplete(task._id)}
                                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                                        />
                                                    </td>
                                                )}
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{task.title}</div>
                                                    <div className="text-sm text-gray-500">{task.description}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {task.assignedTo.map(user => user.username).join(', ')}
                                                </td>
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

                                                <td className="px-6 py-4">
                                                    <div className="flex gap-3">
                                                        {canEditTask && (
                                                            <button
                                                                onClick={() => openEditModal(task)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                <FiEdit2 className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        {canDeleteTask && (
                                                            <button
                                                                onClick={() => handleDeleteTask(task._id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <FiTrash2 className="w-5 h-5" />
                                                            </button>
                                                        )}
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
                                    onChange={(e) => {
                                        console.log('Selected user:', e.target.value);
                                        setSelectedUser(e.target.value);
                                    }}
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

            {/* Edit Task Modal */}
            {showEditTaskModal && editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                        <form onSubmit={handleEditTask}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded"
                                    value={editTaskForm.title}
                                    onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded"
                                    value={editTaskForm.description}
                                    onChange={(e) => setEditTaskForm({ ...editTaskForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Assigned Users</label>
                                <select
                                    multiple
                                    className="w-full px-3 py-2 border rounded"
                                    value={editTaskForm.assignedTo}
                                    onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                        setEditTaskForm({ ...editTaskForm, assignedTo: selectedOptions });
                                    }}
                                    required
                                >
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple users</p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditTaskModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Update Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



        </div>
    )
}

export default Tasktable