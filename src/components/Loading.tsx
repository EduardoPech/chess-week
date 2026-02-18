import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto py-5">
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500 mb-2">Loading...</p>
        <Loader2 className="size-4 animate-spin" />
      </div>
    </div>
  );
}