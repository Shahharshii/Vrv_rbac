'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Usertable from '@/component/Usertable';
import Header from '@/component/Header';
import Tasktable from '@/component/Tasktable';

const AdminDashboard = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState<string[]>([]);

    useEffect(() => {
        const init = async () => {
            await checkUser();
            setLoading(false);
        };
        init();
    }, []);

    const checkUser = async () => {
        try {
            const response = await fetch('/api/auth/checkuser', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                router.push('/login');
                return;
            }

            switch (data.role) {
                case 'user':
                    router.push('/userdashboard');
                    break;
                case 'superuser':
                    router.push('/superuserdashboard');
                    break;
                case 'admin':
                    setPermissions(data.permission);
                    console.log(data.permission);
                    break;
            }
        } catch (error) {
            console.error('Error checking user:', error);
            router.push('/login');
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div>
            <Header role="Admin" />
            <div className="bg-white rounded-b-lg shadow">
                <Usertable
                    permissions={permissions} role="admin"
                />
                <Tasktable permissions={permissions} role="admin" />
            </div>

        </div>
    );
}

export default AdminDashboard;