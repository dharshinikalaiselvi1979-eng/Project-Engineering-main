import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import {
  SkeletonCard,
  ErrorMessage,
  EmptyState,
} from '../components/states';

const Products = () => {
  const { data: products, isLoading, error, refetch } = useProducts();

  // ✅ 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="p-8">
        <SkeletonCard count={6} />
      </div>
    );
  }

  // ✅ 2. ERROR STATE
  if (error) {
    return (
      <div className="p-8">
        <ErrorMessage
          message="We couldn’t load your products. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // ✅ 3. EMPTY STATE
  if (!products || products.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          title="No products found"
          message="Start by adding your first product to your inventory."
          actionLabel="Add Product"
          onAction={() => {}}
        />
      </div>
    );
  }

  // ✅ 4. SUCCESS STATE (ORIGINAL UI)
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Product Inventory
        </h1>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            Filter
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;