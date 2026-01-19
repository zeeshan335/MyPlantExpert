import React, { useEffect, useRef, useState } from "react";
import "./ZegoVideoCall.css";

const SimpleVideoCall = ({ consultation, userType, onEnd }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    startVideoCall();

    return () => {
      cleanup();
    };
  }, []);

  const startVideoCall = async () => {
    try {
      console.log("🎥 Starting video call...");

      // Request camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      console.log("✅ Media stream obtained");
      setLocalStream(stream);

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("✅ Local video playing");
      }

      setIsConnecting(false);
      setCallStarted(true);

      // Note: In production, you would set up WebRTC peer connection here
      // For now, just showing local video
    } catch (error) {
      console.error("❌ Video call error:", error);
      setIsConnecting(false);

      let message = "Failed to start video call.\n\n";

      if (error.name === "NotAllowedError") {
        message += "Please allow camera and microphone access.";
      } else if (error.name === "NotFoundError") {
        message += "No camera or microphone found.";
      } else {
        message += error.message;
      }

      alert(message);
      onEnd();
    }
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleMicrophone = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    cleanup();
    onEnd();
  };

  return (
    <div className="zego-video-container">
      {isConnecting && (
        <div className="connecting-overlay">
          <div className="spinner"></div>
          <p>Starting video call...</p>
        </div>
      )}

      <div className="video-call-header">
        <div className="call-info">
          <h2>Video Consultation</h2>
          <p className="consultation-category">{consultation.categoryName}</p>
        </div>

        <button className="end-call-button" onClick={endCall}>
          End Call
        </button>
      </div>

      <div className="video-container">
        <div className="local-video-wrapper">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="video-element local-video"
          />
          <div className="video-label">You</div>
        </div>

        <div className="remote-video-wrapper">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="video-element remote-video"
          />
          <div className="video-label">Expert</div>
          {!remoteStream && (
            <div className="waiting-message">
              <div className="spinner"></div>
              <p>Waiting for expert to join...</p>
            </div>
          )}
        </div>
      </div>

      <div className="appointment-details-panel">
        <h3 className="details-title">📋 Appointment Details</h3>

        <div className="detail-item">
          <span className="detail-label">Category:</span>
          <span className="detail-value">{consultation.categoryName}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Expert:</span>
          <span className="detail-value">{consultation.expertName}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Date:</span>
          <span className="detail-value">{consultation.date}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Time:</span>
          <span className="detail-value">{consultation.slot}</span>
        </div>
      </div>

      <div className="video-controls">
        <button
          className={`control-btn mic-btn ${!isMicOn ? "muted" : ""}`}
          onClick={toggleMicrophone}
        >
          {isMicOn ? "🎤 Mute" : "🔇 Unmute"}
        </button>
        <button
          className={`control-btn camera-btn ${!isCameraOn ? "off" : ""}`}
          onClick={toggleCamera}
        >
          {isCameraOn ? "📹 Stop Video" : "📷 Start Video"}
        </button>
        <button className="control-btn end-btn" onClick={endCall}>
          📞 End Call
        </button>
      </div>
    </div>
  );
};

export default SimpleVideoCall;
