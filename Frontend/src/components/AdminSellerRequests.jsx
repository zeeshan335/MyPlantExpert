import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./AdminSellerRequests.css";

const AdminSellerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const q = query(
        collection(db, "sellerRequests"),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      const requestsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestsData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (request) => {
    try {
      // Add to sellers collection
      await addDoc(collection(db, "sellers"), {
        ...request,
        status: "approved",
        approvedAt: new Date().toISOString(),
      });

      // Delete from sellerRequests
      await deleteDoc(doc(db, "sellerRequests", request.id));

      alert("Seller approved successfully!");
      fetchRequests();
    } catch (error) {
      console.error("Error approving seller:", error);
      alert("Failed to approve seller");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const requestRef = doc(db, "sellerRequests", requestId);
      await updateDoc(requestRef, {
        status: "rejected",
        rejectedAt: new Date().toISOString(),
      });

      alert("Seller request rejected");
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting seller:", error);
      alert("Failed to reject seller");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-seller-requests">
      <h2>Seller Registration Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <h3>{request.name}</h3>
              <p>
                <strong>Email:</strong> {request.email}
              </p>
              <p>
                <strong>Phone:</strong> {request.phone}
              </p>
              <p>
                <strong>Address:</strong> {request.address}
              </p>
              <p className="request-date">
                Requested: {new Date(request.createdAt).toLocaleDateString()}
              </p>
              <div className="request-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAccept(request)}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSellerRequests;
