'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Tasktable from '@/component/Tasktable';
import Header from '@/component/Header';
import Usertable from '@/component/Usertable';

const SuperUserDashboard = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState<string[]>([]);

    useEffect(() => {
        checkUser();
        setLoading(false);
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
        } else if (data.role === 'superuser') {
            setPermissions(data.permissions);
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
            <Header role="Superuser" />
            <Usertable permissions={permissions} role="superuser" />
            <Tasktable permissions={permissions} role="superuser" />
        </div>
    );
}

export default SuperUserDashboard;