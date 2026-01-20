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
// ... (Your existing EXAM_HOOKS code ends here) ...

// --- FEATURE: SMART SPACEBAR SCROLLING (RESULT PAGE) ---
document.addEventListener('keydown', (e) => {
    const resScreen = document.getElementById('result-screen');
    
    // 1. Only run if we are currently on the Result Screen
    if (!resScreen || !resScreen.classList.contains('active')) return;

    // 2. Ignore if typing in a search box or text area (safety check)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // 3. Detect SPACEBAR press
    if (e.code === 'Space') {
        e.preventDefault(); // Stop the default "jerky" page down scroll

        const items = document.querySelectorAll('.review-item');
        const headerOffset = 80; // Buffer for the top sticky header (adjust if needed)
        
        // Calculate where we are currently looking (Top of screen + buffer)
        // We add a small +10px buffer so if we are already perfectly aligned, 
        // it knows to jump to the NEXT one, not stay on the current one.
        const currentTop = window.scrollY + headerOffset + 10; 

        // 4. Find the Next Box
        let nextItem = null;
        for (let item of items) {
            // Find the first question box whose top edge is below our current view
            if (item.offsetTop > currentTop) {
                nextItem = item;
                break; // Found it! Stop looking.
            }
        }

        // 5. Scroll Smoothly
        if (nextItem) {
            window.scrollTo({
                top: nextItem.offsetTop - headerOffset, // Align to top (minus header space)
                behavior: 'smooth'
            });
        }
    }
});
