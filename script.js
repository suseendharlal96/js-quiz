// Constants
let questions = [
  {
    id: "1",
    ques: "What is 2 + 2",
    visited: false,
    answers: [
      { text: "4", correct: true },
      { text: "2", correct: false },
      { text: "1", correct: false },
      { text: "8", correct: false },
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
let timerBegin = 4;
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

// Setting event listeners
startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", setNextQues);
restartBtn.addEventListener("click", startGame);

// Adding Functionality
function startGame() {
  console.log("started");
  timerEl.innerText = `Time left: ${timerBegin}`;
  const isHidden = restartBtn.classList.contains("hide");
  console.log(isHidden);
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
    console.log("sd");
    timerBegin -= 1;
    timerEl.innerText = `Time left: ${timerBegin}`;
    if (timerBegin === 0) {
      resetTimer();
      // console.log(timerBegin);
      resetGame();
    }
  }, 1000);
}

function setNextQues() {
  shuffledQues = [...questions].filter((q) => !q.visited).sort((a, b) => Math.random() - 0.5);
  resetGame();
  console.log(questions);
  if (shuffledQues.length !== 0) {
    startTimer();
    const randomIndex = Math.floor(Math.random() * shuffledQues.length);
    console.log({ shuffledQues, randomIndex });
    showQues(shuffledQues[randomIndex]);
  }
}

function showQues(ques) {
  console.log({ ques });
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
  console.log({ timerBegin, shuffledQues });
  if (shuffledQues.length === 0 || timerBegin === 0) {
    questions = questions.map((q) => ({ ...q, visited: false }));
    questionsText.innerText = "";
    restartBtn.classList.remove("hide");
    timerBegin = 4;
    timerEl.innerText = "";
  }
  nextBtn.classList.add("hide");
  clearStatus(document.body);
  while (ansBtns.firstChild) {
    ansBtns.removeChild(ansBtns.firstChild);
  }
}

function resetTimer() {
  clearInterval(timerId);
  // timerBegin = 4;
}

function selectAns(e) {
  console.log(e.target);
  clearInterval(timerId);
  timerBegin = 4;
  const selectedBtn = e.target;
  const correct = selectedBtn.getAttribute("correct");
  setStatusClass(document.body, correct);
  Array.from(ansBtns.children).forEach((btn) => {
    setStatusClass(btn, btn.getAttribute("correct"));
  });
  currQuesIndex++;
}

function setStatusClass(el, correct) {
  console.log({ el, correct });
  clearStatus(el);
  if (correct) {
    el.classList.add("correct");
  } else {
    el.classList.add("wrong");
    // el.setAttribute('disabled',true)
  }
  nextBtn.classList.remove("hide");
}

function clearStatus(el) {
  el.classList.remove("correct");
  el.classList.remove("wrong");
}
