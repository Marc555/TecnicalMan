const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {message}
        </div>
        <button
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Reintentar
        </button>
    </div>
);

export default ErrorMessage;