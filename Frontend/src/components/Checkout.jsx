import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createOrder,
  clearCart,
  getCart,
  saveCart,
} from "../firebase/marketplaceService";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "../config/stripe";
import "./Checkout.css";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Card Payment Form Component
const CardPaymentForm = ({
  onPaymentSuccess,
  amount,
  deliveryInfo,
  currentUser,
  onProcessing,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);
    onProcessing(true);

    try {
      // Check if backend is running
      const healthCheck = await fetch("http://localhost:3001/");
      if (!healthCheck.ok) {
        throw new Error("Backend server is not responding");
      }

      // Create payment intent on backend
      const response = await fetch(
        "http://localhost:3001/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amount,
            currency: "pkr",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret, paymentIntentId } = await response.json();

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: deliveryInfo.fullName,
            email: currentUser.email,
            phone: deliveryInfo.phone,
            address: {
              line1: deliveryInfo.address,
              city: deliveryInfo.city,
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        onProcessing(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          onPaymentSuccess(result.paymentIntent.id);
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      if (err.message.includes("Failed to fetch")) {
        setError(
          "⚠️ Backend server is not running!\n\nPlease start the server:\n1. Open terminal in Backend folder\n2. Run: npm install\n3. Run: npm start\n\nOr use 'Cash on Delivery' option."
        );
      } else {
        setError(err.message || "Payment failed. Please try again.");
      }
      setProcessing(false);
      onProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-payment-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                fontFamily: '"Segoe UI", sans-serif',
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
                iconColor: "#9e2146",
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {error && (
        <div className="payment-error" style={{ whiteSpace: "pre-line" }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="test-card-info">
        <p className="test-card-title">Test Card Details:</p>
        <p>Card: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date</p>
        <p>CVC: Any 3 digits</p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="pay-button"
      >
        {processing ? "Processing Payment..." : `Pay Rs. ${amount}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    // Add class to body
    document.body.classList.add("checkout-page-active");

    if (!currentUser) {
      navigate("/login");
      return;
    }
    loadCart();

    // Cleanup
    return () => {
      document.body.classList.remove("checkout-page-active");
    };
  }, [currentUser, navigate]);

  const loadCart = async () => {
    if (currentUser?.email) {
      const cartData = await getCart(currentUser.email);
      setCart(cartData);
    }
  };

  const updateCartQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);

    if (currentUser?.email) {
      await saveCart(currentUser.email, updatedCart);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if (window.confirm("Remove this item from cart?")) {
      const updatedCart = cart.filter((item) => item.id !== productId);
      setCart(updatedCart);

      if (currentUser?.email) {
        await saveCart(currentUser.email, updatedCart);
      }
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (
      !deliveryInfo.fullName ||
      !deliveryInfo.email ||
      !deliveryInfo.phone ||
      !deliveryInfo.address ||
      !deliveryInfo.city
    ) {
      alert("Please fill in all delivery information");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(deliveryInfo.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (paymentIntentId = null) => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderData = {
        userEmail: currentUser.email,
        userName: currentUser.displayName || "Guest",
        items: cart.map((item) => ({
          productId: item.id,
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sellerId: item.sellerId || "admin",
          sellerName: item.sellerName || "Admin",
        })),
        amount: calculateTotal(),
        paymentMethod:
          paymentMethod === "cash" ? "Cash on Delivery" : "Card Payment",
        paymentStatus: paymentMethod === "cash" ? "Pending" : "Paid",
        paymentIntentId: paymentIntentId || null,
        deliveryInfo: deliveryInfo,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      const result = await createOrder(orderData);

      if (result.success) {
        await clearCart(currentUser.email);
        setCart([]);

        alert(
          "✅ Order placed successfully! Sellers will confirm your order soon."
        );
        navigate("/marketplace");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  const handlePaymentSuccess = (paymentIntentId) => {
    handlePlaceOrder(paymentIntentId);
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="checkout-page">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some plants to your cart to continue shopping</p>
          <button
            onClick={() => navigate("/marketplace")}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <button onClick={() => navigate("/marketplace")} className="back-btn">
          Back to Marketplace
        </button>

        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <div className="checkout-content">
          {/* Left Column - Order Summary */}
          <div className="order-summary-section">
            <div className="section-card">
              <h2>Order Summary</h2>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="quantity-display">
                          {item.quantity}
                        </span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-price-section">
                      <div className="item-price">
                        Rs. {item.price * item.quantity}
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Total Amount:</span>
                <span className="total-amount">Rs. {calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Delivery & Payment */}
          <div className="delivery-payment-section">
            {/* Delivery Information */}
            <div className="section-card">
              <h2>Delivery Information</h2>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                }}
              >
                Please provide your delivery details for order shipment
              </p>
              <div className="delivery-form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={deliveryInfo.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={deliveryInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="03XX-XXXXXXX"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Your city"
                    value={deliveryInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Complete Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="House #, Street, Area, Landmark"
                    value={deliveryInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="section-card">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label
                  className={`payment-option ${
                    paymentMethod === "cash" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p>Pay when you receive your order</p>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "card" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <div>
                      <strong>Card Payment (Stripe)</strong>
                      <p>Pay securely with your credit/debit card</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Show card payment form if card is selected */}
              {paymentMethod === "card" && (
                <div className="card-payment-container">
                  <Elements stripe={stripePromise}>
                    <CardPaymentForm
                      onPaymentSuccess={handlePaymentSuccess}
                      amount={calculateTotal()}
                      deliveryInfo={deliveryInfo}
                      currentUser={currentUser}
                      onProcessing={setPaymentProcessing}
                    />
                  </Elements>
                </div>
              )}

              {/* Show place order button only for cash on delivery */}
              {paymentMethod === "cash" && (
                <button
                  onClick={() => handlePlaceOrder()}
                  disabled={loading || paymentProcessing}
                  className="place-order-btn"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
