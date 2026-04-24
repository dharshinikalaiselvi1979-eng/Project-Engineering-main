export default function SkeletonCard({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg shadow-sm animate-pulse bg-white"
        >
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  )
}