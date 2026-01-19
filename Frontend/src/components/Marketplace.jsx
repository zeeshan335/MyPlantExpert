import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Marketplace.css";
import {
  getProducts,
  addReviewToProduct,
  saveCart,
  getCart,
  getFavorites,
  saveFavorites,
  getUserOrders,
  updateOrderStatus as updateOrderStatusDB,
} from "../firebase/marketplaceService";
import SellerChat from "./SellerChat";

const Marketplace = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [filterCategory, setFilterCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSellerChat, setShowSellerChat] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedChatProduct, setSelectedChatProduct] = useState(null);

  // Initialize products and load data
  useEffect(() => {
    loadMarketplaceData();
  }, [currentUser]);

  const loadMarketplaceData = async () => {
    setIsLoading(true);
    try {
      // Load products from Firestore
      const productsData = await getProducts();

      // Remove the initializeProducts call - it overwrites admin-added products
      // if (productsData.length === 0) {
      //   await initializeProducts();
      //   productsData = await getProducts();
      // }

      setProducts(productsData);

      // Load cart for logged-in user from Firestore
      if (currentUser?.email) {
        const cartData = await getCart(currentUser.email);
        setCart(cartData);
        const favoritesData = await getFavorites(currentUser.email);
        setFavorites(favoritesData);
      } else {
        // Fallback to localStorage for guests
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }

      // Load orders
      await loadOrders();
    } catch (error) {
      console.error("Error loading marketplace data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open review modal
  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
    setReviewText("");
    setRating(5);
  };

  // Close review modal
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedProduct(null);
    setReviewText("");
    setRating(5);
  };

  // Open all reviews modal
  const openAllReviewsModal = (product) => {
    setSelectedProduct(product);
    setShowAllReviewsModal(true);
  };

  // Close all reviews modal
  const closeAllReviewsModal = () => {
    setShowAllReviewsModal(false);
    setSelectedProduct(null);
  };

  // Load orders from Firestore
  const loadOrders = async () => {
    if (!currentUser?.email) return;

    try {
      const ordersData = await getUserOrders(currentUser.email);
      setOrders(ordersData.reverse());
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  // Update order status in Firestore
  const updateOrderStatus = async (orderId, newStatus) => {
    const success = await updateOrderStatusDB(orderId, newStatus);
    if (success) {
      await loadOrders();
    }
  };

  // Get status badge with updated statuses
  const getStatusBadge = (status) => {
    const badges = {
      Pending: {
        emoji: "🟡",
        color: "#ffc107",
        text: "Pending - Waiting for Seller",
      },
      Confirmed: { emoji: "🟢", color: "#4caf50", text: "Confirmed by Seller" },
      Delivered: { emoji: "📦", color: "#2196F3", text: "Delivered" },
      Completed: { emoji: "✅", color: "#28a745", text: "Completed" },
      "Cancelled by User": {
        emoji: "❌",
        color: "#dc3545",
        text: "Cancelled by You",
      },
      "Cancelled by Seller": {
        emoji: "❌",
        color: "#dc3545",
        text: "Cancelled by Seller",
      },
    };
    return badges[status] || badges["Pending"];
  };

  // Cancel order (only before seller confirmation)
  const cancelOrder = async (order) => {
    // Check if order can be cancelled
    if (order.status !== "Pending") {
      alert(
        "This order cannot be cancelled. It has already been " +
          order.status.toLowerCase() +
          "."
      );
      return;
    }

    const confirmCancel = window.confirm(
      `Are you sure you want to cancel Order #${order.orderId.slice(
        -8
      )}?\n\nThis action cannot be undone.`
    );

    if (confirmCancel) {
      try {
        const orderRef = doc(db, "orders", order.orderId);
        await updateDoc(orderRef, {
          status: "Cancelled by User",
          cancelledAt: new Date().toISOString(),
          cancelledBy: "User",
        });

        await loadOrders();
        alert("✅ Order cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Failed to cancel order. Please try again.");
      }
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    return order.status === "Pending";
  };

  // Get progress percentage
  const getProgressPercentage = (status) => {
    const progress = {
      "Pending Verification": 20,
      Verified: 40,
      Processing: 60,
      Shipped: 80,
      Delivered: 100,
      Cancelled: 0,
    };
    return progress[status] || 20;
  };

  // Cancel order (only within 24 hours)
  const cancelOrderOld = async (order) => {
    if (!canCancelOrder(order)) {
      alert("You can only cancel orders within 24 hours of placing them.");
      return;
    }

    const confirmCancel = window.confirm(
      `Are you sure you want to cancel Order #${order.orderId.slice(-8)}?`
    );

    if (confirmCancel) {
      try {
        const success = await updateOrderStatusDB(order.orderId, "Cancelled");
        if (success) {
          // Reload orders from Firestore
          await loadOrders();
          alert("Order cancelled successfully!");
        } else {
          alert("Failed to cancel order. Please try again.");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("An error occurred while cancelling the order.");
      }
    }
  };

  // Check if order can be cancelled (within 24 hours)
  const canCancelOrderOld = (order) => {
    // Don't allow cancellation if already cancelled or delivered
    if (order.status === "Cancelled" || order.status === "Delivered") {
      return false;
    }

    // Check if order is within 24 hours
    const orderDate = new Date(order.createdAt?.seconds * 1000 || order.date);
    const now = new Date();
    const hoursDiff = (now - orderDate) / (1000 * 60 * 60);

    return hoursDiff <= 24;
  };

  // Format date for display
  const formatOrderDate = (order) => {
    if (order.createdAt?.seconds) {
      return new Date(order.createdAt.seconds * 1000).toLocaleString();
    }
    return order.date;
  };

  // Add to cart and save to Firestore
  const addToCart = async (product) => {
    // Check if product is out of stock
    if (product.stock === 0) {
      alert("Sorry, this product is currently out of stock.");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      // Check if adding more would exceed available stock
      if (existingItem.quantity + 1 > product.stock) {
        alert(`Only ${product.stock} units available in stock.`);
        return;
      }
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);

    // Save to Firestore if user is logged in
    if (currentUser?.email) {
      await saveCart(currentUser.email, updatedCart);
    }

    alert(`${product.name} added to cart!`);
  };

  // Get cart count
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Add to favorites
  const addToFavorites = async (product) => {
    const existingItem = favorites.find((item) => item.id === product.id);
    let updatedFavorites;

    if (existingItem) {
      alert(`${product.name} is already in your favorites!`);
      return;
    } else {
      updatedFavorites = [...favorites, product];
    }

    setFavorites(updatedFavorites);

    // Save to Firestore if user is logged in
    if (currentUser?.email) {
      await saveFavorites(currentUser.email, updatedFavorites);
    } else {
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }

    alert(`${product.name} added to favorites!`);
  };

  // Remove from favorites
  const removeFromFavorites = async (productId) => {
    const updatedFavorites = favorites.filter((item) => item.id !== productId);
    setFavorites(updatedFavorites);

    // Update Firestore or localStorage
    if (currentUser?.email) {
      await saveFavorites(currentUser.email, updatedFavorites);
    } else {
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  // Check if product is in favorites
  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  // Submit review to Firestore
  const submitReview = async () => {
    if (!reviewText.trim()) {
      alert("Please write a review!");
      return;
    }

    const newReview = {
      id: Date.now(),
      userName: currentUser?.displayName || "Anonymous User",
      userEmail: currentUser?.email || "guest@example.com",
      text: reviewText,
      rating: rating,
      date: new Date().toLocaleDateString(),
    };

    // Add review to Firestore
    const success = await addReviewToProduct(selectedProduct.id, newReview);

    if (success) {
      // Reload products from Firestore to get updated reviews
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);

      closeReviewModal();
      alert("Review submitted successfully!");
    } else {
      alert("Failed to submit review. Please try again.");
    }
  };

  // Calculate average rating
  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Filter products
  const filteredProducts =
    filterCategory === "All"
      ? products
      : products.filter((p) => p.category === filterCategory);

  const categories = ["All", "Seeds", "Tools", "Supplies", "Seasonal"];

  // Open seller chat
  const openSellerChat = (product) => {
    if (!currentUser) {
      alert("Please login to chat with the seller");
      navigate("/login");
      return;
    }

    setSelectedSeller({
      id: product.sellerId || "admin",
      name: product.sellerName || "Admin",
    });
    setSelectedChatProduct(product.name);
    setShowSellerChat(true);
  };

  if (isLoading) {
    return (
      <div className="marketplace-container">
        <div
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <div className="simple-loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="marketplace-container"
      style={{ maxWidth: "100%", width: "100%", padding: "2rem 1rem" }}
    >
      <div className="marketplace-header" style={{ maxWidth: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <h1 style={{ margin: "0 0 0.5rem 0" }}>Plant Marketplace</h1>
            <p style={{ margin: 0 }}>
              Buy plants, seeds, tools, and gardening supplies
            </p>
          </div>
          <button
            className="back-to-dashboard-btn"
            onClick={() => navigate("/dashboard")}
            style={{ position: "absolute", right: "2rem", top: "2rem" }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Cart and Orders Buttons - Improved Design */}
        {(getCartCount() > 0 ||
          favorites.length > 0 ||
          orders.filter((o) => o.status !== "Cancelled").length > 0) && (
          <div className="header-actions">
            {getCartCount() > 0 && (
              <button
                className="header-btn cart-btn"
                onClick={() => navigate("/checkout")}
              >
                <div className="btn-content">
                  <span className="btn-label">View Your Cart</span>
                  <span className="btn-count">({getCartCount()})</span>
                </div>
              </button>
            )}
            {favorites.length > 0 && (
              <button
                className="header-btn favorites-btn"
                onClick={() => setShowFavoritesModal(true)}
              >
                <div className="btn-content">
                  <span className="btn-label">My Favorites</span>
                  <span className="btn-count">({favorites.length})</span>
                </div>
              </button>
            )}
            {orders.filter((o) => o.status !== "Cancelled").length > 0 && (
              <button
                className="header-btn orders-btn"
                onClick={() => setShowOrdersModal(true)}
              >
                <div className="btn-content">
                  <span className="btn-label">My Orders</span>
                  <span className="btn-count">
                    ({orders.filter((o) => o.status !== "Cancelled").length})
                  </span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filterCategory === cat ? "active" : ""}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => {
          const isOutOfStock = (product.stock || 0) === 0;
          const isLowStock =
            (product.stock || 0) > 0 && (product.stock || 0) <= 5;

          return (
            <div
              key={product.id}
              className="product-card"
              style={{
                opacity: isOutOfStock ? 0.7 : 1,
                position: "relative",
              }}
            >
              {isOutOfStock && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#dc3545",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    zIndex: 10,
                  }}
                >
                  OUT OF STOCK
                </div>
              )}
              {isLowStock && !isOutOfStock && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#ff9800",
                    color: "white",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    zIndex: 10,
                  }}
                >
                  Only {product.stock} left!
                </div>
              )}
              <div className="product-header-section">
                <h2 className="product-name-large">{product.name}</h2>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  <span className="category-badge">{product.category}</span>
                  {product.discount > 0 && (
                    <span className="discount-badge">
                      {product.discount}% OFF
                    </span>
                  )}
                  {product.freeShipping && (
                    <span className="shipping-badge">FREE SHIPPING</span>
                  )}
                </div>
              </div>
              <div className="product-info">
                <p className="description">{product.description}</p>

                <div className="rating-section">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i <
                          Math.round(getAverageRating(product.reviews || []))
                            ? "star filled"
                            : "star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">
                    {getAverageRating(product.reviews || [])} (
                    {(product.reviews || []).length} reviews)
                  </span>
                </div>

                <div className="product-footer">
                  <div className="price-container">
                    {product.originalPrice ? (
                      <>
                        <span className="original-price">
                          Rs. {product.originalPrice}
                        </span>
                        <span className="price">Rs. {product.price}</span>
                      </>
                    ) : (
                      <span className="price">Rs. {product.price}</span>
                    )}
                  </div>
                  <div className="product-buttons">
                    <button
                      className="review-btn full-width"
                      onClick={() => addToCart(product)}
                      style={{
                        background: isOutOfStock ? "#999" : "#0f2d1a",
                        cursor: isOutOfStock ? "not-allowed" : "pointer",
                      }}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                    <button
                      className="review-btn full-width"
                      onClick={() => addToFavorites(product)}
                      style={{
                        background: isFavorite(product.id)
                          ? "#ff5722"
                          : "#1a4d2e",
                      }}
                    >
                      {isFavorite(product.id) ? "❤️ Favorited" : "🤍 Favorite"}
                    </button>
                    <button
                      className="review-btn"
                      onClick={() => openReviewModal(product)}
                      style={{ background: "#2d5f3e" }}
                    >
                      Write Review
                    </button>
                    <button
                      className="review-btn"
                      onClick={() => openAllReviewsModal(product)}
                      style={{ background: "#3d6f4e" }}
                    >
                      Reviews ({(product.reviews || []).length})
                    </button>
                    <button
                      className="review-btn full-width"
                      onClick={() => openSellerChat(product)}
                      style={{ background: "#ff9800" }}
                    >
                      💬 Chat with Seller
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={closeReviewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Write a Review</h2>
              <button className="close-btn" onClick={closeReviewModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <h3>{selectedProduct?.name}</h3>

              <div className="rating-input">
                <label>Rating:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= rating
                          ? "star filled clickable"
                          : "star clickable"
                      }
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="review-input">
                <label>Your Review:</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows="5"
                />
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={closeReviewModal}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.8rem",
                    minWidth: "90px",
                    outline: "none",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={submitReview}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.8rem",
                    minWidth: "90px",
                    outline: "none",
                  }}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Reviews Modal */}
      {showAllReviewsModal && (
        <div className="modal-overlay" onClick={closeAllReviewsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>All Reviews - {selectedProduct?.name}</h2>
              <button className="close-btn" onClick={closeAllReviewsModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div
                className="rating-section"
                style={{ marginBottom: "1.5rem" }}
              >
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i <
                        Math.round(
                          getAverageRating(selectedProduct?.reviews || [])
                        )
                          ? "star filled"
                          : "star"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">
                  {getAverageRating(selectedProduct?.reviews || [])} (
                  {selectedProduct?.reviews?.length || 0} reviews)
                </span>
              </div>

              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {selectedProduct?.reviews?.length > 0 ? (
                  selectedProduct.reviews
                    .slice()
                    .reverse()
                    .map((review) => (
                      <div
                        key={review.id}
                        className="review-item"
                        style={{ marginBottom: "1rem" }}
                      >
                        <div className="review-header">
                          <strong>{review.userName}</strong>
                          <div className="review-stars">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < review.rating ? "star filled" : "star"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="review-text">{review.text}</p>
                        <span className="review-date">{review.date}</span>
                      </div>
                    ))
                ) : (
                  <p style={{ textAlign: "center", color: "#666" }}>
                    No reviews yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {showOrdersModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowOrdersModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "900px" }}
          >
            <div className="modal-header">
              <h2>My Orders</h2>
              <button
                className="close-btn"
                onClick={() => setShowOrdersModal(false)}
              >
                ×
              </button>
            </div>

            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              {orders.filter((order) => order.status !== "Cancelled").length ===
              0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "2rem",
                  }}
                >
                  No orders yet.
                </p>
              ) : (
                orders
                  .filter((order) => order.status !== "Cancelled")
                  .map((order) => {
                    const badge = getStatusBadge(order.status);
                    const progress = getProgressPercentage(order.status);
                    const canCancel = canCancelOrder(order);

                    return (
                      <div
                        key={order.orderId}
                        style={{
                          background: "white",
                          border: "2px solid #e8e8e8",
                          borderRadius: "12px",
                          padding: "1.5rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        {/* Order Header */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1rem",
                            paddingBottom: "1rem",
                            borderBottom: "2px solid #e8f5e9",
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                color: "#0f2d1a",
                                margin: "0 0 0.3rem 0",
                              }}
                            >
                              Order #{order.orderId.slice(-8)}
                            </h3>
                            <p
                              style={{
                                color: "#666",
                                fontSize: "0.9rem",
                                margin: 0,
                              }}
                            >
                              {formatOrderDate(order)}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div style={{ marginBottom: "1rem" }}>
                          <h4
                            style={{ color: "#0f2d1a", marginBottom: "0.8rem" }}
                          >
                            Items ({order.items.length})
                          </h4>
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "0.8rem",
                                background: "#f9f9f9",
                                borderRadius: "8px",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    fontWeight: "600",
                                    color: "#0f2d1a",
                                    margin: "0 0 0.3rem 0",
                                  }}
                                >
                                  {item.name}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.85rem",
                                    color: "#666",
                                    margin: 0,
                                  }}
                                >
                                  Qty: {item.quantity} | Seller:{" "}
                                  {item.sellerName || "Admin"}
                                </p>
                              </div>
                              <p
                                style={{
                                  fontWeight: "700",
                                  color: "#0f2d1a",
                                  margin: 0,
                                }}
                              >
                                Rs. {item.price * item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Information */}
                        {order.deliveryInfo && (
                          <div
                            style={{
                              marginBottom: "1rem",
                              background: "#f9f9f9",
                              padding: "1rem",
                              borderRadius: "8px",
                            }}
                          >
                            <h4
                              style={{
                                color: "#0f2d1a",
                                marginBottom: "0.5rem",
                                fontSize: "1rem",
                              }}
                            >
                              Delivery Address
                            </h4>
                            <p
                              style={{
                                margin: "0.3rem 0",
                                fontSize: "0.9rem",
                                color: "#666",
                              }}
                            >
                              <strong>Name:</strong>{" "}
                              {order.deliveryInfo.fullName}
                            </p>
                            <p
                              style={{
                                margin: "0.3rem 0",
                                fontSize: "0.9rem",
                                color: "#666",
                              }}
                            >
                              <strong>Phone:</strong> {order.deliveryInfo.phone}
                            </p>
                            <p
                              style={{
                                margin: "0.3rem 0",
                                fontSize: "0.9rem",
                                color: "#666",
                              }}
                            >
                              <strong>Address:</strong>{" "}
                              {order.deliveryInfo.address},{" "}
                              {order.deliveryInfo.city}
                            </p>
                          </div>
                        )}

                        {/* Order Status */}
                        <div
                          style={{
                            background: badge.color + "20",
                            padding: "1rem",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <span style={{ fontSize: "1.5rem" }}>
                              {badge.emoji}
                            </span>
                            <h4 style={{ color: badge.color, margin: 0 }}>
                              {badge.text}
                            </h4>
                          </div>
                          {order.status === "Confirmed" &&
                            order.confirmedAt && (
                              <p
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#666",
                                  margin: "0.3rem 0 0 0",
                                }}
                              >
                                Confirmed on{" "}
                                {new Date(order.confirmedAt).toLocaleString()}
                              </p>
                            )}
                          {order.status === "Delivered" &&
                            order.deliveredAt && (
                              <p
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#666",
                                  margin: "0.3rem 0 0 0",
                                }}
                              >
                                Delivered on{" "}
                                {new Date(order.deliveredAt).toLocaleString()}
                              </p>
                            )}
                          {order.status === "Completed" &&
                            order.completedAt && (
                              <p
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#666",
                                  margin: "0.3rem 0 0 0",
                                }}
                              >
                                Completed on{" "}
                                {new Date(order.completedAt).toLocaleString()}
                              </p>
                            )}
                          {order.status.includes("Cancelled") &&
                            order.cancellationReason && (
                              <p
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#666",
                                  margin: "0.5rem 0 0 0",
                                  padding: "0.5rem",
                                  background: "rgba(255,255,255,0.5)",
                                  borderRadius: "4px",
                                }}
                              >
                                <strong>Reason:</strong>{" "}
                                {order.cancellationReason}
                              </p>
                            )}
                        </div>

                        {/* Order Footer */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: "1rem",
                            borderTop: "2px solid #e8e8e8",
                            flexWrap: "wrap",
                            gap: "1rem",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontSize: "0.9rem",
                                color: "#666",
                                margin: "0 0 0.5rem 0",
                              }}
                            >
                              <strong>Payment:</strong> {order.paymentMethod}
                            </p>
                            <p
                              style={{
                                fontSize: "1.2rem",
                                fontWeight: "700",
                                color: "#0f2d1a",
                                margin: 0,
                              }}
                            >
                              Total: Rs. {order.amount}
                            </p>
                          </div>
                          <div>
                            {canCancelOrder(order) && (
                              <>
                                <button
                                  onClick={() => cancelOrder(order)}
                                  style={{
                                    background: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    padding: "0.7rem 1.5rem",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  Cancel Order
                                </button>
                                <small
                                  style={{
                                    display: "block",
                                    color: "#666",
                                    marginTop: "0.3rem",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  Can only cancel before seller confirmation
                                </small>
                              </>
                            )}
                            {order.status === "Confirmed" && (
                              <span
                                style={{
                                  color: "#4caf50",
                                  fontSize: "0.9rem",
                                  fontWeight: "600",
                                }}
                              >
                                Waiting for delivery...
                              </span>
                            )}
                            {(order.status === "Delivered" ||
                              order.status === "Completed") && (
                              <span
                                style={{
                                  color: "#28a745",
                                  fontSize: "0.9rem",
                                  fontWeight: "600",
                                }}
                              >
                                ✅ Order {order.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavoritesModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowFavoritesModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "900px" }}
          >
            <div className="modal-header">
              <h2>My Favorites ❤️</h2>
              <button
                className="close-btn"
                onClick={() => setShowFavoritesModal(false)}
              >
                ×
              </button>
            </div>
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              {favorites.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "2rem",
                  }}
                >
                  No favorites yet. Add products to your favorites!
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {favorites.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        background: "white",
                        border: "2px solid #e8e8e8",
                        borderRadius: "12px",
                        padding: "1rem",
                      }}
                    >
                      <h3
                        style={{
                          color: "#0f2d1a",
                          margin: "0 0 0.5rem 0",
                          fontSize: "1.1rem",
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "0.9rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {product.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.3rem",
                          marginBottom: "0.8rem",
                        }}
                      >
                        <span
                          className="category-badge"
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.6rem",
                          }}
                        >
                          {product.category}
                        </span>
                        {product.discount > 0 && (
                          <span className="discount-badge">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          color: "#0f2d1a",
                          marginBottom: "1rem",
                        }}
                      >
                        {product.originalPrice && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              fontSize: "0.9rem",
                              color: "#999",
                              marginRight: "0.5rem",
                            }}
                          >
                            Rs. {product.originalPrice}
                          </span>
                        )}
                        Rs. {product.price}
                      </p>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => addToCart(product)}
                          style={{
                            flex: 1,
                            background: "#0f2d1a",
                            color: "white",
                            border: "none",
                            padding: "0.6rem",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromFavorites(product.id)}
                          style={{
                            background: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "0.6rem 1rem",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Seller Chat Modal */}
      {showSellerChat && selectedSeller && (
        <SellerChat
          sellerId={selectedSeller.id}
          sellerName={selectedSeller.name}
          productName={selectedChatProduct}
          onClose={() => {
            setShowSellerChat(false);
            setSelectedSeller(null);
            setSelectedChatProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Marketplace;
