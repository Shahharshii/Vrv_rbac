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
        <div className="bg-emerald-500 text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-xl font-semibold">
                    {role} Portal
                </div>
                <div className="flex items-center gap-4">
                    <span>Hello, {role}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header