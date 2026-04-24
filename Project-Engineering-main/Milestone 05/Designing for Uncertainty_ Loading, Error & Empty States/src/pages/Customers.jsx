import React from 'react';
import { useCustomers } from '../hooks/useCustomers';
import CustomerRow from '../components/CustomerRow';
import {
  SkeletonCard,
  ErrorMessage,
  EmptyState,
} from '../components/states';

const Customers = () => {
  const { data: customers, isLoading, error, refetch } = useCustomers();

  // ✅ 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="p-8">
        <SkeletonCard count={5} />
      </div>
    );
  }

  // ✅ 2. ERROR STATE
  if (error) {
    return (
      <div className="p-8">
        <ErrorMessage
          message="Unable to fetch customers. Please check your connection and try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // ✅ 3. EMPTY STATE
  if (!customers || customers.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          title="No customers yet"
          message="Customers will appear here once they register or place an order."
        />
      </div>
    );
  }

  // ✅ 4. SUCCESS STATE
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        Customer Management
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50 capitalize">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Order History
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {customers.map(customer => (
              <CustomerRow key={customer.id} customer={customer} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
// new feature for new branch