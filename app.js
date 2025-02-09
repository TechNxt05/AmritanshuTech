require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

// MongoDB Schema
const responseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  answers: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      options: { type: [String], required: true },
    },
  ],
});
const Response = mongoose.model("Response", responseSchema);

// Predefined Names
const validNames = ["Amritanshu", "Shorya", "Preetam", "Ankit", "Trisul", "Tanisi", "Shashwati", "Aditya", "Om"];

// API Routes

// Validate the user's name
app.post("/validate-name", (req, res) => {
  const { name } = req.body;
  if (validNames.includes(name)) {
    res.status(200).json({ valid: true });
  } else {
    res.status(400).json({ valid: false });
  }
});

// Save quiz answers to MongoDB
app.post("/save-answers", async (req, res) => {
  const { name, answers } = req.body;

  if (!name || !answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid data." });
  }

  try {
    const detailedAnswers = answers.map(({ question, answer, options }) => {
      if (!question || !answer || !Array.isArray(options) || options.length === 0) {
        throw new Error(`Invalid data for question: ${question}`);
      }
      return { question, answer, options };
    });

    const newResponse = new Response({ name, answers: detailedAnswers });
    await newResponse.save();
    console.log("✅ Quiz response saved:", { name, answers: detailedAnswers });

    res.status(200).json({ success: true, message: "Quiz submitted successfully." });
  } catch (err) {
    console.error("❌ Error saving quiz data:", err.message);
    res.status(500).json({ success: false, message: "Error saving quiz data." });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
