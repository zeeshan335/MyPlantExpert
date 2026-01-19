import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../firebase/marketplaceService";
import "./AdminProductManagement.css";

const AdminProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const productsData = await getProducts();
    setProducts(productsData);
    setLoading(false);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
    setDeleteReason("");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteReason.trim()) {
      alert("Please provide a reason for deletion.");
      return;
    }

    try {
      const result = await deleteProduct(
        selectedProduct.id,
        deleteReason,
        selectedProduct.sellerId,
        selectedProduct.sellerName || "Unknown Seller"
      );

      if (result.success) {
        alert("Product deleted successfully! Seller has been notified.");
        await loadProducts();
        setShowDeleteModal(false);
        setSelectedProduct(null);
        setDeleteReason("");
      } else {
        alert("Failed to delete product: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div className="admin-product-management">
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>Product Management</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          style={{
            background: "#666",
            color: "white",
            border: "none",
            padding: "0.8rem 1.5rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="products-table">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0f2d1a", color: "white" }}>
              <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Seller</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Category</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Price</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Discount</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Reviews</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "1rem" }}>{product.name}</td>
                <td style={{ padding: "1rem" }}>
                  {product.sellerName || "Admin"}
                </td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      background: "#e8f5e9",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {product.category}
                  </span>
                </td>
                <td style={{ padding: "1rem", fontWeight: "600" }}>
                  Rs. {product.price}
                </td>
                <td style={{ padding: "1rem" }}>
                  {product.discount > 0 && (
                    <span
                      style={{
                        background: "#fff3e0",
                        color: "#e65100",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {product.discount}% OFF
                    </span>
                  )}
                </td>
                <td style={{ padding: "1rem" }}>
                  {product.reviews?.length || 0}
                </td>
                <td style={{ padding: "1rem", textAlign: "center" }}>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    style={{
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <div className="modal-header">
              <h2>Delete Product</h2>
              <button
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#0f2d1a", marginBottom: "0.5rem" }}>
                  {selectedProduct?.name}
                </h3>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Seller: {selectedProduct?.sellerName || "Admin"}
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Reason for Deletion *
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Please provide a reason for deleting this product. This will be sent to the seller."
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <div
                className="modal-footer"
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    background: "#999",
                    color: "white",
                    border: "none",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  style={{
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;
