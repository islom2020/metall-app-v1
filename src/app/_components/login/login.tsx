"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PREDEFINED_USERNAME = "admin";
const PREDEFINED_PASSWORD = "12345";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === PREDEFINED_USERNAME && password === PREDEFINED_PASSWORD) {
      const loginTime = new Date().getTime();
      sessionStorage.setItem("loginTime", loginTime.toString());
      sessionStorage.setItem("isLoggedIn", "true");
      router.push("/dashboard");
    } else {
      setError("Incorrect username or password");
    }
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
      <div className='w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white text-center mb-6'>
          Welcome Back
        </h1>
        {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='username'
              className='block text-gray-700 dark:text-gray-300 mb-2'
            >
              Username
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your username'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='password'
              className='block text-gray-700 dark:text-gray-300 mb-2'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your password'
            />
          </div>
          <button
            type='submit'
            className='w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
