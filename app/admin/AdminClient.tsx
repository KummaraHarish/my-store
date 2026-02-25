"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminClient() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setName("");
    setPrice("");
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (imageFile) formData.append("image", imageFile);

    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        body: formData,
      });
      toast.success("Product updated!");
    } else {
      await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      toast.success("Product added!");
    }

    resetForm();
    fetchProducts();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await fetch(`/api/products/${deleteId}`, {
      method: "DELETE",
    });

    toast.success("Product deleted!");

    const updatedProducts = products.filter((p) => p._id !== deleteId);
    setProducts(updatedProducts);
    setDeleteId(null);

    if (
      updatedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ).length === 0 &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (product: any) => {
    setName(product.name);
    setPrice(product.price);
    setEditingId(product._id);
    setImagePreview(product.image);
  };

  const handleLogout = async () => {
    await fetch("/api/logout");
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <ul className="space-y-4">
          <li>Dashboard</li>
          <li>Products</li>
          <li
            className="cursor-pointer text-red-300"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50">

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Manage Products
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 border px-4 py-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Form */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:grid md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
              required
            />

            <input
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="border px-3 py-2 rounded-lg"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}

            <button className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
          {paginatedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 md:p-6 rounded-xl shadow"
            >
              <div className="flex gap-4">
                {product.image && (
                  <img
                    src={product.image}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {product.name}
                  </h3>

                  <p className="text-green-600 font-bold">
                    ₹{product.price}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(product._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">
            <p className="text-lg font-semibold">
              Confirm delete?
            </p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}