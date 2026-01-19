import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./AdminAnalytics.css";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalSellers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    monthlyRevenue: [],
    topProducts: [],
    topSellers: [],
    recentOrders: [],
    categoryDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch Users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const totalUsers = usersSnapshot.size;

      // Fetch Orders
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const orders = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "Pending").length;
      const completedOrders = orders.filter(
        (o) => o.status === "Completed" || o.status === "Delivered"
      ).length;
      const cancelledOrders = orders.filter((o) =>
        o.status.includes("Cancelled")
      ).length;

      // Calculate Total Revenue
      const totalRevenue = orders
        .filter((o) => o.status === "Completed" || o.status === "Delivered")
        .reduce((sum, order) => sum + (order.amount || 0), 0);

      // Fetch Products
      const productsSnapshot = await getDocs(collection(db, "products"));
      const products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const totalProducts = products.length;

      // Fetch Sellers
      const sellersSnapshot = await getDocs(collection(db, "sellers"));
      const totalSellers = sellersSnapshot.size;

      // Calculate Monthly Revenue (Last 6 Months)
      const monthlyData = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        monthlyData[monthKey] = 0;
      }

      orders
        .filter((o) => o.status === "Completed" || o.status === "Delivered")
        .forEach((order) => {
          const orderDate = new Date(order.createdAt);
          const monthKey = orderDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          if (monthlyData.hasOwnProperty(monthKey)) {
            monthlyData[monthKey] += order.amount || 0;
          }
        });

      const monthlyRevenue = Object.entries(monthlyData).map(
        ([month, revenue]) => ({ month, revenue })
      );

      // Calculate Top Products
      const productSales = {};
      orders
        .filter((o) => o.status === "Completed" || o.status === "Delivered")
        .forEach((order) => {
          (order.items || []).forEach((item) => {
            const productId = item.productId || item.id;
            if (!productSales[productId]) {
              productSales[productId] = {
                name: item.name,
                quantity: 0,
                revenue: 0,
              };
            }
            productSales[productId].quantity += item.quantity || 1;
            productSales[productId].revenue +=
              (item.price || 0) * (item.quantity || 1);
          });
        });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate Top Sellers
      const sellerSales = {};
      orders
        .filter((o) => o.status === "Completed" || o.status === "Delivered")
        .forEach((order) => {
          (order.items || []).forEach((item) => {
            const sellerId = item.sellerId || "admin";
            const sellerName = item.sellerName || "Admin";
            if (!sellerSales[sellerId]) {
              sellerSales[sellerId] = {
                name: sellerName,
                orders: 0,
                revenue: 0,
              };
            }
            sellerSales[sellerId].orders += 1;
            sellerSales[sellerId].revenue +=
              (item.price || 0) * (item.quantity || 1);
          });
        });

      const topSellers = Object.values(sellerSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Recent Orders
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((order) => ({
          id: order.id,
          date: order.createdAt,
          amount: order.amount || 0,
          status: order.status,
          items: order.items?.length || 0,
        }));

      // Category Distribution
      const categoryCount = {};
      products.forEach((product) => {
        const category = product.category || "Other";
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const categoryDistribution = Object.entries(categoryCount).map(
        ([category, count]) => ({ category, count })
      );

      setAnalytics({
        totalUsers,
        totalOrders,
        totalRevenue,
        totalProducts,
        totalSellers,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        monthlyRevenue,
        topProducts,
        topSellers,
        recentOrders,
        categoryDistribution,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-analytics">
        <h2>Loading Analytics...</h2>
      </div>
    );
  }

  return (
    <div className="admin-analytics">
      <div className="analytics-header">
        <h2>Performance Analytics Dashboard</h2>
        <p>Real-time insights and business metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">
              Rs. {analytics.totalRevenue.toFixed(0)}
            </p>
            <span className="metric-label">All time earnings</span>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-content">
            <h3>Total Orders</h3>
            <p className="metric-value">{analytics.totalOrders}</p>
            <span className="metric-label">All orders placed</span>
          </div>
        </div>

        <div className="metric-card users">
          <div className="metric-content">
            <h3>Total Users</h3>
            <p className="metric-value">{analytics.totalUsers}</p>
            <span className="metric-label">Registered users</span>
          </div>
        </div>

        <div className="metric-card products">
          <div className="metric-content">
            <h3>Total Products</h3>
            <p className="metric-value">{analytics.totalProducts}</p>
            <span className="metric-label">Available products</span>
          </div>
        </div>

        <div className="metric-card sellers">
          <div className="metric-content">
            <h3>Active Sellers</h3>
            <p className="metric-value">{analytics.totalSellers}</p>
            <span className="metric-label">Approved sellers</span>
          </div>
        </div>

        <div className="metric-card pending">
          <div className="metric-content">
            <h3>Pending Orders</h3>
            <p className="metric-value">{analytics.pendingOrders}</p>
            <span className="metric-label">Awaiting processing</span>
          </div>
        </div>

        <div className="metric-card completed">
          <div className="metric-content">
            <h3>Completed Orders</h3>
            <p className="metric-value">{analytics.completedOrders}</p>
            <span className="metric-label">Successfully delivered</span>
          </div>
        </div>

        <div className="metric-card cancelled">
          <div className="metric-content">
            <h3>Cancelled Orders</h3>
            <p className="metric-value">{analytics.cancelledOrders}</p>
            <span className="metric-label">Cancelled orders</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts-grid">
        {/* Monthly Revenue Chart */}
        <div className="chart-card full-width">
          <h3>Monthly Revenue (Last 6 Months)</h3>
          <div className="bar-chart">
            {analytics.monthlyRevenue.map((data, index) => {
              const maxRevenue = Math.max(
                ...analytics.monthlyRevenue.map((d) => d.revenue)
              );
              const height =
                maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;

              return (
                <div key={index} className="bar-item">
                  <div className="bar-value">Rs. {data.revenue.toFixed(0)}</div>
                  <div
                    className="bar"
                    style={{
                      height: `${Math.max(height, 5)}%`,
                      background:
                        "linear-gradient(135deg, #4caf50 0%, #2d7a3e 100%)",
                    }}
                  />
                  <div className="bar-label">{data.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="chart-card">
          <h3>Top Selling Products</h3>
          {analytics.topProducts.length > 0 ? (
            <div className="top-list">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="list-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="item-info">
                    <p className="item-name">{product.name}</p>
                    <p className="item-details">
                      {product.quantity} units • Rs.{" "}
                      {product.revenue.toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No sales data yet</p>
          )}
        </div>

        {/* Top Sellers */}
        <div className="chart-card">
          <h3>Top Performing Sellers</h3>
          {analytics.topSellers.length > 0 ? (
            <div className="top-list">
              {analytics.topSellers.map((seller, index) => (
                <div key={index} className="list-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="item-info">
                    <p className="item-name">{seller.name}</p>
                    <p className="item-details">
                      {seller.orders} orders • Rs. {seller.revenue.toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No seller data yet</p>
          )}
        </div>

        {/* Category Distribution */}
        <div className="chart-card">
          <h3>Product Categories</h3>
          {analytics.categoryDistribution.length > 0 ? (
            <div className="category-chart">
              {analytics.categoryDistribution.map((cat, index) => {
                const maxCount = Math.max(
                  ...analytics.categoryDistribution.map((c) => c.count)
                );
                const percentage = (cat.count / maxCount) * 100;

                return (
                  <div key={index} className="category-item">
                    <div className="category-label">{cat.category}</div>
                    <div className="category-bar-container">
                      <div
                        className="category-bar"
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="category-count">{cat.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No category data yet</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="chart-card">
          <h3>Recent Orders</h3>
          {analytics.recentOrders.length > 0 ? (
            <div className="recent-orders-list">
              {analytics.recentOrders.map((order, index) => (
                <div key={index} className="order-item">
                  <div className="order-info">
                    <p className="order-id">#{order.id.substring(0, 8)}</p>
                    <p className="order-date">
                      {new Date(order.date).toLocaleDateString()} •{" "}
                      {order.items} items
                    </p>
                  </div>
                  <div className="order-amount">
                    <span
                      className={`status-badge ${order.status
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                    >
                      {order.status}
                    </span>
                    <span className="amount">
                      Rs. {order.amount.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent orders</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
