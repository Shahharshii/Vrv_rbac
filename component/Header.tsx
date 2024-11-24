import React from 'react'
import { useRouter } from 'next/navigation';

interface HeaderProps {
    role: string;
}
const Header = ({ role }: HeaderProps) => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }
    return (
        <div className="bg-emerald-800 text-white p-6 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">
                    {role} Portal
                </div>
                <div className="flex items-center gap-4 text-lg">
                    <span>Hello, {role}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header