import { AlertTriangle } from 'lucide-react';

export function ErrorState({ message }) {
    // A default message in case none is provided.
    const errorMessage = message || "We couldn't generate your report at this time. This is usually a temporary issue. Please try again in a few moments.";

    return (
        <div className="text-center mt-16 flex flex-col items-center gap-4" role="alert">
            <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle size={24} />
                <p className="text-xl font-semibold">
                    Analysis Failed
                </p>
            </div>
            <p className="text-red-400 text-sm font-medium max-w-md">
                {errorMessage}
            </p>
        </div>
    );
}