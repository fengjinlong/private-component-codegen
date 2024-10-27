'use client';

import React from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-700 via-blue-800 to-teal-500 text-white overflow-hidden">
      <div className="relative">
        <h1 className="text-6xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 animate-pulse">
          Welcome 👏
        </h1>
        <h2 className="text-4xl font-bold mt-4 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
            AI Friendly Clean Business
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Component Template
          </span>
        </h2>
      </div>
      <Button
        type="primary"
        className="mt-8 text-lg px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 border-0 hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        onClick={() => {
          router.push('/todo-list');
        }}
      >
        Go To Demo For Todo List Component
      </Button>
    </div>
  );
};

export default Home;
