const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/groupQuiz", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// MongoDB Schema
const responseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  answers: [
    {
      question: { type: String, required: true }, // Storing the question text
      answer: { type: String, required: true },  // Storing the selected answer
      options: { type: [String], required: true }, // Storing all options for the question
    },
  ],
});
const Response = mongoose.model("Response", responseSchema);

// All questions
const questions = [
  "Who is the laziest person in the group?",
  "Who is the most irritating person?",
  "Who is most likely to support you no matter what?",
  "Whom do you trust the most?",
  "Who makes you laugh the most?",
  "Who will get married first?",
  "Who is most likely to have the weirdest love story?",
  "Who is most likely to become famous?",
  "Who seems most likely to stab you in the back?",
  "Who is the biggest drama queen/king?",
  "Who is the biggest flirt?",
  "Who do you enjoy annoying the most?",
  "Who is the most stylish person?",
  "Who has the weirdest habits?",
  "Who gets angry the fastest?",
  "Who is the most responsible?",
  "Who cracks the worst jokes?",
  "Who is the most adventurous?",
  "Who would win an award for being the silliest in the group?",
  "With whom would you like to go on a road trip?",
  "Who is the best at pretending to be busy?",
  "Who do you secretly dislike the most in the group?",
  "Who is most likely to stab someone in the back?",
  "Who would be the first to betray the group?",
  "Who has the darkest secrets?",
  "Who is the most likely to be arrested?",
  "Who would make the worst villain in a movie?",
  "Who has the most toxic traits?",
  "Who would most likely ghost everyone in the group?",
  "Who is the most manipulative person?",
  "Who is the most likely to lie about something important?",
  "Whom would you slap if you got the chance?",
  "Whom would you kiss if you got the chance?",
  "With whom would you like to go on a road trip?",
  "Who would be the worst travel companion?",
  "Who will remain single forever?",
  "Who would make every journey feel like an adventure?",
  "Whom would you shoot first?",
  "Whom can you defeat in anything, even in your sleep?",
  "Whom would you like to give a tickle attack?",
  "If you could swap lives with someone for a day, who would it be?",
  "Who would you want to swap wardrobes with for a day?",
  "Whose phone would you secretly snoop through for hidden truths?",
  "Who is the easiest to roast in the group?",
  "Who is the group's ultimate clown?",
  "Who is easiest to be fooled?",
];

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
    // Detailed answers - Mapping from question index
    const detailedAnswers = answers.map(({ question, answer, options }) => {
      if (!question || !answer || !Array.isArray(options) || options.length === 0) {
        throw new Error(`Invalid data for question: ${question}`);
      }

      return { question, answer, options };
    });

    const newResponse = new Response({
      name,
      answers: detailedAnswers,
    });

    await newResponse.save();
    console.log("Quiz response saved:", { name, answers: detailedAnswers });

    res.status(200).json({ success: true, message: "Quiz submitted successfully." });
  } catch (err) {
    console.error("Error saving quiz data:", err.message);
    res.status(500).json({ success: false, message: "Error saving quiz data." });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
const PORT = 9000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
