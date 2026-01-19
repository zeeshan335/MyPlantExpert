import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  createConsultation,
  getUserConsultations,
  cancelConsultation,
  getActiveConsultations,
} from "../firebase/consultationService";
import "./ExpertConsultation.css";

// Helper function to convert time to 24-hour format for sorting
function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  // Convert hours to a number
  hours = parseInt(hours, 10);

  if (hours === 12) {
    hours = 0;
  }

  if (modifier === "PM") {
    hours = hours + 12;
  }

  // Convert hours back to string with leading zero if needed
  const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;

  return `${hoursStr}:${minutes}`;
}

const ExpertConsultation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  // Define states
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSlots, setShowSlots] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [bookingsFilter, setBookingsFilter] = useState("scheduled");

  // Text content
  const t = {
    title: "Expert Consultation",
    myBookings: "My Bookings",
    yourBookings: "Your Bookings",
    noBookingsYet: "You have no bookings yet.",
    category: "Category",
    date: "Date",
    time: "Time",
    cancel: "Cancel",
    introTitle: "Expert Plant Care Consultation",
    introText:
      "Select a category below and connect with our certified plant specialists",
    selectCategory: "Select a Category",
    select: "Select",
    categories: "Categories",
    selectExpert: "Select an Expert in",
    specialty: "Specialty",
    experience: "Experience",
    availableSlots: "time slots available",
    availableTimeSlots: "Available Time Slots for Today",
    noSlots: "No available slots for today. Please select another expert.",
    appointmentSuccess:
      "Appointment booked successfully. You will receive a WhatsApp call from the expert at your scheduled appointment time.",
    availableAppointments: "Available Appointments",
    bookAppointment: "Book Appointment",
    appointmentPrecautions: "Appointment Precautions",
    goodInternet:
      "Please make sure your WhatsApp number is active. You will receive a WhatsApp call from the expert at your scheduled appointment time.",
    quietEnvironment: "Find a quiet place for your consultation",
    plantReady: "Have your plant ready for the call",
    bookedSlots: "Booked Slots",
    availableSlots: "Available Slots",
    noAvailableSlots:
      "No available slots for today. Please check back tomorrow.",
    bookAppointmentBtn: "Book Appointment",
    appointmentBooked: "Appointment Booked Successfully",
    appointmentCancellation:
      "You can cancel this appointment up to 1 hour before the scheduled time",
    backToCategories: "Back to Categories",
    selectDate: "Select a Date",
    selectedDate: "Selected Date",
    availableSlotsFor: "Available Slots for",
    selectDateFirst: "Please select a date first to view available time slots",
    confirmDate: "View Available Slots",
    changeDate: "Change Date",
    noSlotsForDate:
      "No available slots for this date. Please select another date.",
    bookingFor: "Booking for",
    confirmBooking: "Confirm Booking",
    confirmationTitle: "Confirm Your Appointment",
    confirmationMessage: "Are you sure you want to book this appointment?",
    yes: "Yes, Book Now",
    no: "Cancel",
    bookingDetails: "Booking Details",
    whatsappNumber: "WhatsApp Number",
    whatsappPlaceholder: "+923001234567",
    scheduled: "Scheduled",
    completed: "Completed",
    all: "All",
  };

  // Expert categories and data
  const expertCategories = [
    {
      id: 1,
      name: "Plant Diseases",
      description: "Get help identifying and treating plant diseases",
      experts: [
        {
          id: 101,
          name: "Dr. Sarah Johnson",
          specialty: "Fungal Infections",
          experience: "12 years",
          image: "https://randomuser.me/api/portraits/women/44.jpg",
          slots: [
            "08:00 AM",
            "10:00 AM",
            "12:00 PM",
            "02:00 PM",
            "04:00 PM",
            "06:00 PM",
          ],
        },
        {
          id: 102,
          name: "Prof. Michael Chen",
          specialty: "Bacterial Diseases",
          experience: "8 years",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          slots: [
            "09:00 AM",
            "11:00 AM",
            "01:00 PM",
            "03:00 PM",
            "05:00 PM",
            "07:00 PM",
          ],
        },
        {
          id: 103,
          name: "Dr. Emma Wilson",
          specialty: "Viral Pathogens",
          experience: "15 years",
          image: "https://randomuser.me/api/portraits/women/66.jpg",
          slots: [
            "08:30 AM",
            "10:30 AM",
            "12:30 PM",
            "02:30 PM",
            "04:30 PM",
            "06:30 PM",
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Soil & Fertilizers",
      description: "Expert advice on soil health and fertilization",
      experts: [
        {
          id: 201,
          name: "Dr. Robert Taylor",
          specialty: "Soil Composition",
          experience: "10 years",
          image: "https://randomuser.me/api/portraits/men/52.jpg",
          slots: [
            "08:00 AM",
            "10:00 AM",
            "12:00 PM",
            "02:00 PM",
            "04:00 PM",
            "06:00 PM",
          ],
        },
        {
          id: 202,
          name: "Maria Garcia",
          specialty: "Organic Fertilizers",
          experience: "7 years",
          image: "https://randomuser.me/api/portraits/women/28.jpg",
          slots: ["09:30 AM", "12:30 PM", "03:30 PM", "06:30 PM"],
        },
      ],
    },
    {
      id: 3,
      name: "Watering",
      description: "Solutions for watering problems and techniques",
      experts: [
        {
          id: 301,
          name: "John Peterson",
          specialty: "Irrigation Systems",
          experience: "9 years",
          image: "https://randomuser.me/api/portraits/men/42.jpg",
          slots: [
            "08:00 AM",
            "10:00 AM",
            "12:00 PM",
            "02:00 PM",
            "04:00 PM",
            "06:00 PM",
          ],
        },
        {
          id: 302,
          name: "Linda Martinez",
          specialty: "Drought Resistant Plants",
          experience: "11 years",
          image: "https://randomuser.me/api/portraits/women/37.jpg",
          slots: ["09:30 AM", "12:30 PM", "03:30 PM", "06:30 PM"],
        },
      ],
    },
    {
      id: 4,
      name: "Organic Growth",
      description: "Natural gardening and plant care techniques",
      experts: [
        {
          id: 401,
          name: "Dr. Lisa Wong",
          specialty: "Organic Gardening",
          experience: "14 years",
          image: "https://randomuser.me/api/portraits/women/63.jpg",
          slots: ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"],
        },
        {
          id: 402,
          name: "Thomas Green",
          specialty: "Permaculture",
          experience: "12 years",
          image: "https://randomuser.me/api/portraits/men/76.jpg",
          slots: ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"],
        },
      ],
    },
    {
      id: 5,
      name: "Pest Control",
      description: "Solutions for insect and pest problems",
      experts: [
        {
          id: 501,
          name: "Dr. James Wilson",
          specialty: "Natural Pest Management",
          experience: "13 years",
          image: "https://randomuser.me/api/portraits/men/29.jpg",
          slots: [
            "08:00 AM",
            "10:00 AM",
            "12:00 PM",
            "02:00 PM",
            "04:00 PM",
            "06:00 PM",
          ],
        },
        {
          id: 502,
          name: "Emily Rodriguez",
          specialty: "Integrated Pest Management",
          experience: "8 years",
          image: "https://randomuser.me/api/portraits/women/12.jpg",
          slots: ["09:30 AM", "12:30 PM", "03:30 PM", "06:30 PM"],
        },
      ],
    },
    {
      id: 6,
      name: "Hydroponics",
      description: "Growing plants without soil and water solutions",
      experts: [
        {
          id: 601,
          name: "Dr. Alex Thompson",
          specialty: "Hydroponic Systems",
          experience: "15 years",
          image: "https://randomuser.me/api/portraits/men/67.jpg",
          slots: [
            "08:00 AM",
            "10:00 AM",
            "12:00 PM",
            "02:00 PM",
            "04:00 PM",
            "06:00 PM",
          ],
        },
        {
          id: 602,
          name: "Sophia Kim",
          specialty: "Nutrient Solutions",
          experience: "10 years",
          image: "https://randomuser.me/api/portraits/women/79.jpg",
          slots: [
            "09:00 AM",
            "11:00 AM",
            "01:00 PM",
            "03:00 PM",
            "05:00 PM",
            "07:00 PM",
          ],
        },
      ],
    },
    {
      id: 7,
      name: "Cross Breeding",
      description: "Create new plant varieties through hybridization",
      experts: [
        {
          id: 701,
          name: "Dr. Olivia Bennett",
          specialty: "Flower Hybridization",
          experience: "17 years",
          image: "https://randomuser.me/api/portraits/women/35.jpg",
          slots: ["08:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "06:00 PM"],
        },
        {
          id: 702,
          name: "Prof. Samuel Wright",
          specialty: "Vegetable Breeding",
          experience: "14 years",
          image: "https://randomuser.me/api/portraits/men/41.jpg",
          slots: ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"],
        },
      ],
    },
    {
      id: 8,
      name: "Indoor Plants",
      description: "Specialized care for houseplants and indoor gardens",
      experts: [
        {
          id: 801,
          name: "Jennifer Murphy",
          specialty: "Tropical Houseplants",
          experience: "11 years",
          image: "https://randomuser.me/api/portraits/women/18.jpg",
          slots: [
            "08:00 AM",
            "10:00 AM",
            "12:00 PM",
            "02:00 PM",
            "04:00 PM",
            "06:00 PM",
          ],
        },
        {
          id: 802,
          name: "David Lee",
          specialty: "Low Light Plants",
          experience: "9 years",
          image: "https://randomuser.me/api/portraits/men/55.jpg",
          slots: ["09:30 AM", "12:30 PM", "03:30 PM", "06:30 PM"],
        },
      ],
    },
    {
      id: 9,
      name: "Landscaping",
      description: "Design and maintain beautiful garden landscapes",
      experts: [
        {
          id: 901,
          name: "Adam Carter",
          specialty: "Garden Design",
          experience: "16 years",
          image: "https://randomuser.me/api/portraits/men/86.jpg",
          slots: ["08:30 AM", "11:00 AM", "02:00 PM", "04:30 PM"],
        },
        {
          id: 902,
          name: "Michelle Foster",
          specialty: "Sustainable Landscaping",
          experience: "13 years",
          image: "https://randomuser.me/api/portraits/women/49.jpg",
          slots: ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"],
        },
      ],
    },
    {
      id: 10,
      name: "Seasonal Care",
      description: "Prepare your garden for different seasons",
      experts: [
        {
          id: 1001,
          name: "Patricia Collins",
          specialty: "Winter Protection",
          experience: "12 years",
          image: "https://randomuser.me/api/portraits/women/71.jpg",
          slots: ["08:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "06:00 PM"],
        },
        {
          id: 1002,
          name: "Dr. Kevin Russell",
          specialty: "Seasonal Transitions",
          experience: "10 years",
          image: "https://randomuser.me/api/portraits/men/23.jpg",
          slots: ["09:00 AM", "12:30 PM", "03:30 PM", "06:30 PM"],
        },
      ],
    },
  ];

  const visibleCategories = [
    "Plant Diseases",
    "Soil & Fertilizers",
    "Pest Control",
    "Hydroponics",
    "Cross Breeding",
  ]
    .map((name) => expertCategories.find((c) => c.name === name))
    .filter(Boolean);

  const STORAGE_KEY = "plantExpertBookings";

  // Load data from localStorage on component mount with better error handling
  useEffect(() => {
    try {
      // Log the current localStorage state for debugging
      const storageValue = localStorage.getItem(STORAGE_KEY);
      console.log("Raw localStorage value:", storageValue);

      // Try to parse bookings from localStorage
      if (storageValue) {
        try {
          const parsedBookings = JSON.parse(storageValue);
          console.log("Parsed bookings:", parsedBookings);

          if (Array.isArray(parsedBookings)) {
            // Update bookings state with localStorage data
            setBookings(parsedBookings);
            console.log("Bookings loaded successfully:", parsedBookings.length);
          } else {
            console.warn("Stored bookings is not an array");
            // Initialize with empty array
            setBookings([]);
          }
        } catch (parseError) {
          console.error("Error parsing bookings:", parseError);
          // Reset if parsing fails
          setBookings([]);
        }
      } else {
        // No bookings found in localStorage
        console.log("No bookings found in localStorage");
        setBookings([]);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setBookings([]);
    }

    // Mark loading as complete
    setLoadingComplete(true);
  }, []); // Run only once on component mount

  // Debug effect to log bookings when they change
  useEffect(() => {
    if (loadingComplete) {
      console.log("Current bookings state:", bookings);
    }
  }, [bookings, loadingComplete]);

  // Save to localStorage whenever bookings change, with more robust error handling
  useEffect(() => {
    if (bookings && Array.isArray(bookings)) {
      try {
        const bookingsJSON = JSON.stringify(bookings);
        localStorage.setItem(STORAGE_KEY, bookingsJSON);
        console.log("Saved bookings to localStorage:", bookingsJSON);
      } catch (error) {
        console.error("Failed to save bookings to localStorage:", error);
      }
    }
  }, [bookings]);

  // Load consultations from Firebase
  useEffect(() => {
    if (currentUser?.email) {
      loadConsultationsFromFirebase();
      checkForActiveConsultations();
    }
  }, [currentUser]);

  const loadConsultationsFromFirebase = async () => {
    if (!currentUser?.email) return;

    try {
      const consultations = await getUserConsultations(currentUser.email);
      const activeConsultations = consultations.filter(
        (c) => c.status !== "cancelled"
      );
      setBookings(
        activeConsultations.map((c) => ({
          id: c.id,
          categoryName: c.categoryName,
          slot: c.slot,
          date: c.date,
          status: c.status,
          whatsappNumber: c.whatsappNumber || "",
          expertReport: c.expertReport || null,
          completedAt: c.completedAt || null,
          completedBy: c.completedBy || null,
          userReview: c.userReview || null,
          userRating: c.userRating || 0,
          reviewedAt: c.reviewedAt || null,
        }))
      );
      console.log("✅ Loaded active bookings:", activeConsultations.length);
    } catch (error) {
      console.error("Error loading consultations:", error);
    } finally {
      setLoadingComplete(true);
    }
  };

  // Check for active consultations every minute
  useEffect(() => {
    if (!currentUser?.email) return;

    const checkInterval = setInterval(() => {
      checkForActiveConsultations();
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [currentUser, bookings]);

  const checkForActiveConsultations = async () => {
    if (!currentUser?.email) return;

    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const currentDate = now.toISOString().split("T")[0];

    console.log("🕐 Checking for active consultations...");
    console.log("Current time:", currentTime);
    console.log("Current date:", currentDate);

    // Find consultation that should be active now
    const activeBooking = bookings.find((booking) => {
      if (booking.status === "cancelled" || booking.status === "completed") {
        return false;
      }

      const bookingTime = convertTo24Hour(booking.slot);
      const currentTimeIn24 = convertTo24Hour(currentTime);

      const timeDiff = Math.abs(
        parseInt(bookingTime.replace(":", "")) -
          parseInt(currentTimeIn24.replace(":", ""))
      );

      console.log("📋 Booking:", booking.slot, "on", booking.date);
      console.log("⏰ Time difference:", timeDiff);

      // Changed from 5 to 60 for testing (1 hour window)
      return booking.date === currentDate && timeDiff <= 60;
    });

    console.log("🎯 Active booking found:", activeBooking);

    // Set active consultation but don't auto-start video call
    if (activeBooking && !activeConsultation) {
      setActiveConsultation(activeBooking);
      console.log("✅ Appointment ready to join:", activeBooking);
    } else if (!activeBooking && activeConsultation) {
      setActiveConsultation(null);
    }
  };

  // Function to manually join video call
  const joinVideoCall = () => {
    console.log("🎥 Join Video Call clicked");
    console.log("Active consultation:", activeConsultation);

    if (activeConsultation) {
      setShowVideoCall(true);
    } else {
      // If no active consultation in state, allow joining anyway for scheduled appointments
      setShowVideoCall(true);
    }
  };

  // Modified function to join specific booking
  const joinSpecificBooking = (booking) => {
    console.log("🎥 Joining consultation:", booking);
    setActiveConsultation(booking);
    setShowVideoCall(true);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedExpert(null);
    setSelectedDate(null);
    setShowSlots(false);
    setSuccessMessage("");
  };

  // Handle expert selection
  const handleExpertSelect = (expert) => {
    setSelectedExpert(expert);
    setSuccessMessage("");
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowSlots(false);
    setSuccessMessage("");
  };

  // Confirm date and show slots
  const confirmDateSelection = () => {
    if (selectedDate) {
      setShowSlots(true);
    }
  };

  // Handle slot click
  const handleSlotClick = (slot, expertId) => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    setPendingBooking({
      slot,
      categoryName: activeCategory.name,
      date: selectedDate.toISOString().split("T")[0],
    });
    setWhatsappNumber("");
    setShowConfirmation(true);
  };

  // Validate WhatsApp number format
  const validateWhatsappNumber = (number) => {
    // Remove all spaces and special characters except +
    const cleanNumber = number.replace(/[^\d+]/g, "");

    // Check if starts with +
    if (!cleanNumber.startsWith("+")) {
      return {
        valid: false,
        message: "WhatsApp number must start with + (e.g., +923001234567)",
      };
    }

    // Check if it's a valid international format
    // Must be: + followed by 1-3 digit country code, then 6-14 digits
    const internationalFormat = /^\+\d{1,3}\d{6,14}$/;
    if (!internationalFormat.test(cleanNumber)) {
      return {
        valid: false,
        message:
          "Invalid WhatsApp number format. Must be 7-15 digits after country code.",
      };
    }

    // Specific validation for Pakistan numbers (+92)
    if (cleanNumber.startsWith("+92")) {
      // Pakistan mobile numbers: +92 followed by 10 digits (3XX XXXXXXX)
      const pakistanFormat = /^\+92\d{10}$/;
      if (!pakistanFormat.test(cleanNumber)) {
        return {
          valid: false,
          message:
            "Invalid Pakistan number. Format: +92 followed by 10 digits (e.g., +923001234567)",
        };
      }
    }

    // Check total length (country code + number should be between 8 and 15 digits)
    const totalDigits = cleanNumber.substring(1).length; // Exclude the + sign
    if (totalDigits < 7 || totalDigits > 15) {
      return {
        valid: false,
        message:
          "WhatsApp number must be between 8-16 characters including country code.",
      };
    }

    return { valid: true, message: "" };
  };

  // Format WhatsApp number as user types
  const formatWhatsappInput = (value) => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, "");

    // Ensure only one + at the beginning
    if (cleaned.indexOf("+") > 0) {
      cleaned = "+" + cleaned.replace(/\+/g, "");
    }

    // If user types a number without +, add it
    if (cleaned.length > 0 && !cleaned.startsWith("+")) {
      cleaned = "+" + cleaned;
    }

    return cleaned;
  };

  // Confirm and book appointment
  const confirmBooking = async () => {
    console.log("🎯 confirmBooking called");
    console.log("pendingBooking:", pendingBooking);
    console.log("currentUser:", currentUser);
    console.log("whatsappNumber:", whatsappNumber);

    if (!pendingBooking || !currentUser?.email) {
      console.error("❌ Missing pendingBooking or currentUser");
      alert("Please login to book appointment");
      return;
    }

    if (!whatsappNumber.trim()) {
      alert("Please enter your WhatsApp number");
      return;
    }

    // Validate WhatsApp number with detailed error message
    const validation = validateWhatsappNumber(whatsappNumber);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const bookingDate = pendingBooking.date;
    const hasBookingForDate = bookings.some((b) => b.date === bookingDate);

    if (hasBookingForDate) {
      alert(
        "You already have a booking for this date. You can only book one consultation per day."
      );
      setShowConfirmation(false);
      setPendingBooking(null);
      setWhatsappNumber("");
      return;
    }

    const consultationData = {
      categoryName: pendingBooking.categoryName,
      slot: pendingBooking.slot,
      date: bookingDate,
      userEmail: currentUser.email,
      userName: currentUser.displayName || "User",
      whatsappNumber: whatsappNumber.trim(),
      status: "scheduled",
    };

    console.log("📤 Sending consultation data:", consultationData);

    try {
      const consultationId = await createConsultation(consultationData);
      console.log("📥 Received consultation ID:", consultationId);

      if (consultationId) {
        console.log("✅ Booking successful! Reloading consultations...");
        await loadConsultationsFromFirebase();

        setSuccessMessage(
          "Appointment booked successfully. You will receive a WhatsApp call from the expert at your scheduled appointment time."
        );

        setSelectedExpert({ bookedSlot: pendingBooking.slot });
      } else {
        console.error("❌ No consultation ID returned");
        alert("Failed to book appointment. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error in confirmBooking:", error);
      alert("An error occurred. Please try again.");
    }

    setShowConfirmation(false);
    setPendingBooking(null);
    setWhatsappNumber("");
  };

  // Cancel booking confirmation
  const cancelBookingConfirmation = () => {
    setShowConfirmation(false);
    setPendingBooking(null);
    setWhatsappNumber("");
  };

  // Cancel appointment
  const cancelAppointment = async (bookingId) => {
    console.log("🔴 Cancel appointment called for:", bookingId);

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      console.error("❌ Booking not found:", bookingId);
      return;
    }

    console.log("📋 Booking found:", booking);

    // Confirm cancellation FIRST
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
      console.log("❌ User cancelled the cancellation");
      return;
    }

    // Check if consultation can be cancelled (1 hour before)
    try {
      const now = new Date();

      // Parse the date and time
      const [year, month, day] = booking.date.split("-").map(Number);
      const [timeStr, period] = booking.slot.split(" ");
      const [hours, minutes] = timeStr.split(":").map(Number);

      // Convert to 24-hour format
      let hour24 = hours;
      if (period === "PM" && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === "AM" && hours === 12) {
        hour24 = 0;
      }

      // Create booking datetime
      const bookingDateTime = new Date(year, month - 1, day, hour24, minutes);
      console.log("⏰ Booking time:", bookingDateTime);
      console.log("⏰ Current time:", now);

      const timeDiff = (bookingDateTime - now) / (1000 * 60); // minutes
      console.log("⏱️ Time difference (minutes):", timeDiff);

      if (timeDiff < 60 && timeDiff >= 0) {
        alert(
          "Cannot cancel appointment less than 1 hour before scheduled time."
        );
        return;
      }
    } catch (timeError) {
      console.error("⚠️ Time check error:", timeError);
      // If time check fails, allow cancellation (better UX)
    }

    console.log("🔄 Proceeding with cancellation...");

    try {
      const success = await cancelConsultation(bookingId);
      console.log("📥 Cancellation result:", success);

      if (success) {
        console.log("✅ Cancellation successful!");

        // Immediately remove from local state
        setBookings((prevBookings) =>
          prevBookings.filter((b) => b.id !== bookingId)
        );

        setSuccessMessage("Appointment cancelled successfully.");

        // Also reload from Firebase to ensure sync
        setTimeout(() => {
          loadConsultationsFromFirebase();
        }, 500);
      } else {
        console.error("❌ Cancellation failed");
        alert("Failed to cancel appointment. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error in cancelAppointment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleVideoCallEnd = () => {
    loadConsultationsFromFirebase();
  };

  // Review Modal Functions
  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please write a review");
      return;
    }

    setSubmittingReview(true);

    try {
      const { updateDoc, doc } = await import("firebase/firestore");
      const { db } = await import("../firebase/firebase");

      const consultationRef = doc(
        db,
        "consultations",
        selectedBookingForReview.id
      );

      await updateDoc(consultationRef, {
        userReview: reviewText,
        userRating: rating,
        reviewedAt: new Date().toISOString(),
        reviewedBy: currentUser.displayName || currentUser.email,
      });

      alert("✅ Review submitted successfully!");

      await loadConsultationsFromFirebase();

      setShowReviewModal(false);
      setSelectedBookingForReview(null);
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("❌ Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setRating(booking.userRating || 0);
    setReviewText(booking.userReview || "");
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBookingForReview(null);
    setRating(0);
    setReviewText("");
  };

  // Get filtered bookings
  const getFilteredBookings = () => {
    if (bookingsFilter === "all") return bookings;
    return bookings.filter((b) => b.status === bookingsFilter);
  };

  // Check if slot is available
  const isSlotAvailable = (expert, slot) => {
    if (!selectedDate) return true;
    const dateStr = selectedDate.toISOString().split("T")[0];
    return !bookings.some((b) => b.slot === slot && b.date === dateStr);
  };

  // Get category description
  const getCategoryDescription = (category) => {
    const shortDescriptions = {
      "Plant Diseases":
        "Identify and treat various plant diseases and infections",
      "Soil & Fertilizers":
        "Optimize soil health and choose the right fertilizers",
      "Pest Control": "Effective solutions for insect and pest problems",
      Hydroponics: "Grow plants without soil using water-based solutions",
      "Cross Breeding": "Create new plant varieties through hybridization",
    };

    return shortDescriptions[category.name] || category.description;
  };

  const getMinDate = () => new Date();

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show video consultation if active - REMOVED

  if (!loadingComplete) {
    return (
      <div className="expert-consultation-container">
        <div className="loading-message">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="expert-consultation-container">
      {!showBookings && (
        <div className="header-section">
          <button
            className="expert-portal-btn"
            onClick={() => navigate("/expert-login")}
            style={{
              background: "linear-gradient(135deg, #1a4d2e 0%, #2e7d32 100%)",
              color: "white",
              border: "none",
              padding: "0.6rem 1.2rem",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              position: "absolute",
              left: 0,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
            }}
          >
            🎓 Expert Portal
          </button>
          <h1>{t.title}</h1>
        </div>
      )}

      {!showBookings && <div className="divider"></div>}

      {!showBookings && (
        <div className="actions-container">
          <button
            className="action-btn active"
            onClick={() => setShowBookings(true)}
            style={{
              background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              boxShadow: "0 2px 8px rgba(46, 125, 50, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(46, 125, 50, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(46, 125, 50, 0.3)";
            }}
          >
            {t.myBookings} ({bookings.length})
          </button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && pendingBooking && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>{t.confirmationTitle}</h3>
            <div className="confirmation-content">
              <p className="confirmation-question">{t.confirmationMessage}</p>
              <div className="booking-preview">
                <h4>{t.bookingDetails}</h4>
                <p>
                  <strong>{t.category}:</strong> {pendingBooking.categoryName}
                </p>
                <p>
                  <strong>{t.date}:</strong> {formatDate(selectedDate)}
                </p>
                <p>
                  <strong>{t.time}:</strong> {pendingBooking.slot}
                </p>
                <div className="whatsapp-input-section">
                  <label>
                    <strong>{t.whatsappNumber}:</strong>{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) =>
                      setWhatsappNumber(formatWhatsappInput(e.target.value))
                    }
                    placeholder={t.whatsappPlaceholder}
                    className="whatsapp-input"
                    maxLength="16"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      marginTop: "0.5rem",
                    }}
                  />
                  <small
                    style={{
                      display: "block",
                      marginTop: "0.5rem",
                      color: "#666",
                    }}
                  >
                    Enter with country code (e.g., +923001234567 for Pakistan)
                    <br />
                    Format: +[country code][number] (8-16 digits total)
                  </small>
                </div>
              </div>
            </div>
            <div className="confirmation-buttons">
              <button className="confirm-yes-btn" onClick={confirmBooking}>
                {t.yes}
              </button>
              <button
                className="confirm-no-btn"
                onClick={cancelBookingConfirmation}
              >
                {t.no}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="content-section">
        {showBookings ? (
          <div className="bookings-container">
            <h2>{t.yourBookings}</h2>
            <div className="divider-sm"></div>

            <div className="navigation-buttons">
              <button
                className="back-btn"
                onClick={() => {
                  setShowBookings(false);
                  setActiveCategory(null);
                  setSelectedExpert(null);
                  setSelectedDate(null);
                  setShowSlots(false);
                }}
              >
                {t.backToCategories}
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs" style={{ marginBottom: "1.5rem" }}>
              <button
                className={bookingsFilter === "all" ? "active" : ""}
                onClick={() => setBookingsFilter("all")}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  marginRight: "0.5rem",
                  cursor: "pointer",
                  background: bookingsFilter === "all" ? "#2e7d32" : "#e0e0e0",
                  color: bookingsFilter === "all" ? "white" : "#333",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
              >
                {t.all} ({bookings.length})
              </button>
              <button
                className={bookingsFilter === "scheduled" ? "active" : ""}
                onClick={() => setBookingsFilter("scheduled")}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  marginRight: "0.5rem",
                  cursor: "pointer",
                  background:
                    bookingsFilter === "scheduled" ? "#2e7d32" : "#e0e0e0",
                  color: bookingsFilter === "scheduled" ? "white" : "#333",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
              >
                {t.scheduled} (
                {bookings.filter((b) => b.status === "scheduled").length})
              </button>
              <button
                className={bookingsFilter === "completed" ? "active" : ""}
                onClick={() => setBookingsFilter("completed")}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background:
                    bookingsFilter === "completed" ? "#2e7d32" : "#e0e0e0",
                  color: bookingsFilter === "completed" ? "white" : "#333",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
              >
                {t.completed} (
                {bookings.filter((b) => b.status === "completed").length})
              </button>
            </div>

            {getFilteredBookings().length === 0 ? (
              <p className="no-bookings">
                {bookingsFilter === "all"
                  ? t.noBookingsYet
                  : `No ${bookingsFilter} bookings found.`}
              </p>
            ) : (
              <div className="booking-list">
                {getFilteredBookings().map((booking) => {
                  return (
                    <div
                      className="booking-card"
                      key={booking.id}
                      style={{
                        background: "white",
                        border: "1px solid #e0e0e0",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        marginBottom: "1rem",
                      }}
                    >
                      <div className="booking-info">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h3
                            style={{ color: "#1a4d2e", marginBottom: "1rem" }}
                          >
                            {booking.categoryName} {t.bookAppointment}
                          </h3>
                          <span
                            style={{
                              background:
                                booking.status === "completed"
                                  ? "#4caf50"
                                  : "#2196f3",
                              color: "white",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "20px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >
                            {booking.status === "completed"
                              ? "✓ Completed"
                              : "📅 Scheduled"}
                          </span>
                        </div>
                        <p>
                          <strong>{t.date}:</strong> {booking.date}
                        </p>
                        <p>
                          <strong>{t.time}:</strong> {booking.slot}
                        </p>
                        <p>
                          <strong>{t.whatsappNumber}:</strong>{" "}
                          {booking.whatsappNumber}
                        </p>

                        {booking.status === "scheduled" && (
                          <div className="appointment-note">
                            <p>{t.appointmentCancellation}</p>
                          </div>
                        )}
                      </div>

                      {booking.status === "scheduled" && (
                        <div className="booking-actions">
                          <button
                            className="cancel-btn"
                            onClick={() => cancelAppointment(booking.id)}
                          >
                            {t.cancel}
                          </button>
                        </div>
                      )}

                      {/* Show Expert Report if completed */}
                      {booking.status === "completed" &&
                        booking.expertReport && (
                          <div className="user-expert-report">
                            <h4>📋 Expert Consultation Report</h4>
                            <div className="report-content">
                              <p>{booking.expertReport}</p>
                            </div>
                            {booking.completedAt && (
                              <small className="report-date">
                                Completed on:{" "}
                                {new Date(booking.completedAt).toLocaleString()}
                              </small>
                            )}
                          </div>
                        )}

                      {/* Review Section for Completed Appointments */}
                      {booking.status === "completed" && (
                        <div className="review-section">
                          {booking.userReview ? (
                            <div className="submitted-review">
                              <h4>⭐ Your Review</h4>
                              <div className="rating-display">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={
                                      star <= booking.userRating
                                        ? "star-filled"
                                        : "star-empty"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <p className="review-text">
                                {booking.userReview}
                              </p>
                              <small>
                                Reviewed on:{" "}
                                {new Date(booking.reviewedAt).toLocaleString()}
                              </small>
                            </div>
                          ) : (
                            <button
                              className="review-btn"
                              onClick={() => openReviewModal(booking)}
                            >
                              ⭐ Write a Review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="consultation-content">
            {!activeCategory ? (
              <>
                <div className="intro-text">
                  <h2>{t.introTitle}</h2>
                  <p>{t.introText}</p>
                  <div className="divider-sm"></div>
                </div>

                <div className="categories-container">
                  <h2>{t.selectCategory}</h2>
                  <div className="category-grid">
                    {visibleCategories.map((category) => (
                      <div
                        className="category-card"
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                      >
                        <div className="card-content">
                          <h3>{category.name}</h3>
                          <p className="category-description">
                            {getCategoryDescription(category)}
                          </p>
                        </div>
                        <div className="card-button">{t.select}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : !selectedExpert ? (
              <>
                <div className="breadcrumb">
                  <span
                    onClick={() => {
                      setActiveCategory(null);
                      setSelectedDate(null);
                      setShowSlots(false);
                    }}
                  >
                    {t.categories}
                  </span>{" "}
                  &gt; {activeCategory.name}
                </div>
                <h2>
                  {t.bookAppointment} - {activeCategory.name}
                </h2>
                <div className="divider-sm"></div>

                <div className="appointment-precautions">
                  <h3>{t.appointmentPrecautions}</h3>
                  <ul>
                    <li>
                      <span className="precaution-number">1</span>{" "}
                      {t.goodInternet}
                    </li>
                    <li>
                      <span className="precaution-number">2</span>{" "}
                      {t.quietEnvironment}
                    </li>
                    <li>
                      <span className="precaution-number">3</span>{" "}
                      {t.plantReady}
                    </li>
                  </ul>
                </div>

                <div className="divider-sm"></div>

                {/* Date Picker Section - Always show first */}
                <div className="date-picker-section">
                  <h3>{t.selectDate}</h3>
                  <div className="date-picker-wrapper">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateSelect}
                      minDate={getMinDate()}
                      maxDate={getMaxDate()}
                      inline
                      dateFormat="yyyy-MM-dd"
                      className="custom-datepicker"
                    />
                  </div>

                  {selectedDate && !showSlots && (
                    <div className="date-confirmation">
                      <p className="selected-date-display">
                        <strong>{t.selectedDate}:</strong>{" "}
                        {formatDate(selectedDate)}
                      </p>
                      <button
                        className="confirm-date-btn"
                        onClick={confirmDateSelection}
                      >
                        {t.confirmDate}
                      </button>
                    </div>
                  )}

                  {showSlots && selectedDate && (
                    <div className="change-date-section">
                      <p className="selected-date-display">
                        <strong>{t.bookingFor}:</strong>{" "}
                        {formatDate(selectedDate)}
                      </p>
                      <button
                        className="change-date-btn"
                        onClick={() => setShowSlots(false)}
                      >
                        {t.changeDate}
                      </button>
                    </div>
                  )}
                </div>

                {/* Time Slots Section - Only show after date confirmation */}
                {showSlots && selectedDate && (
                  <>
                    <div className="divider-sm"></div>
                    <div className="slots-container">
                      <div className="slots-header">
                        <h3>
                          {t.availableSlotsFor} {formatDate(selectedDate)}
                        </h3>
                      </div>

                      <div className="time-slots-grid">
                        {(() => {
                          const dateStr = selectedDate
                            .toISOString()
                            .split("T")[0];
                          const hasBookingForDate = bookings.some(
                            (b) => b.date === dateStr
                          );

                          if (hasBookingForDate) {
                            return (
                              <p className="already-booked-message">
                                You already have a booking scheduled for this
                                date. Check your bookings.
                              </p>
                            );
                          }

                          const allSlots = [];
                          activeCategory.experts.forEach((expert) => {
                            expert.slots.forEach((slot) => {
                              if (isSlotAvailable(expert, slot)) {
                                allSlots.push({
                                  slot,
                                });
                              }
                            });
                          });

                          allSlots.sort((a, b) => {
                            const timeA = convertTo24Hour(a.slot);
                            const timeB = convertTo24Hour(b.slot);
                            return timeA.localeCompare(timeB);
                          });

                          if (allSlots.length === 0) {
                            return (
                              <p className="no-slots-message">
                                {t.noSlotsForDate}
                              </p>
                            );
                          }

                          return allSlots.map((item, index) => (
                            <button
                              key={`${item.slot}-${index}`}
                              className="time-slot-btn"
                              onClick={() => handleSlotClick(item.slot, null)}
                            >
                              <span className="slot-time">{item.slot}</span>
                            </button>
                          ));
                        })()}
                      </div>
                    </div>
                  </>
                )}

                {!showSlots && (
                  <div className="select-date-message">
                    <p>{t.selectDateFirst}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="breadcrumb">
                  <span
                    onClick={() => {
                      setActiveCategory(null);
                      setSelectedDate(null);
                      setShowSlots(false);
                    }}
                  >
                    {t.categories}
                  </span>{" "}
                  &gt;{" "}
                  <span
                    onClick={() => {
                      setSelectedExpert(null);
                      setShowSlots(true);
                    }}
                  >
                    {activeCategory.name}
                  </span>
                </div>

                <div className="appointment-booked">
                  <h2>{t.appointmentBooked}</h2>
                  <div className="appointment-details">
                    <p>
                      <strong>{t.category}:</strong> {activeCategory.name}
                    </p>
                    <p>
                      <strong>{t.date}:</strong> {formatDate(selectedDate)}
                    </p>
                    <p>
                      <strong>{t.time}:</strong>{" "}
                      {selectedExpert.bookedSlot ||
                        bookings[bookings.length - 1]?.slot ||
                        ""}
                    </p>
                    <div className="appointment-instructions">
                      <p>{t.appointmentCancellation}</p>
                    </div>
                  </div>
                  <button
                    className="view-bookings-btn"
                    onClick={() => setShowBookings(true)}
                  >
                    {t.myBookings}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBookingForReview && (
        <div className="confirmation-overlay">
          <div className="review-modal">
            <div className="modal-header">
              <h3>Rate Your Consultation</h3>
              <button className="close-modal-btn" onClick={closeReviewModal}>
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="consultation-info">
                <p>
                  <strong>Category:</strong>{" "}
                  {selectedBookingForReview.categoryName}
                </p>
                <p>
                  <strong>Date:</strong> {selectedBookingForReview.date}
                </p>
                <p>
                  <strong>Time:</strong> {selectedBookingForReview.slot}
                </p>
              </div>

              <div className="rating-section">
                <label>
                  <strong>Rating:</strong>
                </label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= rating ? "star-filled" : "star-empty"}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="review-input">
                <label>
                  <strong>Your Review:</strong>
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={"Share your experience..."}
                  rows="5"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-review-btn" onClick={closeReviewModal}>
                Cancel
              </button>
              <button
                className="submit-review-btn"
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertConsultation;
