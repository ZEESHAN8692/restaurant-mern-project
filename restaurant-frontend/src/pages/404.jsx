import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-500">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <div className="flex flex-col items-center">
        <p className="mt-4 text-lg">
          Oops! The page you are looking for doesn't exist.
        </p>
        <Link to="/" className="mt-4 self-start bg-blue-500 text-white px-4 py-2 rounded-md">
          Go to Home
        </Link>
        <button
          className="mt-4 self-start bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>

    </div>
  );
};

export default NotFound;

