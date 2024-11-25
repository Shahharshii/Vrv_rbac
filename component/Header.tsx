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
        <div className="bg-emerald-800 text-white p-3 sm:p-6 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <div className="text-lg sm:text-xl font-bold text-center sm:text-left w-full sm:w-auto">
                    {role} Portal
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-4 text-base sm:text-lg">
                    <span>Hello, {role}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header