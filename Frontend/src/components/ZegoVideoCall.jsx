import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import "./ZegoVideoCall.css";

const ZegoVideoCall = ({ consultation, userType, onEnd }) => {
  const containerRef = useRef(null);
  const zpRef = useRef(null);

  const appID = 781762380;
  const serverSecret = "4e421ac82763fb73aa17c8056d5c3fc8";

  useEffect(() => {
    console.log("🎥 ZegoVideoCall component mounted");
    console.log("User Type:", userType);
    console.log("Consultation:", consultation);

    if (!consultation || !consultation.id) {
      console.error("❌ Invalid consultation data");
      alert("Invalid consultation data. Cannot start video call.");
      onEnd();
      return;
    }

    initializeCall();

    return () => {
      cleanup();
    };
  }, []);

  const initializeCall = async () => {
    try {
      const roomID = `plant_${consultation.id}`;
      const userID = `${userType}_${Date.now()}`;
      const userName =
        userType === "expert"
          ? "Plant Expert"
          : consultation.userName || "User";

      console.log("📞 Initializing call...");
      console.log("Room ID:", roomID);
      console.log("User ID:", userID);
      console.log("User Name:", userName);

      if (!containerRef.current) {
        throw new Error("Container ref not found");
      }

      // Generate Kit Token
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName
      );

      console.log("✅ Token generated");

      // Create instance
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      console.log("✅ ZegoUIKit instance created");

      // Join room with configuration
      await zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: false,
        onJoinRoom: () => {
          console.log("✅ Successfully joined room:", roomID);
        },
        onLeaveRoom: () => {
          console.log("👋 Left room");
          onEnd();
        },
        onUserJoin: (users) => {
          console.log("👥 User joined:", users);
        },
        onUserLeave: (users) => {
          console.log("👋 User left:", users);
        },
        onError: (error) => {
          console.error("❌ Zego error:", error);
        },
      });

      console.log("✅ Video call initialized successfully");
    } catch (error) {
      console.error("❌ Initialization error:", error);
      alert(
        `Failed to start video call: ${error.message}\n\nPlease check:\n1. Camera/microphone permissions\n2. Internet connection\n3. Browser compatibility (use Chrome/Firefox)`
      );
      onEnd();
    }
  };

  const cleanup = () => {
    console.log("🧹 Cleaning up video call...");

    if (zpRef.current) {
      try {
        zpRef.current.destroy();
        console.log("✅ Cleanup complete");
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    }
  };

  return (
    <div className="zego-video-container">
      <div ref={containerRef} className="zego-container" />

      <div className="consultation-info-overlay">
        <div className="info-badge">
          <p>
            <strong>
              {userType === "expert" ? "👨‍⚕️ Expert Mode" : "👤 User Mode"}
            </strong>
          </p>
          <p>📋 {consultation.categoryName}</p>
          <p>🕐 {consultation.slot}</p>
          <p>📅 {consultation.date}</p>
        </div>
      </div>
    </div>
  );
};

export default ZegoVideoCall;
