import { useEffect } from "react";

type ToastProps = {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white text-sm font-medium flex items-center gap-2 shadow-lg z-50'>
            {type === 'success' && '✓ '}
            {type === 'error' && '✗ '}
            {message}
        </div>
    );
}