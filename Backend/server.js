const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51SWDH1QlPv1Se0irVTeCMFbzVNh2Df2YESQIo1PcfwK73ASM0zQryrbfmLbJbsDmzOCUD90ui6beQrtZZte9LFyJ00k0xHQlmT"
);
const plantIdentificationRoutes = require("./routes/plantIdentification");
const diseaseDetectionRoutes = require("./routes/diseaseDetection");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      payment: "/create-payment-intent",
      verify: "/verify-payment",
    },
  });
});

// Create Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "pkr" } = req.body;

    console.log("💳 Creating payment intent for amount:", amount, currency);

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/paisa
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: "accept_a_payment",
      },
    });

    console.log("✅ Payment intent created:", paymentIntent.id);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("❌ Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment
app.post("/verify-payment", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    console.log("🔍 Verifying payment:", paymentIntentId);

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log("✅ Payment verified:", paymentIntent.status);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/plant", plantIdentificationRoutes);
app.use("/api/disease", diseaseDetectionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 Payment Server Started Successfully!");
  console.log("=".repeat(60));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`💳 Stripe Mode: TEST MODE`);
  console.log(`🔑 Publishable Key: pk_test_51SWDH1Q...`);
  console.log("=".repeat(60));
  console.log("📋 Available Endpoints:");
  console.log(`   GET  /                        - Health check`);
  console.log(`   POST /create-payment-intent   - Create payment`);
  console.log(`   POST /verify-payment          - Verify payment`);
  console.log("=".repeat(60));
  console.log("✅ Ready to accept payments!");
  console.log("=".repeat(60) + "\n");
});
