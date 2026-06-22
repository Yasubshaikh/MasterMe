const ADMIN_PHONE_LAST4 = "0254";
const SHARE_REWARD_COINS = 50;
const READS_PER_INTERSTITIAL = 5;
const QUESTION_SECONDS = 20;
const CLASS_LEVELS = Array.from({ length: 11 }, (_, index) => index + 1);
const SECRET_ADMIN_TAPS = 7;

const defaultQuestions = [
  {
    id: "q_gk_1",
    text: "Which planet is known as the Red Planet?",
    options: { A: "Venus", B: "Mars", C: "Jupiter", D: "Saturn" },
    correct: "B",
    explanation: "Mars is called the Red Planet because iron oxide on its surface gives it a reddish color.",
    difficulty: 1,
    category: "GK"
  },
  {
    id: "q_math_1",
    text: "What is 12 x 8?",
    options: { A: "84", B: "96", C: "108", D: "112" },
    correct: "B",
    explanation: "12 x 8 = 96.",
    difficulty: 1,
    category: "Math"
  },
  {
    id: "q_ca_1",
    text: "What does GDP commonly measure?",
    options: { A: "Population", B: "Economic output", C: "Rainfall", D: "Internet speed" },
    correct: "B",
    explanation: "GDP measures the total value of goods and services produced in an economy.",
    difficulty: 2,
    category: "Current Affairs"
  },
  {
    id: "q_math_2",
    text: "If x + 9 = 21, what is x?",
    options: { A: "10", B: "11", C: "12", D: "13" },
    correct: "C",
    explanation: "Subtract 9 from both sides: x = 12.",
    difficulty: 2,
    category: "Math"
  },
  {
    id: "q_gk_2",
    text: "Which gas do plants absorb for photosynthesis?",
    options: { A: "Oxygen", B: "Nitrogen", C: "Carbon dioxide", D: "Hydrogen" },
    correct: "C",
    explanation: "Plants use carbon dioxide, water, and sunlight to produce glucose and oxygen.",
    difficulty: 1,
    category: "Science"
  },
  {
    id: "q_love_gk_1",
    text: "In many cultures, which flower is most commonly linked with love?",
    options: { A: "Rose", B: "Sunflower", C: "Lotus", D: "Tulip" },
    correct: "A",
    explanation: "The rose is widely used as a symbol of love, romance, and affection.",
    difficulty: 1,
    category: "Love GK"
  },
  {
    id: "q_love_gk_2",
    text: "Which heart organ pumps blood through the human body?",
    options: { A: "Brain", B: "Lungs", C: "Heart", D: "Liver" },
    correct: "C",
    explanation: "The heart pumps blood and is also used as a popular symbol of love.",
    difficulty: 1,
    category: "Love GK"
  },
  {
    id: "q_love_gk_3",
    text: "Valentine's Day is commonly celebrated on which date?",
    options: { A: "January 1", B: "February 14", C: "March 8", D: "December 25" },
    correct: "B",
    explanation: "Valentine's Day is commonly celebrated on February 14.",
    difficulty: 2,
    category: "Love GK"
  },
  {
    id: "q_fun_1",
    text: "If your crush replies 'haha' only, what should you do in MasterMe?",
    options: { A: "Panic", B: "Send 50 messages", C: "Answer the next question", D: "Delete the app" },
    correct: "C",
    explanation: "Stay calm, keep learning, and win the next question.",
    difficulty: 1,
    category: "Fun"
  },
  {
    id: "q_fun_2",
    text: "Which is the best combo for a quiz champion?",
    options: { A: "Luck only", B: "Practice and focus", C: "Guessing forever", D: "Sleeping during tests" },
    correct: "B",
    explanation: "Practice and focus make the strongest quiz players.",
    difficulty: 1,
    category: "Fun"
  }
];

const state = {
  questions: loadQuestions(),
  schoolContent: loadSchoolContent(),
  learningProgress: loadLearningProgress(),
  player: loadPlayer(),
  currentQuestion: null,
  currentCategory: "All",
  currentClass: Number(localStorage.getItem("masterme_current_class") || 1),
  answered: false,
  readCounter: Number(localStorage.getItem("masterme_read_counter") || 0),
  timerId: null,
  secondsLeft: QUESTION_SECONDS,
  adminTapCount: 0,
  deferredInstallPrompt: null
};

const el = {
  installButton: document.querySelector("#installButton"),
  adminSecretTrigger: document.querySelector("#adminSecretTrigger"),
  playerName: document.querySelector("#playerName"),
  levelValue: document.querySelector("#levelValue"),
  xpValue: document.querySelector("#xpValue"),
  coinValue: document.querySelector("#coinValue"),
  shareValue: document.querySelector("#shareValue"),
  streakValue: document.querySelector("#streakValue"),
  xpTrack: document.querySelector("#xpTrack"),
  categoryFilter: document.querySelector("#categoryFilter"),
  classFilter: document.querySelector("#classFilter"),
  classProgressText: document.querySelector("#classProgressText"),
  lessonCompleteText: document.querySelector("#lessonCompleteText"),
  notesCount: document.querySelector("#notesCount"),
  videosCount: document.querySelector("#videosCount"),
  notesList: document.querySelector("#notesList"),
  videoList: document.querySelector("#videoList"),
  notifyProgressButton: document.querySelector("#notifyProgressButton"),
  dailyChallengeText: document.querySelector("#dailyChallengeText"),
  categoryLabel: document.querySelector("#categoryLabel"),
  questionNumber: document.querySelector("#questionNumber"),
  timerValue: document.querySelector("#timerValue"),
  questionText: document.querySelector("#questionText"),
  options: document.querySelector("#options"),
  resultText: document.querySelector("#resultText"),
  nextButton: document.querySelector("#nextButton"),
  shareButton: document.querySelector("#shareButton"),
  leaderboardList: document.querySelector("#leaderboardList"),
  achievementCount: document.querySelector("#achievementCount"),
  achievementList: document.querySelector("#achievementList"),
  adminDialog: document.querySelector("#adminDialog"),
  adminLogin: document.querySelector("#adminLogin"),
  adminPanel: document.querySelector("#adminPanel"),
  adminPhone: document.querySelector("#adminPhone"),
  sendAdminCodeButton: document.querySelector("#sendAdminCodeButton"),
  adminOtpArea: document.querySelector("#adminOtpArea"),
  adminCode: document.querySelector("#adminCode"),
  adminLoginButton: document.querySelector("#adminLoginButton"),
  adminLoginStatus: document.querySelector("#adminLoginStatus"),
  questionForm: document.querySelector("#questionForm"),
  editingQuestionId: document.querySelector("#editingQuestionId"),
  adminQuestionText: document.querySelector("#adminQuestionText"),
  adminOptionA: document.querySelector("#adminOptionA"),
  adminOptionB: document.querySelector("#adminOptionB"),
  adminOptionC: document.querySelector("#adminOptionC"),
  adminOptionD: document.querySelector("#adminOptionD"),
  adminCorrect: document.querySelector("#adminCorrect"),
  adminDifficulty: document.querySelector("#adminDifficulty"),
  adminCategory: document.querySelector("#adminCategory"),
  adminExplanation: document.querySelector("#adminExplanation"),
  newQuestionButton: document.querySelector("#newQuestionButton"),
  exportQuestionsButton: document.querySelector("#exportQuestionsButton"),
  adminQuestionList: document.querySelector("#adminQuestionList"),
  schoolContentForm: document.querySelector("#schoolContentForm"),
  editingContentId: document.querySelector("#editingContentId"),
  adminContentType: document.querySelector("#adminContentType"),
  adminContentClass: document.querySelector("#adminContentClass"),
  adminContentSubject: document.querySelector("#adminContentSubject"),
  adminContentTitle: document.querySelector("#adminContentTitle"),
  adminContentBody: document.querySelector("#adminContentBody"),
  newContentButton: document.querySelector("#newContentButton"),
  exportSchoolButton: document.querySelector("#exportSchoolButton"),
  adminContentList: document.querySelector("#adminContentList"),
  adDialog: document.querySelector("#adDialog"),
  closeAdButton: document.querySelector("#closeAdButton")
};

function createDefaultSchoolContent() {
  return CLASS_LEVELS.flatMap((classLevel) => ([
    {
      id: `note_class_${classLevel}_smart_revision`,
      type: "note",
      classLevel,
      subject: classLevel <= 5 ? "EVS" : classLevel <= 8 ? "Science" : "General Studies",
      title: `Class ${classLevel} Smart Revision Notes`,
      body: `Class ${classLevel} quick study plan: read the chapter headings, write five key points, solve two examples, and revise difficult words before the quiz.`
    },
    {
      id: `video_class_${classLevel}_foundation`,
      type: "video",
      classLevel,
      subject: "Video Class",
      title: `Class ${classLevel} Foundation Video Lesson`,
      body: `https://www.youtube.com/results?search_query=class+${classLevel}+school+lesson+math+science`
    }
  ]));
}

function loadQuestions() {
  const saved = localStorage.getItem("masterme_questions");
  if (!saved) return defaultQuestions;

  const savedQuestions = JSON.parse(saved);
  const savedIds = new Set(savedQuestions.map((question) => question.id));
  const newDefaults = defaultQuestions.filter((question) => !savedIds.has(question.id));
  return [...savedQuestions, ...newDefaults];
}

function saveQuestions() {
  localStorage.setItem("masterme_questions", JSON.stringify(state.questions));
}

function loadSchoolContent() {
  const defaults = createDefaultSchoolContent();
  const saved = localStorage.getItem("masterme_school_content");
  if (!saved) return defaults;

  const savedContent = JSON.parse(saved);
  const savedIds = new Set(savedContent.map((item) => item.id));
  const newDefaults = defaults.filter((item) => !savedIds.has(item.id));
  return [...savedContent, ...newDefaults];
}

function saveSchoolContent() {
  localStorage.setItem("masterme_school_content", JSON.stringify(state.schoolContent));
}

function loadLearningProgress() {
  const saved = localStorage.getItem("masterme_learning_progress");
  return saved ? JSON.parse(saved) : {};
}

function saveLearningProgress() {
  localStorage.setItem("masterme_learning_progress", JSON.stringify(state.learningProgress));
}

function loadPlayer() {
  const saved = localStorage.getItem("masterme_player");
  return saved ? JSON.parse(saved) : {
    name: "Guest Player",
    level: 1,
    xp: 0,
    coins: 0,
    shares: 0,
    streak: 0,
    correctToday: 0,
    answeredIds: []
  };
}

function savePlayer() {
  localStorage.setItem("masterme_player", JSON.stringify(state.player));
}

function calculateLevel(level, xp) {
  let nextLevel = level;
  while (nextLevel < 50 && xp >= nextLevel * 500) {
    nextLevel += 1;
  }
  return nextLevel;
}

function renderPlayer() {
  const levelRequirement = state.player.level * 500;
  const progress = Math.min(100, Math.round((state.player.xp / levelRequirement) * 100));
  el.playerName.textContent = state.player.name;
  el.levelValue.textContent = state.player.level;
  el.xpValue.textContent = state.player.xp;
  el.coinValue.textContent = state.player.coins;
  el.shareValue.textContent = state.player.shares;
  el.streakValue.textContent = state.player.streak;
  el.xpTrack.style.width = `${progress}%`;
}

function renderCategories() {
  const categories = ["All", ...new Set(state.questions.map((question) => question.category))].sort();
  el.categoryFilter.innerHTML = categories.map((category) => `
    <option value="${escapeHtml(category)}"${category === state.currentCategory ? " selected" : ""}>${escapeHtml(category)}</option>
  `).join("");
}

function renderClassOptions() {
  const classOptions = CLASS_LEVELS.map((classLevel) => `
    <option value="${classLevel}"${classLevel === state.currentClass ? " selected" : ""}>Class ${classLevel}</option>
  `).join("");
  el.classFilter.innerHTML = classOptions;
  el.adminContentClass.innerHTML = classOptions;
}

function getAvailableQuestions() {
  return state.questions.filter((question) => {
    const categoryMatch = state.currentCategory === "All" || question.category === state.currentCategory;
    return categoryMatch && question.difficulty <= state.player.level;
  });
}

function pickQuestion() {
  const available = getAvailableQuestions();
  const unseen = available.filter((question) => !state.player.answeredIds.includes(question.id));
  const pool = unseen.length ? unseen : available;
  return pool[Math.floor(Math.random() * pool.length)] || state.questions[0];
}

function renderQuestion() {
  clearInterval(state.timerId);
  state.currentQuestion = pickQuestion();
  state.answered = false;
  state.secondsLeft = QUESTION_SECONDS;
  state.readCounter += 1;
  localStorage.setItem("masterme_read_counter", String(state.readCounter));

  if (state.readCounter >= READS_PER_INTERSTITIAL) {
    state.readCounter = 0;
    localStorage.setItem("masterme_read_counter", "0");
    showAdBreak();
  }

  const question = state.currentQuestion;
  el.categoryLabel.textContent = question.category;
  el.questionNumber.textContent = `Difficulty ${question.difficulty}`;
  el.questionText.textContent = question.text;
  el.resultText.textContent = "Choose the best answer.";
  el.options.innerHTML = "";

  Object.entries(question.options).forEach(([key, value]) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.textContent = `${key}. ${value}`;
    button.addEventListener("click", () => answerQuestion(key, button));
    el.options.append(button);
  });

  tickTimer();
  state.timerId = setInterval(tickTimer, 1000);
}

function tickTimer() {
  el.timerValue.textContent = `${state.secondsLeft}s`;
  if (state.secondsLeft <= 0) {
    answerQuestion(null);
    return;
  }
  state.secondsLeft -= 1;
}

function answerQuestion(answer, selectedButton) {
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerId);

  const question = state.currentQuestion;
  const correct = answer === question.correct;
  const buttons = [...el.options.querySelectorAll(".option")];

  buttons.forEach((button) => {
    const key = button.textContent.slice(0, 1);
    button.disabled = true;
    if (key === question.correct) button.classList.add("correct");
  });

  if (!correct && selectedButton) {
    selectedButton.classList.add("wrong");
  }

  if (correct) {
    const earnedXp = 100 + question.difficulty * 20;
    const earnedCoins = 10 + question.difficulty * 2;
    let bonusText = "";
    state.player.xp += earnedXp;
    state.player.coins += earnedCoins;
    state.player.streak += 1;
    state.player.correctToday = (state.player.correctToday || 0) + 1;
    if (state.player.correctToday === 3) {
      state.player.coins += 75;
      bonusText = " Daily challenge complete. +75 bonus coins.";
    }
    el.resultText.textContent = `Correct. +${earnedXp} XP and +${earnedCoins} coins.${bonusText}`;
  } else {
    state.player.streak = 0;
    el.resultText.textContent = answer ? `Wrong. ${question.explanation}` : `Time up. ${question.explanation}`;
  }

  if (!state.player.answeredIds.includes(question.id)) {
    state.player.answeredIds.push(question.id);
  }

  const newLevel = calculateLevel(state.player.level, state.player.xp);
  if (newLevel > state.player.level) {
    state.player.level = newLevel;
    el.resultText.textContent += ` Level ${newLevel} unlocked.`;
  }

  savePlayer();
  renderPlayer();
  renderAchievements();
  renderLeaderboard();
}

function getAchievements() {
  return [
    {
      icon: "LV",
      title: "Level Climber",
      description: "Reach Level 2.",
      unlocked: state.player.level >= 2
    },
    {
      icon: "CO",
      title: "Coin Collector",
      description: "Earn 100 coins.",
      unlocked: state.player.coins >= 100
    },
    {
      icon: "ST",
      title: "Hot Streak",
      description: "Answer 3 questions correctly in a row.",
      unlocked: state.player.streak >= 3
    },
    {
      icon: "SH",
      title: "Viral Starter",
      description: "Share MasterMe once.",
      unlocked: state.player.shares >= 1
    },
    {
      icon: "LO",
      title: "Love GK Explorer",
      description: "Play a Love GK question.",
      unlocked: state.player.answeredIds.some((id) => id.includes("love"))
    }
  ];
}

function renderAchievements() {
  const achievements = getAchievements();
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;
  el.achievementCount.textContent = `${unlockedCount} unlocked`;
  el.dailyChallengeText.textContent = `${Math.min(state.player.correctToday || 0, 3)}/3 correct answers today`;
  el.achievementList.innerHTML = achievements.map((achievement) => `
    <article class="achievement${achievement.unlocked ? " unlocked" : ""}">
      <strong>${achievement.icon}</strong>
      <div>
        <strong>${escapeHtml(achievement.title)}</strong>
        <span>${escapeHtml(achievement.description)}</span>
      </div>
    </article>
  `).join("");
}

function renderLeaderboard() {
  const rows = [
    { name: state.player.name, score: state.player.xp, level: state.player.level },
    { name: "Aisha", score: 1120, level: 3 },
    { name: "Rohan", score: 880, level: 2 },
    { name: "Mina", score: 720, level: 2 }
  ].sort((a, b) => b.score - a.score);

  el.leaderboardList.innerHTML = rows.map((row, index) => `
    <div class="rank-row">
      <strong>#${index + 1}</strong>
      <div>
        <strong>${escapeHtml(row.name)}</strong>
        <span>Level ${row.level}</span>
      </div>
      <strong>${row.score}</strong>
    </div>
  `).join("");
}

function getClassContent(type) {
  return state.schoolContent
    .filter((item) => item.classLevel === state.currentClass && item.type === type)
    .sort((a, b) => a.title.localeCompare(b.title));
}

function renderLearningHub() {
  const notes = getClassContent("note");
  const videos = getClassContent("video");
  const allClassContent = [...notes, ...videos];
  const completed = allClassContent.filter((item) => state.learningProgress[item.id]).length;
  const progress = allClassContent.length ? Math.round((completed / allClassContent.length) * 100) : 0;

  el.classProgressText.textContent = `${progress}% complete`;
  el.lessonCompleteText.textContent = `${completed} of ${allClassContent.length} lessons`;
  el.notesCount.textContent = `${notes.length} notes`;
  el.videosCount.textContent = `${videos.length} videos`;

  el.notesList.innerHTML = notes.length ? notes.map(renderNoteCard).join("") : emptyContent("No notes yet. Admin can add notes.");
  el.videoList.innerHTML = videos.length ? videos.map(renderVideoCard).join("") : emptyContent("No videos yet. Admin can add video links.");
}

function renderNoteCard(item) {
  const complete = Boolean(state.learningProgress[item.id]);
  return `
    <article class="content-card${complete ? " complete" : ""}">
      <div>
        <span>${escapeHtml(item.subject)} | Class ${item.classLevel}</span>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.body)}</p>
      </div>
      <div class="content-actions">
        <button type="button" class="secondary" data-share-note="${item.id}">Share</button>
        <button type="button" class="ghost" data-complete-content="${item.id}">${complete ? "Completed" : "Mark done"}</button>
      </div>
    </article>
  `;
}

function renderVideoCard(item) {
  const complete = Boolean(state.learningProgress[item.id]);
  const url = normalizeUrl(item.body);
  return `
    <article class="content-card${complete ? " complete" : ""}">
      <div>
        <span>${escapeHtml(item.subject)} | Class ${item.classLevel}</span>
        <h4>${escapeHtml(item.title)}</h4>
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener">Open video lesson</a>
      </div>
      <div class="content-actions">
        <button type="button" class="ghost" data-complete-content="${item.id}">${complete ? "Completed" : "Mark done"}</button>
      </div>
    </article>
  `;
}

function emptyContent(message) {
  return `<p class="empty-state">${escapeHtml(message)}</p>`;
}

function toggleLearningProgress(id) {
  state.learningProgress[id] = !state.learningProgress[id];
  saveLearningProgress();
  renderLearningHub();
}

function shareNote(id) {
  const item = state.schoolContent.find((content) => content.id === id);
  if (!item) return;

  const shareData = {
    title: item.title,
    text: `${item.title}\n\n${item.body}\n\nShared from MasterMe`,
    url: location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard?.writeText(`${shareData.text}\n${shareData.url}`);
    alert("Note copied for sharing.");
  }
}

async function notifyProgress() {
  const allClassContent = state.schoolContent.filter((item) => item.classLevel === state.currentClass);
  const completed = allClassContent.filter((item) => state.learningProgress[item.id]).length;
  const body = `Class ${state.currentClass}: ${completed} of ${allClassContent.length} lessons completed. Keep going.`;

  if (!("Notification" in window)) {
    alert(body);
    return;
  }

  const permission = Notification.permission === "default"
    ? await Notification.requestPermission()
    : Notification.permission;

  if (permission === "granted") {
    new Notification("MasterMe progress", { body });
  } else {
    alert(body);
  }
}

function shareApp() {
  state.player.shares += 1;
  state.player.coins += SHARE_REWARD_COINS;
  savePlayer();
  renderPlayer();
  renderAchievements();

  const shareData = {
    title: "MasterMe",
    text: "Challenge me on MasterMe and climb the leaderboard.",
    url: location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard?.writeText(location.href);
    alert("Link copied. +50 coins credited.");
  }
}

function openAdmin() {
  el.adminDialog.showModal();
  if (sessionStorage.getItem("masterme_admin") === "true") {
    unlockAdmin();
  }
}

function unlockAdmin() {
  el.adminLogin.hidden = true;
  el.adminPanel.hidden = false;
  sessionStorage.setItem("masterme_admin", "true");
  renderAdminQuestions();
  renderAdminContent();
}

function handleSecretAdminTap() {
  state.adminTapCount += 1;
  window.clearTimeout(state.adminTapTimer);
  state.adminTapTimer = window.setTimeout(() => {
    state.adminTapCount = 0;
  }, 1600);

  if (state.adminTapCount >= SECRET_ADMIN_TAPS) {
    state.adminTapCount = 0;
    openAdmin();
  }
}

function sendAdminCode() {
  const phoneDigits = el.adminPhone.value.replace(/\D/g, "");
  if (!phoneDigits.endsWith(ADMIN_PHONE_LAST4)) {
    el.adminLoginStatus.textContent = "This phone is not registered as the MasterMe owner.";
    return;
  }

  const code = createOtpCode();
  sessionStorage.setItem("masterme_pending_admin_code", code);
  el.adminOtpArea.hidden = false;
  el.adminCode.focus();
  el.adminLoginStatus.textContent = `Local test code: ${code}. For real SMS, connect Firebase Phone Auth and keep owner rules on the server.`;
}

function verifyAdminCode() {
  const expectedCode = sessionStorage.getItem("masterme_pending_admin_code");
  if (expectedCode && el.adminCode.value.trim() === expectedCode) {
    sessionStorage.removeItem("masterme_pending_admin_code");
    unlockAdmin();
    return;
  }

  el.adminLoginStatus.textContent = "Wrong or expired verification code.";
}

function createOtpCode() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return String(100000 + (values[0] % 900000));
}

function renderAdminQuestions() {
  el.adminQuestionList.innerHTML = state.questions.map((question) => `
    <article class="admin-question">
      <div>
        <p>${escapeHtml(question.text)}</p>
        <small>${escapeHtml(question.category)} | Difficulty ${question.difficulty} | Correct ${question.correct}</small>
      </div>
      <div class="mini-actions">
        <button type="button" data-edit="${question.id}">Edit</button>
        <button type="button" data-delete="${question.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

function resetQuestionForm() {
  el.questionForm.reset();
  el.editingQuestionId.value = "";
  el.adminDifficulty.value = "1";
  el.adminCategory.value = "GK";
  el.adminCorrect.value = "A";
}

function saveQuestion(event) {
  event.preventDefault();

  const id = el.editingQuestionId.value || `q_${Date.now()}`;
  const question = {
    id,
    text: el.adminQuestionText.value.trim(),
    options: {
      A: el.adminOptionA.value.trim(),
      B: el.adminOptionB.value.trim(),
      C: el.adminOptionC.value.trim(),
      D: el.adminOptionD.value.trim()
    },
    correct: el.adminCorrect.value,
    explanation: el.adminExplanation.value.trim() || "Review this topic and try again.",
    difficulty: Math.min(50, Math.max(1, Number(el.adminDifficulty.value))),
    category: el.adminCategory.value.trim() || "GK"
  };

  const existingIndex = state.questions.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    state.questions[existingIndex] = question;
  } else {
    state.questions.push(question);
  }

  saveQuestions();
  resetQuestionForm();
  renderCategories();
  renderAdminQuestions();
  renderQuestion();
}

function editQuestion(id) {
  const question = state.questions.find((item) => item.id === id);
  if (!question) return;

  el.editingQuestionId.value = question.id;
  el.adminQuestionText.value = question.text;
  el.adminOptionA.value = question.options.A;
  el.adminOptionB.value = question.options.B;
  el.adminOptionC.value = question.options.C;
  el.adminOptionD.value = question.options.D;
  el.adminCorrect.value = question.correct;
  el.adminDifficulty.value = question.difficulty;
  el.adminCategory.value = question.category;
  el.adminExplanation.value = question.explanation;
}

function deleteQuestion(id) {
  if (state.questions.length <= 1) {
    alert("Keep at least one question in the app.");
    return;
  }

  state.questions = state.questions.filter((question) => question.id !== id);
  saveQuestions();
  renderCategories();
  renderAdminQuestions();
  renderQuestion();
}

function exportQuestions() {
  const blob = new Blob([JSON.stringify(state.questions, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "masterme-questions.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderAdminContent() {
  el.adminContentList.innerHTML = state.schoolContent.map((item) => `
    <article class="admin-question">
      <div>
        <p>${escapeHtml(item.title)}</p>
        <small>Class ${item.classLevel} | ${escapeHtml(item.type)} | ${escapeHtml(item.subject)}</small>
      </div>
      <div class="mini-actions">
        <button type="button" data-edit-content="${item.id}">Edit</button>
        <button type="button" data-delete-content="${item.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

function resetContentForm() {
  el.schoolContentForm.reset();
  el.editingContentId.value = "";
  el.adminContentType.value = "note";
  el.adminContentClass.value = String(state.currentClass);
  el.adminContentSubject.value = "General";
}

function saveContent(event) {
  event.preventDefault();

  const id = el.editingContentId.value || `content_${Date.now()}`;
  const content = {
    id,
    type: el.adminContentType.value,
    classLevel: Math.min(11, Math.max(1, Number(el.adminContentClass.value))),
    subject: el.adminContentSubject.value.trim() || "General",
    title: el.adminContentTitle.value.trim(),
    body: el.adminContentBody.value.trim()
  };

  const existingIndex = state.schoolContent.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    state.schoolContent[existingIndex] = content;
  } else {
    state.schoolContent.push(content);
  }

  saveSchoolContent();
  resetContentForm();
  renderLearningHub();
  renderAdminContent();
}

function editContent(id) {
  const item = state.schoolContent.find((content) => content.id === id);
  if (!item) return;

  el.editingContentId.value = item.id;
  el.adminContentType.value = item.type;
  el.adminContentClass.value = String(item.classLevel);
  el.adminContentSubject.value = item.subject;
  el.adminContentTitle.value = item.title;
  el.adminContentBody.value = item.body;
}

function deleteContent(id) {
  state.schoolContent = state.schoolContent.filter((content) => content.id !== id);
  delete state.learningProgress[id];
  saveSchoolContent();
  saveLearningProgress();
  renderLearningHub();
  renderAdminContent();
}

function exportSchoolContent() {
  const blob = new Blob([JSON.stringify(state.schoolContent, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "masterme-school-content.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function normalizeUrl(value) {
  const trimmed = String(value || "").trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(trimmed || "school lesson")}`;
}

function showAdBreak() {
  if (!el.adDialog.open) {
    el.adDialog.showModal();
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

document.addEventListener("copy", blockQuestionTextAction, true);
document.addEventListener("cut", blockQuestionTextAction, true);
document.addEventListener("paste", blockQuestionTextAction, true);
document.addEventListener("contextmenu", blockQuestionTextAction, true);

function blockQuestionTextAction(event) {
  if (event.target.closest(".question-text")) {
    event.preventDefault();
  }
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.deferredInstallPrompt = event;
  el.installButton.hidden = false;
});

el.installButton.addEventListener("click", async () => {
  if (!state.deferredInstallPrompt) return;
  state.deferredInstallPrompt.prompt();
  await state.deferredInstallPrompt.userChoice;
  state.deferredInstallPrompt = null;
  el.installButton.hidden = true;
});

el.adminSecretTrigger.addEventListener("click", handleSecretAdminTap);
el.sendAdminCodeButton.addEventListener("click", sendAdminCode);
el.adminLoginButton.addEventListener("click", verifyAdminCode);

el.questionForm.addEventListener("submit", saveQuestion);
el.newQuestionButton.addEventListener("click", resetQuestionForm);
el.exportQuestionsButton.addEventListener("click", exportQuestions);
el.schoolContentForm.addEventListener("submit", saveContent);
el.newContentButton.addEventListener("click", resetContentForm);
el.exportSchoolButton.addEventListener("click", exportSchoolContent);
el.adminQuestionList.addEventListener("click", (event) => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;
  if (editId) editQuestion(editId);
  if (deleteId) deleteQuestion(deleteId);
});
el.adminContentList.addEventListener("click", (event) => {
  const editId = event.target.dataset.editContent;
  const deleteId = event.target.dataset.deleteContent;
  if (editId) editContent(editId);
  if (deleteId) deleteContent(deleteId);
});

el.nextButton.addEventListener("click", renderQuestion);
el.shareButton.addEventListener("click", shareApp);
el.closeAdButton.addEventListener("click", () => el.adDialog.close());
el.categoryFilter.addEventListener("change", () => {
  state.currentCategory = el.categoryFilter.value;
  renderQuestion();
});
el.classFilter.addEventListener("change", () => {
  state.currentClass = Number(el.classFilter.value);
  localStorage.setItem("masterme_current_class", String(state.currentClass));
  renderLearningHub();
});
el.notesList.addEventListener("click", (event) => {
  const completeId = event.target.dataset.completeContent;
  const shareId = event.target.dataset.shareNote;
  if (completeId) toggleLearningProgress(completeId);
  if (shareId) shareNote(shareId);
});
el.videoList.addEventListener("click", (event) => {
  const completeId = event.target.dataset.completeContent;
  if (completeId) toggleLearningProgress(completeId);
});
el.notifyProgressButton.addEventListener("click", notifyProgress);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}

renderPlayer();
renderCategories();
renderClassOptions();
renderLearningHub();
renderAchievements();
renderLeaderboard();
renderQuestion();
