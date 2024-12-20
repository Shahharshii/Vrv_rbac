'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/component/Header';


interface User {
    _id: string;
    username: string;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    assignedTo: User[];
}

interface ApiResponse {
    success: boolean;
    tasks: Task[];
}

export default function UserDashboard() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkUser();
        fetchUserTasks();
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

        } else if (data.role === 'superuser') {
            router.push('/superuserdashboard');
        } else if (data.role === 'admin') {
            router.push('/admindashboard');
        }
    }

    const fetchUserTasks = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/task/getalltask', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const data: ApiResponse = await response.json();
            setTasks(data.tasks || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching tasks:', err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const markTaskAsComplete = async (taskId: string) => {
        try {
            const response = await fetch('/api/task/edit', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: taskId,
                    status: 'completed'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            await fetchUserTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error marking task as complete:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500 text-center">
                <p>Error: {error}</p>
                <button
                    onClick={fetchUserTasks}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <Header role="User" />
            {/* Main Content */}
            <div className="py-6">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="p-6 rounded-t-lg shadow-lg mb-6">
                        <h1 className="text-2xl font-bold">My Tasks</h1>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Array.isArray(tasks) && tasks.map((task) => (
                            <div
                                key={task._id}
                                className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                            >
                                <h2 className="font-semibold text-lg">{task.title}</h2>
                                <p className="text-gray-600 mt-2">{task.description}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Assigned to: {task.assignedTo.map(user => user.username).join(', ')}
                                </p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className={`px-2 py-1 rounded-full text-sm ${task.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : task.status === 'in_progress'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {task.status}
                                    </span>
                                    {task.status !== 'completed' && (
                                        <button
                                            onClick={() => markTaskAsComplete(task._id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {tasks.length === 0 && (
                            <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">No tasks assigned yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}