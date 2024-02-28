// Add event listener to Start Quiz button
// Declare variables for button elements, and corresponding user inputs/outputs
var startQuizBtn = document.querySelector(".startBtn");
var highScoreBtn = document.querySelector(".scoresBtn");
var scoreList = document.querySelector(".list");
var questionView = document.querySelector(".question");
var answer1 = document.querySelector(".a1");
var answer2 = document.querySelector(".a2");
var answer3 = document.querySelector(".a3");
var answer4 = document.querySelector(".a4");
var rightWrong = document.querySelector(".rightWrong");
var timer = document.querySelector(".timer");

// User data sent to local storage
var userInitials = "";
var highScores = {
  initials: userInitials,
  score: userScore
};

// Timer variables
var initialSec = 90;
var currentSec = initialSec;
var displayMin;
var displaySec;
var timeRemain;
// Answer button variables
var button1 = document.getElementById("btn1");
var button2 = document.getElementById("btn2");
var button3 = document.getElementById("btn3");
var button4 = document.getElementById("btn4");

// Hide question & answer buttons
questionView.style.visibility = "hidden";
answer1.style.visibility = "hidden";
answer2.style.visibility = "hidden";
answer3.style.visibility = "hidden";
answer4.style.visibility = "hidden";
rightWrong.style.visibility = "hidden";
timer.style.visibility = "hidden";

// Quiz and user variables
var userAnswer = 0;
var userScore = 0;
var questionNum = 0;
var correctAnswer = 0;

startQuizBtn.addEventListener("click", startQuiz);
function startQuiz() {

// Make question, answer, timer fields visible - rightWrong hidden until answer selected 
  questionView.style.visibility = "visible";
  answer1.style.visibility = "visible";
  answer2.style.visibility = "visible";
  answer3.style.visibility = "visible";
  answer4.style.visibility = "visible";
  rightWrong.style.visibility = "hidden";
  timer.style.visibility = "visible";
  // setTimeout(decrement,1000);
  setTime();
  askQuestion(questions[questionNum]);
}
// Quiz questions/answers object
var questions = [{
  question: "(1): Which is a correct IF statement if 'x' is NOT equal to 10?",
  choices: ["if (x <> 10)", "if (x =! 10)", "if (x not= 10)", "if (x != 10)"],
  answer: 4,
},
{
  question: "(2): Which operator is used to assign a value to a variable?",
  choices: [";", "=", "-", ","],
  answer: 2,
},
{
  question: "(3): How do you declare a JavaScript variable?",
  choices: ["var myName;", "variable myName;", "call myName", "var = myName"],
  answer: 1,
},
{
  question: "(4): Which determines the highest value number between x and y?",
  choices: ["Math.ceil(x, y)", "Math.max(x, y)", "math.top(x, y)", "max(x, y)"],
  answer: 2,
},
{
  question: "(5): How do you round the number 5.25, to the nearest integer?",
  choices: ["Math.round(5.25)", "rnd(5.25)", "round(5.25)", "floor(5.25)"],
  answer: 1,
},
]

function askQuestion(question) {
// Set Display to none for Start Quiz, View Scores, and Score List so that they vacate their space taken
  startQuizBtn.style.display = "none";
  highScoreBtn.style.display = "none";
  scoreList.style.display = "none";

  // Check Question Number or Timer value = 0 to determine End of Quiz
  if (questionNum > questions.length - 1) {
    saveScore();
    function saveScore() {
      // User must enter characters in the field or the game score will not be saved
      userInitials = prompt("Game Is Over.  Your Score is " + userScore + " out of " + questions.length + ".\nType your initials below to save your Score.");
    }
    if (userInitials) {
// Store initials and score to local storage
      localStorage.setItem("mostRecentScore", userScore);
      var mostRecentScore = localStorage.getItem("mostRecentScore");
      var highScores = JSON.parse(localStorage.getItem("highScores")) || [];

      var score = {
        initials: userInitials,
        score: mostRecentScore
      };
      console.log(score);
      highScores.push(score);
      highScores.sort((a, b) => b.score - a.score);
      highScores.splice(5);
      localStorage.setItem("highScores", JSON.stringify(highScores));
    }
// Make Start Quiz, View High Scores buttons visible - hide question field
    startQuizBtn.style.visibility = "visible";
    highScoreBtn.style.visibility = "visible";
    questionView.style.visibility = "hidden";
    // End of Quiz Questions determines "reload" of app
    location.reload();
  }
  questionView.textContent = question.question;
  answer1.textContent = question.choices[0];
  answer2.textContent = question.choices[1];
  answer3.textContent = question.choices[2];
  answer4.textContent = question.choices[3];
  correctAnswer = question.answer;
  console.log("Correct Answer is " + correctAnswer);
}
// Checks which answer button user clicks (button1 thru button4) 
button1.addEventListener("click", function () {
  if (button1.click) {
    userAnswer = 1;
  }
  quizAnswer();
});

button2.addEventListener("click", function () {
  if (button2.click) {
    userAnswer = 2;
  }
  quizAnswer();
});

button3.addEventListener("click", function () {
  if (button3.click) {
    userAnswer = 3;
  }
  quizAnswer();
});

button4.addEventListener("click", function () {
  if (button4.click) {
    userAnswer = 4;
  }
  quizAnswer();
});

// Check if user answer is correct or wrong
function quizAnswer() {
  if (userAnswer === correctAnswer) {
    rightWrong.style.visibility = "visible";
    rightWrong.textContent = "Your answer is CORRECT";
    userScore++;
    questionNum++;
  } else {
    questionNum++
    rightWrong.style.visibility = "visible";
    rightWrong.textContent = "Your answer is WRONG";
    // Deduct 10 seconds from timer
    currentSec = (currentSec - 10);  
  }
  askQuestion(questions[questionNum])
};

// Start timer from value assigned to initialSec variable
function setTime() {
  var timerInterval = setInterval(function () {
    displaySec = currentSec % 60;
    displayMin = Math.floor(currentSec / 60) % 60;

    if (displayMin <= 9) displayMin = "0" + displayMin;
    if (displaySec <= 9) displaySec = "0" + displaySec;
    currentSec--;
    timer.textContent = "Time Remaining: " + displayMin + ":" + displaySec;

    if (currentSec < -1) {
      clearInterval(timerInterval);
      // Check timeRemain value = 0 to determine End of Quiz
      alert("The timer has expired.  The Quiz Is Over.");
      saveScore();
      function saveScore() {
        // User must enter characters in the field or the game score will not be saved
        userInitials = prompt("Game Is Over.  Your Score is " + userScore + " out of " + questions.length + ".\nType your initials below to save your Score.");
      }
      if (userInitials) {
  // Store initials and score to local storage
        localStorage.setItem("mostRecentScore", userScore);
        var mostRecentScore = localStorage.getItem("mostRecentScore");
        var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  
        var score = {
          initials: userInitials,
          score: mostRecentScore
        };
        console.log(score);
        highScores.push(score);
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(5);
        localStorage.setItem("highScores", JSON.stringify(highScores));
      }
  // Make Start Quiz, View High Scores buttons visible - hide question field
      startQuizBtn.style.visibility = "visible";
      highScoreBtn.style.visibility = "visible";
      questionView.style.visibility = "hidden";
      // Timer at 0 determines "reload" of app
      location.reload();

    }

  }, 1000);
}

// User Views High Scores 
highScoreBtn.addEventListener("click", function () {
  if (highScoreBtn.click) {
    highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    for (var i = 0; i < highScores.length; i++) {
      var liElem = document.createElement("li");
      liElem.textContent = highScores[i].initials + "--> " + highScores[i].score + "/" + questions.length;
      var olElem = document.getElementById("listScores");
      olElem.appendChild(liElem);
      highScoreBtn.style.display = "none";
      
    }

  }
});
