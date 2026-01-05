# 📘 Mock Test Tool (Universal CBT Engine)

A powerful, lightweight, and offline-first Computer Based Test (CBT) engine designed for aspirants of competitive exams like **SEBI Grade A, RBI Grade B, NABARD, SSC CGL, and UPSC**.

It runs entirely in the browser (Vanilla JS), requires no backend server for personal use, and supports a "Cloud Library" via GitHub integration.

## ✨ Key Features

### 1. 🔄 Multi-Exam Profile Switcher

Instantly switch between exam modes using the dropdown. The tool automatically reconfigures:

* **Library:** Shows only relevant tests (e.g., selecting "SSC" hides SEBI tests).
* **Marking Scheme:** Applies exam-specific logic (e.g., **SEBI:** +1.25 / -0.3125, **SSC:** +2.0 / -0.50).
* **Timer:** Sets default durations (e.g., 60 mins vs 120 mins).

### 2. 🧠 Smart Exam Engine

* **Passage Grouping:** Automatically detects and groups questions sharing the same `passage` or `group_id` so they appear side-by-side.
* **Option Shuffling:** Randomizes options for every attempt (unless `noShuffle: true` is set).
* **Confidence Tracking:** Tag answers as *100% Sure*, *50:50*, *Logic*, or *Guess* to analyze your intuition vs. knowledge.
* **Timer Per Question:** Tracks exactly how many seconds you spent on each question.

### 3. 📊 Deep Analysis & Review

* **Instant Result:** Scorecard with accuracy metrics.
* **Recalculation:** "What if" analysis allows you to change the marking scheme (e.g., change SEBI P1 to P2) on the result screen without retaking the test.
* **Smart Review Mode:** One-click option to retake *only* the questions you got wrong, skipped, or marked as "Guess".
* **Topic & Confidence Tables:** Detailed breakdown of performance by subject topic and confidence level.

### 4. 📂 Flexible Library

* **Cloud Sync:** Fetches tests directly from your GitHub repository folders (`tests/sebi`, `tests/ssc`, etc.).
* **Local Upload:** Drag-and-drop or browse local `.json` files.
* **Paste JSON:** Quick-paste feature to add a test from raw text and optionally sync it back to GitHub Issues.
* **Multi-Select:** Select multiple topic-wise tests to merge them into one "Grand Mock" instantly.

---

## 🚀 How to Use

### For Users (Aspirants)

1. Open the tool (e.g., via GitHub Pages).
2. Select your target exam from the top dropdown (Default: SEBI).
3. **Load a Test:**
* Click a cloud icon (☁️) to download a test from the repo.
* Or use **"Paste JSON"** / **"Upload"** buttons to add your own files.


4. **Start:** Click the test card and hit **START**.
5. **Analyze:** After submitting, check the detailed report and download the result as an HTML file for offline storage.

### For Developers / Hosting

1. **Fork this Repository.**
2. **Configure:** Open `index.html` and update the top variables:
```javascript
const REPO_OWNER = "YourUsername";
const REPO_NAME = "Your-Repo-Name";

```


3. **Folder Structure:** Create the following folders inside your repo to organize tests. The tool looks specifically into these folders based on the selected profile:
* `/tests/sebi/`
* `/tests/rbi/`
* `/tests/nabard/`
* `/tests/ssc/`
* `/tests/upsc/`


4. **Add Tests:** Upload your `.json` files into the respective folders.

---

## 📝 JSON Format Specification

To create your own tests, save them as `.json` files using this structure.

### Basic Question

```json
[
  {
    "section": "Quantitative Aptitude",
    "topic": "Profit & Loss",
    "question": "A shopkeeper sells an item for ₹200 at a loss of 20%. What is the Cost Price?",
    "options": ["₹250", "₹240", "₹220", "₹280"],
    "answer": 0,
    "explanation": "Loss = 20%. SP = 80% of CP. <br> 200 = 0.8 * CP <br> CP = 200/0.8 = ₹250."
  }
]

```

### Passage / Grouped Question (RC, DI, Puzzles)

Place questions consecutively. The tool groups them if the `passage` text matches.

```json
[
  {
    "section": "English",
    "topic": "Reading Comprehension",
    "group_id": "rc_01",
    "passage": "<p>The gig economy has blurred lines...</p>",
    "question": "What is the main theme?",
    "options": ["A", "B", "C", "D"],
    "answer": 1,
    "explanation": "..."
  },
  {
    "section": "English",
    "topic": "Reading Comprehension",
    "group_id": "rc_01",
    "passage": "<p>The gig economy has blurred lines...</p>",
    "question": "The author implies...",
    "options": ["X", "Y", "Z", "W"],
    "answer": 2,
    "explanation": "..."
  }
]

```

### Supported Fields

| Field | Type | Description |
| --- | --- | --- |
| `question` | String (HTML) | The question text. Supports `<b>`, `<i>`, `<br>`. |
| `options` | Array | List of options. **Must** be a list of strings. |
| `answer` | Number | The **0-based index** of the correct option (0 = A, 1 = B...). |
| `explanation` | String (HTML) | Explanation shown after the exam. |
| `section` | String | Subject (e.g., "Reasoning", "General Awareness"). |
| `topic` | String | Specific topic (e.g., "Puzzles", "Budget"). |
| `passage` | String (HTML) | Content shown in the split-pane view (left side). |
| `group_id` | String | Optional. Use to force-group questions even if passage text differs slightly. |
| `noShuffle` | Boolean | Set `true` to keep options in fixed order (e.g., "All of the above"). |

---

## 🛠️ Tech Stack

* **HTML5 / CSS3:** Responsive Grid Layout, Flexbox.
* **JavaScript (ES6+):** Async/Await for API calls, LocalStorage for state management.
* **GitHub API:** Used to fetch file lists dynamically from the repository.

## 📄 License

This project is open-source. Feel free to use, modify, and distribute for educational purposes.
