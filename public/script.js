// Predefined questions
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

// Predefined group members
const members = [
  "Amritanshu", "Shorya", "Preetam", "Ankit", "Trisul", "Tanisi", "Shashwati", "Aditya",
];

// Shuffle function to select random items
function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// DOM elements
const nameForm = document.getElementById("nameForm");
const quizSection = document.getElementById("quizSection");
const quizForm = document.getElementById("quizForm");
const questionsDiv = document.getElementById("questions");
const messageDiv = document.getElementById("message");

nameForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;

  const response = await fetch("/validate-name", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();

  if (data.valid) {
    nameForm.style.display = "none";
    quizSection.style.display = "block";

    // Generate and save 10 random questions
    const randomQuestions = getRandomItems(questions, 10);
    const questionsWithOptions = randomQuestions.map((question, index) => {
      const randomOptions = getRandomItems(members, 4);
      return {
        question,
        options: randomOptions,
      };
    });

    questionsWithOptions.forEach((q, index) => {
      const div = document.createElement("div");
      div.classList.add("question"); // Add class for styling

      div.innerHTML = `
        <label class="question-label">${index + 1}. ${q.question}</label>
        <div class="radio-options">
          ${q.options
            .map(
              (option) =>
                `<label><input type="radio" name="q${index}" value="${option}" required> ${option}</label>`
            )
            .join("<br>")}
        </div>
        <hr />
      `;
      questionsDiv.appendChild(div);
    });

    // Attach the questions and options to the form for submission
    quizForm.dataset.questions = JSON.stringify(questionsWithOptions);
  } else {
    messageDiv.textContent = "You are not part of this group!";
  }
});

quizForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const questionNames = Array.from(new Set([...quizForm.elements].filter(el => el.type === "radio").map(el => el.name)));
  const answeredQuestions = new Set(
    [...quizForm.elements].filter((el) => el.type === "radio" && el.checked).map((el) => el.name)
  );

  if (answeredQuestions.size < questionNames.length) {
    alert("Please answer all the questions before submitting.");
    return;
  }

  const name = document.getElementById("name").value;
  const questionsWithOptions = JSON.parse(quizForm.dataset.questions); // Get displayed questions and options
  const answers = Array.from(quizForm.elements)
    .filter((el) => el.type === "radio" && el.checked)
    .map((el, index) => ({
      question: questionsWithOptions[index].question, // Question text
      answer: el.value, // Selected answer
      options: questionsWithOptions[index].options, // All options
    }));

  try {
    const response = await fetch("/save-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, answers }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Quiz submitted successfully!");
    } else {
      alert("There was an error submitting the quiz. Please try again.");
    }
  } catch (err) {
    console.error("Error submitting quiz:", err);
    alert("An error occurred while submitting the quiz.");
  }
});
