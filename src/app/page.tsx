import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
        <Link href="/login">
          <button className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Click Here to Login
          </button>
        </Link>
      </div>
    </div>
  );
}