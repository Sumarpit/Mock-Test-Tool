// extensions.js
// Handles specific behavioral overrides and UI injections.

const EXAM_HOOKS = {
    
    // 1. Run when the Exam Starts
    onExamStart: function(profileName) {
        console.log("Exam Started: " + profileName);
        
        // Reset defaults
        document.getElementById('next-btn').style.background = "#2962ff"; 
        document.getElementById('timer').style.display = 'block';

        // NABARD Phase 2 Specifics
        if (profileName === 'NABARD_P2') {
            document.getElementById('next-btn').style.background = "#673ab7"; // Purple Theme
        }
    },

    // 2. Run every time a Question Loads
    onQuestionLoad: function(profileName, question, index) {
        const cBox = document.getElementById('conf-box');
        
        // --- LOGIC FOR DESCRIPTIVE QUESTIONS ---
        if (question.type === 'descriptive') {
            // 1. Always hide Confidence Box for descriptive
            cBox.style.display = 'none';

            // 2. Inject Word Counter Logic
            // We look inside 'options-box' where the textarea lives
            const box = document.getElementById('options-box');
            const textArea = box.querySelector('textarea');

            if (textArea) {
                // Prevent duplicate counters if we revisit the question
                if (!document.getElementById('word-counter-' + index)) {
                    
                    // Create Counter UI
                    const counter = document.createElement('div');
                    counter.id = 'word-counter-' + index;
                    counter.style.fontSize = "0.85rem";
                    counter.style.color = "#555";
                    counter.style.textAlign = "right";
                    counter.style.marginBottom = "5px";
                    counter.style.fontFamily = "monospace";
                    
                    // Define Counting Logic
                    const updateCount = () => {
                        const text = textArea.value.trim();
                        // Count words (split by spaces)
                        const wordCount = text === "" ? 0 : text.split(/\s+/).length;
                        const charCount = text.length;
                        
                        counter.innerText = `Words: ${wordCount} | Chars: ${charCount}`;

                        // Simulating TCS iON Limit Warning (e.g., usually ~400 words)
                        // Turn text Red if it exceeds a 'safe' limit
                        if (wordCount > 400) {
                            counter.style.color = "#d32f2f"; // Warning Red
                            counter.style.fontWeight = "bold";
                        } else {
                            counter.style.color = "#555";
                            counter.style.fontWeight = "normal";
                        }
                    };

                    // Initialize count immediately
                    updateCount();

                    // Attach listener to update as you type
                    textArea.addEventListener('input', updateCount);

                    // Insert Counter BEFORE the text area
                    box.insertBefore(counter, textArea);
                }
            }
        } 
        // --- LOGIC FOR OBJECTIVE QUESTIONS ---
        else {
            // Restore Confidence Box if it was hidden
            // (Unless you want to hide it for NABARD P2 objective questions too)
             if (profileName === 'NABARD_P2') {
                 // Optional: Keep it hidden if you want pure exam feel
                 // cBox.style.display = 'none';
                 cBox.style.display = 'block'; // Or show it
             } else {
                 cBox.style.display = 'block';
             }
        }
    }
};
