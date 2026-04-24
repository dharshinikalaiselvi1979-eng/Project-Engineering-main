export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="text-5xl mb-4">📦</div>

      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      <p className="text-gray-600 mb-4">{message}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}