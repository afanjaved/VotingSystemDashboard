'use client';
import Link from 'next/link';

export default function GetStarted() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white p-6">
      <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">Welcome to Votify Dashboard 🇵🇰</h1>
      <p className="text-lg mb-10 max-w-lg text-center text-green-100">
        Manage elections, whitelist voters, and secure votes using the power of blockchain.
      </p>
      <Link
        href="/login"
        className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full shadow-xl hover:bg-gray-100 transition duration-200"
      >
        Get Started
      </Link>
    </div>
  );
}
