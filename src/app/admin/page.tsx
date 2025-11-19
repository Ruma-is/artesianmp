'use client'

import React, { useState } from 'react';

type Artisan = {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
};

type Product = {
  id: number;
  name: string;
  artisanName: string;
  status: 'pending' | 'approved' | 'rejected';
};

const initialArtisans: Artisan[] = [
  { id: 1, name: 'Ravi Kumar', email: 'ravi@example.com', status: 'pending' },
  { id: 2, name: 'Sita Devi', email: 'sita@example.com', status: 'pending' },
];

const initialProducts: Product[] = [
  { id: 101, name: 'Handmade Pottery Vase', artisanName: 'Ravi Kumar', status: 'pending' },
  { id: 102, name: 'Embroidered Cushion Cover', artisanName: 'Sita Devi', status: 'pending' },
];

const AdminDashboard = () => {
  const [artisans, setArtisans] = useState<Artisan[]>(initialArtisans);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Update artisan status (approve/reject)
  const updateArtisanStatus = (id: number, newStatus: Artisan['status']) => {
    setArtisans((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // Update product status (approve/reject)
  const updateProductStatus = (id: number, newStatus: Product['status']) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Artisan Management Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Artisan Applications</h2>
        <table className="w-full border border-gray-300 rounded mb-10">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artisans.map((artisan) => (
              <tr key={artisan.id} className="border-b">
                <td className="p-3">{artisan.name}</td>
                <td className="p-3">{artisan.email}</td>
                <td className="p-3 capitalize">{artisan.status}</td>
                <td className="p-3">
                  {artisan.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => updateArtisanStatus(artisan.id, 'approved')}
                        className="mr-2 px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateArtisanStatus(artisan.id, 'rejected')}
                        className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="font-semibold capitalize">{artisan.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Product Approval Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Product Approvals</h2>
        <table className="w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border-b">Product Name</th>
              <th className="p-3 border-b">Artisan</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.artisanName}</td>
                <td className="p-3 capitalize">{product.status}</td>
                <td className="p-3">
                  {product.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => updateProductStatus(product.id, 'approved')}
                        className="mr-2 px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateProductStatus(product.id, 'rejected')}
                        className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="font-semibold capitalize">{product.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
