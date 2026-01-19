import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { updateConsultationStatus } from "../firebase/consultationService";
import "./VideoConsultation.css";

const VideoConsultation = ({ consultation, onEnd }) => {
  const { currentUser } = useAuth();
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    startCall();
    const durationInterval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      stopCall();
      clearInterval(durationInterval);
    };
  }, []);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      await updateConsultationStatus(consultation.id, "active");
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Please allow camera and microphone access to start the call");
    }
  };

  const stopCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    await updateConsultationStatus(consultation.id, "completed");
    stopCall();
    onEnd();
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: currentUser?.displayName || "You",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="video-consultation-container">
      <div className="consultation-header">
        <div className="header-info">
          <h3>Consultation with {consultation.expertName}</h3>
          <span className="call-duration">
            ⏱️ {formatDuration(callDuration)}
          </span>
        </div>
        <button className="end-call-btn" onClick={endCall}>
          End Call
        </button>
      </div>

      <div className="video-section">
        <div className="remote-video-container">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="remote-video"
          />
          <div className="video-placeholder">
            <div className="avatar-placeholder">
              <span>👨‍⚕️</span>
              <p>Waiting for expert to join...</p>
            </div>
          </div>
        </div>

        <div className="local-video-container">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="local-video"
          />
          {isVideoOff && (
            <div className="video-off-indicator">
              <span>📷 Camera Off</span>
            </div>
          )}
        </div>

        <div className="video-controls">
          <button
            className={`control-btn ${isMuted ? "active" : ""}`}
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <button
            className={`control-btn ${isVideoOff ? "active" : ""}`}
            onClick={toggleVideo}
            title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
          >
            {isVideoOff ? "📷" : "📹"}
          </button>
        </div>
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <h4>💬 Chat</h4>
        </div>
        <div className="chat-messages">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <strong>{msg.sender}:</strong> {msg.text}
              <span className="message-time">{msg.timestamp}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
