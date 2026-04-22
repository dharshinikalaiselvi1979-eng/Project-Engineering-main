import { useState, useEffect } from 'react'
import { fetchOrders } from '../mockApi'

// Sub-components

function SkeletonRow() {
  return (
    <tr>
      {[40, 130, 180, 90, 80, 90].map((w, i) => (
        <td key={i} style={{ padding: '16px 20px' }}>
          <div
            style={{
              width: w,
              height: 13,
              borderRadius: 6,
              background:
                'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite',
            }}
          />
        </td>
      ))}
    </tr>
  )
}

function OrderRow({ order }) {
  const STATUS_CONFIG = {
    Delivered: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', dot: '#10b981' },
    Shipped: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', dot: '#3b82f6' },
    Processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
    Pending: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', dot: '#8b5cf6' },
    Cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', dot: '#ef4444' },
  }

  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending

  return (
    <tr>
      <td style={{ padding: '15px 20px', fontFamily: 'var(--mono)', fontSize: 12 }}>
        {order.id}
      </td>
      <td style={{ padding: '15px 20px' }}>{order.customer}</td>
      <td style={{ padding: '15px 20px' }}>{order.product}</td>
      <td style={{ padding: '15px 20px', fontFamily: 'var(--mono)' }}>
        ₹{order.amount.toLocaleString()}
      </td>
      <td style={{ padding: '15px 20px' }}>
        <span
          style={{
            background: s.bg,
            color: s.color,
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
          {order.status}
        </span>
      </td>
      <td style={{ padding: '15px 20px' }}>{order.date}</td>
    </tr>
  )
}

/* ───────── EMPTY STATE ───────── */
function EmptyState({ hasFilter }) {
  return (
    <tr>
      <td colSpan={6}>
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>📭</div>

          <h3 style={{ fontSize: 18, marginTop: 12 }}>
            {hasFilter ? 'No matching orders' : 'No orders yet'}
          </h3>

          <p style={{ color: 'var(--text-secondary)', maxWidth: 320, margin: '0 auto' }}>
            {hasFilter
              ? 'Try clearing filters to see all orders.'
              : 'Orders will appear here once customers start placing them.'}
          </p>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: '10px 16px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>
      </td>
    </tr>
  )
}

/* ───────── ERROR STATE ───────── */
function ErrorState({ message, onRetry }) {
  let displayMessage = 'Something went wrong'

  if (message?.includes('fetch')) displayMessage = 'Network error. Please check your connection.'
  else if (message?.includes('500')) displayMessage = 'Server issue. Please try again later.'
  else if (message) displayMessage = message

  return (
    <tr>
      <td colSpan={6}>
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>⚠️</div>

          <h3>Error loading orders</h3>

          <p style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{displayMessage}</p>

          <button
            onClick={onRetry}
            style={{
              marginTop: 16,
              padding: '10px 18px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </td>
    </tr>
  )
}

/* ───────── MAIN DASHBOARD ───────── */
export default function OrdersDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOrders = () => {
    setLoading(true)
    setError(null)
    setOrders([])

    fetchOrders()
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const hasFilter = false

  const totalRevenue = orders.reduce(
    (s, o) => s + (o.status !== 'Cancelled' ? o.amount : 0),
    0
  )

  const delivered = orders.filter((o) => o.status === 'Delivered').length

  const pending = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 40 }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>📦 Orders</h1>

        <button onClick={loadOrders}>Refresh</button>
      </div>

      {/* TABLE */}
      <table style={{ width: '100%', marginTop: 20 }}>
        <thead>
          <tr>
            {['ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
              <th key={h} style={{ textAlign: 'left' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* ✅ LOADING STATE */}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

          {/* ❌ ERROR STATE */}
          {error && !loading && (
            <ErrorState message={error} onRetry={loadOrders} />
          )}

          {/* 📭 EMPTY STATE */}
          {!loading && !error && orders.length === 0 && (
            <EmptyState hasFilter={hasFilter} />
          )}

          {/* ✅ SUCCESS STATE */}
          {!loading &&
            !error &&
            orders.length > 0 &&
            orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
        </tbody>
      </table>

      {/* ANIMATION */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
      `}</style>
    </div>
  )
}