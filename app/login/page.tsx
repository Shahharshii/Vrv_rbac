"use client";
import React from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface FormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = React.useState<FormData>({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.username.trim().length < 2) {
            toast.error("Please enter a valid username", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Login successful!", {
                    position: "top-right",
                    autoClose: 3000,
                });

                localStorage.setItem('token', data.token);
                if (data.user.role === 'admin') {
                    router.push("/admindashboard");
                } else if (data.user.role === 'user') {
                    router.push("/userdashboard");
                } else if (data.user.role === 'superuser') {
                    router.push("/superuserdashboard");
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-6xl flex flex-col lg:flex-row min-h-[550px]">
                    {/* Left side - Welcome message with green background */}
                    <div className="w-full lg:w-5/12 flex flex-col items-center justify-center bg-emerald-500 text-white p-6 lg:p-12 
                        order-1 lg:order-1">
                        <div className="max-w-md w-full">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center lg:text-left">
                                Welcome to Task Tracker!
                            </h1>
                            <p className="text-sm sm:text-base mb-8 text-center lg:text-pretty opacity-90">
                                Login now to manage tasks, set priorities, track progress, and collaborate effortlessly.
                                Boost your productivity and achieve your goals with ease!
                            </p>
                        </div>
                    </div>

                    {/* Right side - Login form */}
                    <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-6 lg:p-12 
                        order-2 lg:order-2">
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                                Login Account
                            </h2>
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {/* Username Input */}
                                <div className="relative">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3 px-4 rounded-full text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors duration-300 text-base font-medium"
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600 text-sm">
                                    Don`t have an account?{" "}
                                    <button
                                        onClick={() => router.push("/")}
                                        className="text-emerald-500 hover:text-emerald-600 font-medium"
                                    >
                                        Register
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;
























