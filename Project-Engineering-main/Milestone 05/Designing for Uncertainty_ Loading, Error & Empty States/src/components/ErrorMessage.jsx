export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <div className="text-red-500 text-4xl mb-3">⚠️</div>

      <p className="text-gray-700 mb-4">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Retry
        </button>
      )}
    </div>
  )
}
// added new feature to new commit 
