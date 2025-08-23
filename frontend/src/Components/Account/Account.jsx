import React from 'react';
import { useAuth } from "../Context/AuthContext";

const Account = ({ }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-green-800">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center w-80">
        <h2 className="text-2xl font-bold mb-2">Account</h2>
        <p className="text-lg text-pink-500">
          {user?.name || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default Account;