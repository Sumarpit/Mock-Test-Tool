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

{
  "meta": {
    "title": "SEBI P2 English (Master Template)",
    "description": "Full mock covering Essay (30), Precis (30), and RC (40).",
    "defaultMarks": 10.0,
    "defaultNegative": 0.0
  },
  "passages": {
    "PRECIS_TEXT": "<b>Read the following text and write a precis:</b><br><br>The concept of 'Financial Inclusion' has moved from the fringes to the center stage of global economic development policy. It is widely recognized that access to financial services is a crucial enabler for reducing poverty and boosting prosperity. However, the mere opening of bank accounts is not enough; the real challenge lies in ensuring these accounts are actively used. Behavioral economics suggests that scarcity—whether of money or time—taxes our cognitive bandwidth, leading to poor decision-making. Therefore, financial products must be designed to be simple, transparent, and aligned with the behavioral patterns of the poor... [Content would continue for approx 500 words] ... Ultimately, technology (FinTech) acts as the bridge, lowering costs and increasing reach, but human-centric design remains the key to true inclusion.",
    "RC_TEXT": "<b>Read the passage below to answer the following 5 questions:</b><br><br><b>The Role of Credit Rating Agencies (CRAs)</b><br>Credit Rating Agencies play a pivotal role in financial markets by assessing the creditworthiness of issuers of debt obligations. Their ratings serve as a benchmark for investors, allowing them to gauge the risk associated with various investment instruments. However, the 2008 Global Financial Crisis exposed significant cracks in this system. The 'Issuer-Pays' model, where the entity issuing the bond pays the agency for the rating, creates an inherent conflict of interest. Agencies might feel pressured to grant favorable ratings to retain business.<br><br>SEBI has since tightened regulations, mandating stricter disclosure norms and separating the rating and non-rating businesses of CRAs. Yet, the reliance on ratings remains high. Investors often treat ratings as a guarantee rather than an opinion, leading to herd behavior when a downgrade occurs. The future of the industry depends on diversifying revenue models and incorporating alternative data points beyond traditional financial metrics to provide a more holistic view of credit risk."
  },
  "questions": [
    {
      "section": "English Descriptive",
      "type": "descriptive",
      "topic": "Essay",
      "question": "<b>Q.1) Essay Writing (30 Marks)</b><br>Write an essay of approx 300 words on <b>ONE</b> of the following topics:<br><br>1. The impact of 'Finfluencers' on retail investor behavior.<br>2. Can AI replace human judgment in corporate governance?<br>3. The role of the derivatives market in price discovery vs. speculation.<br>4. Sustainable Finance: Hype or Reality?",
      "options": [],
      "answer": null,
      "marks": 30.0
    },
    {
      "section": "English Descriptive",
      "type": "descriptive",
      "topic": "Precis",
      "passageId": "PRECIS_TEXT",
      "question": "<b>Q.2) Precis Writing (30 Marks)</b><br>Write a precis of the provided article in about 170-200 words. Provide a suitable title.",
      "options": [],
      "answer": null,
      "marks": 30.0
    },
    {
      "section": "English Descriptive",
      "type": "descriptive",
      "topic": "Reading Comprehension",
      "passageId": "RC_TEXT",
      "question": "<b>Q.3 (i)</b><br>According to the passage, what is the 'inherent conflict of interest' in the operation of Credit Rating Agencies?",
      "options": [],
      "answer": null,
      "marks": 8.0
    },
    {
      "section": "English Descriptive",
      "type": "descriptive",
      "topic": "Reading Comprehension",
      "passageId": "RC_TEXT",
      "question": "<b>Q.3 (ii)</b><br>How did SEBI respond to the vulnerabilities exposed by the financial crisis regarding CRAs?",
      "options": [],
      "answer": null,
      "marks": 8.0
    },
    {
      "section": "English Descriptive",
      "type": "descriptive",
      "topic": "Reading Comprehension",
      "passageId": "RC_TEXT",
      "question": "<b>Q.3 (iii)</b><br>Explain the author's view on investor behavior regarding credit ratings.",
      "options": [],
      "answer": null,
      "marks": 8.0
    },
    {
      "section": "English Descriptive",
      "type": "descriptive",
      "topic": "Reading Comprehension",
      "passageId": "RC_TEXT",
      "question": "<b>Q.3 (iv)</b><br>What suggestions does the passage offer for the future of the credit rating industry?",
      "options": [],
      "answer": null,
      "marks": 8.0
    },
    {
      "section": "English Descriptive",
      "type": "descriptive",
      "topic": "Reading Comprehension",
      "passageId": "RC_TEXT",
      "question": "<b>Q.3 (v)</b><br>Why are ratings described as an 'opinion' rather than a 'guarantee' in the text?",
      "options": [],
      "answer": null,
      "marks": 8.0
    }
  ]
}

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
