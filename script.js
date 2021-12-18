// Constants
let questions = [
  {
    id: "1",
    ques: `const shape = {
  radius: 10,
  diameter() {
    return this.radius * 2;
  },
  perimeter: () => 2 * Math.PI * this.radius,
};

console.log(shape.diameter());
console.log(shape.perimeter());
`,
    visited: false,
    answers: [
      { text: "20 and 62.83185307179586", correct: false },
      { text: "20 and NaN", correct: true },
      { text: "20 and 63", correct: false },
      { text: "NaN and 63", correct: false },
    ],
  },
  {
    id: "2",
    ques: "What is 4 + 4",
    visited: false,
    answers: [
      { text: "4", correct: false },
      { text: "2", correct: false },
      { text: "1", correct: false },
      { text: "8", correct: true },
    ],
  },
  {
    id: "3",
    ques: "What is 2 - 1",
    visited: false,
    answers: [
      { text: "4", correct: false },
      { text: "2", correct: false },
      { text: "1", correct: true },
      { text: "8", correct: false },
    ],
  },
];
let timerBegin = 10;
let score = 0;
let shuffledQues;
let currQuesIndex = 0;
let timerId;

// Accessing DOM el
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const quesContainer = document.getElementById("ques-container");
const questionsText = document.getElementById("ques");
const ansBtns = document.getElementById("ans-btn");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

(() => checklocalStorage())();

// Setting event listeners
startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", setNextQues);
restartBtn.addEventListener("click", startGame);

// Adding Functionality
function startGame() {
  score = 0;
  startBtn.removeEventListener("click", startGame);
  timerEl.innerText = `Time left: ${timerBegin}`;
  scoreEl.innerText = `Your score: ${score}`;
  const isHidden = restartBtn.classList.contains("hide");
  if (!isHidden) {
    restartBtn.classList.add("hide");
  }
  startBtn.classList.add("hide");
  shuffledQues = questions.sort((a, b) => Math.random() - 0.5);
  quesContainer.classList.remove("hide");
  setNextQues();
}

function startTimer() {
  timerEl.innerText = `Time left: ${timerBegin}`;
  timerId = setInterval(() => {
    // timerBegin-=1
    timerBegin -= 1;
    timerEl.innerText = `Time left: ${timerBegin}`;
    if (timerBegin === 0) {
      resetTimer();
      resetGame();
    }
  }, 1000);
}

function setNextQues() {
  shuffledQues = [...questions].filter((q) => !q.visited).sort((a, b) => Math.random() - 0.5);
  resetGame();
  if (shuffledQues.length !== 0) {
    startTimer();
    const randomIndex = Math.floor(Math.random() * shuffledQues.length);
    showQues(shuffledQues[randomIndex]);
  }
}

function showQues(ques) {
  questionsText.innerText = ques.ques;
  ques.visited = true;
  ques.answers.forEach((ans) => {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.innerText = ans.text;
    if (ans.correct) {
      button.setAttribute("correct", ans.correct);
    }
    button.addEventListener("click", selectAns);
    ansBtns.appendChild(button);
  });
}

function resetGame() {
  if (shuffledQues.length === 0 || timerBegin === 0) {
    questions = questions.map((q) => ({ ...q, visited: false }));
    questionsText.innerText = "";
    restartBtn.classList.remove("hide");
    quesContainer.classList.add("hide");
    timerBegin = 10;
    timerEl.innerText = "";
  }
  nextBtn.addEventListener("click", setNextQues);
  nextBtn.classList.add("hide");
  clearStatus(document.body);
  while (ansBtns.firstChild) {
    ansBtns.removeChild(ansBtns.firstChild);
  }
}

function resetTimer() {
  clearInterval(timerId);
  // timerBegin = 10;
}

function selectAns(e) {
  clearInterval(timerId);
  timerBegin = 10;
  const selectedBtn = e.target;
  const correct = selectedBtn.getAttribute("correct");
  if (correct) score++;

  scoreEl.innerText = `Your score: ${score}`;
  checkHighScore();
  setStatusClass(document.body, correct);
  Array.from(ansBtns.children).forEach((btn) => {
    setStatusClass(btn, btn.getAttribute("correct"));
  });
  currQuesIndex++;
}

function setStatusClass(el, correct) {
  clearStatus(el);
  if (correct) {
    el.classList.add("correct");
  } else {
    el.classList.add("wrong");
  }
  nextBtn.classList.remove("hide");
}

function clearStatus(el) {
  el.classList.remove("correct");
  el.classList.remove("wrong");
}

function checklocalStorage() {
  highScoreEl.innerText = `High score: ${localStorage.getItem("highscore") || 0}`;
}

function checkHighScore() {
  if (!localStorage.getItem("highscore") || (localStorage.getItem("highscore") && localStorage.getItem("highscore") < score)) {
    localStorage.setItem("highscore", score);
  }
  checklocalStorage();
}
