"use client";

import { useEffect } from "react";
import { Button } from "@nextui-org/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6">
      {/* Icon */}
      <div className="bg-red-100 dark:bg-red-900/40 p-6 rounded-full animate-pulse mb-6">
        <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong 😥</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        An unexpected error occurred. Don't worry — you can try again!
      </p>

      {/* Reset Button */}
      <Button
        color="danger"
        className="px-6 py-2 font-medium shadow-md"
        onClick={() => reset()}
      >
        Try Again
      </Button>

      {/* Error Code Box */}
      <div className="mt-10 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-full max-w-xl text-left shadow">
        <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Error Details:
        </h3>
        <pre className="text-xs overflow-x-auto text-red-600 dark:text-red-400">
          {error?.message}
        </pre>
      </div>
    </div>
  );
}
