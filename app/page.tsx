"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
// import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css'
import { motion } from "framer-motion";

interface FormData {
  username: string;
  password: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.username.trim().length < 2) {
      toast.error("Please enter a valid username");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful!');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong during registration');
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-6xl flex flex-col lg:flex-row min-h-[550px] border-2 border-dotted border-emerald-800"
        >
          {/* Left side */}
          <motion.div
            initial={{
              opacity: 0,
              x: 0,
              y: -20
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.2
            }}
            className="w-full lg:w-5/12 flex flex-col items-center justify-center bg-emerald-900 text-white p-6 lg:p-12 order-1 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-md w-full"
            >
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center lg:text-left">
                Welcome to Task Tracker!
              </h1>
              <p className="text-sm sm:text-base mb-8 text-center lg:text-pretty opacity-90">
                Register now to manage tasks, set priorities, track progress, and collaborate effortlessly. Boost your productivity and achieve your goals with ease!
              </p>

            </motion.div>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              x: 0
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.2
            }}
            className="w-full lg:w-7/12 flex flex-col items-center justify-center p-6 lg:p-12 order-2 lg:order-2"
          >
            <div className="w-full max-w-md">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-6 text-center lg:text-center"
              >
                Create Account
              </motion.h2>

              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-5"
                onSubmit={handleSubmit}
              >
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
                    placeholder="Create a password"
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
                    className="w-full flex justify-center py-3 px-4 rounded-full text-white bg-emerald-800 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors duration-300 text-base font-medium"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6 text-center"
              >
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="text-emerald-800 hover:text-emerald-900 font-medium"
                  >
                    Login
                  </button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;




































