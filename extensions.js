// extensions.js - COMPLETE FILE

// 1. Hook Logic (Must be inside this object)
const EXAM_HOOKS = {
    // Run when Exam Starts
    onExamStart: function(profileName) {
        console.log("Exam Started: " + profileName);
        document.getElementById('next-btn').style.background = "#2962ff"; 
        document.getElementById('timer').style.display = 'block';

        if (profileName === 'NABARD_P2') {
            document.getElementById('next-btn').style.background = "#673ab7"; 
        }
    },

    // Run when Question Loads
    onQuestionLoad: function(profileName, question, index) {
        const cBox = document.getElementById('conf-box');
        
        // Logic for Descriptive Questions
        if (question.type === 'descriptive') {
            cBox.style.display = 'none'; // Hide confidence buttons
            
            // Add Word Counter
            const box = document.getElementById('options-box');
            const textArea = box.querySelector('textarea');

            if (textArea) {
                if (!document.getElementById('word-counter-' + index)) {
                    const counter = document.createElement('div');
                    counter.id = 'word-counter-' + index;
                    counter.style.fontSize = "0.85rem";
                    counter.style.color = "#555";
                    counter.style.textAlign = "right";
                    counter.style.marginBottom = "5px";
                    counter.style.fontFamily = "monospace";
                    
                    const updateCount = () => {
                        const text = textArea.value.trim();
                        const wordCount = text === "" ? 0 : text.split(/\s+/).length;
                        const charCount = text.length;
                        counter.innerText = `Words: ${wordCount} | Chars: ${charCount}`;
                        
                        if (wordCount > 400) {
                            counter.style.color = "#d32f2f";
                            counter.style.fontWeight = "bold";
                        } else {
                            counter.style.color = "#555";
                            counter.style.fontWeight = "normal";
                        }
                    };
                    updateCount();
                    textArea.addEventListener('input', updateCount);
                    box.insertBefore(counter, textArea);
                }
            }
        } 
        // Logic for Objective Questions
        else {
             cBox.style.display = 'block';
        }
    }
}; // <--- CRITICAL: This closes the EXAM_HOOKS object. Do not delete this!


// 2. KEYBOARD SHORTCUTS (Must be OUTSIDE the EXAM_HOOKS object)

// A. Exam Shortcuts (WASD, Arrows, Numbers)
document.addEventListener('keydown', (e) => {
    const examScreen = document.getElementById('exam-screen');
    
    // Only run if Exam Screen is active
    if (!examScreen || !examScreen.classList.contains('active')) return;

    // SAFETY: Stop if user is typing in a text box
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    const key = e.key.toLowerCase();

    // Navigation
    if (e.key === 'ArrowRight') {
        if (typeof nextQ === 'function') nextQ();
    } 
    else if (e.key === 'ArrowLeft') {
        if (typeof prevQ === 'function') prevQ();
    }

    // Option Selection (1-5)
    if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        const options = document.querySelectorAll('#options-box .opt-label');
        if (options[idx]) options[idx].click();
    }

    // Confidence Selection (WASD)
    const confMap = { 'w': '100%', 'a': '50:50', 'd': 'Logic', 's': 'Guess' };
    if (confMap[key]) {
        const targetText = confMap[key];
        const buttons = document.querySelectorAll('.c-btn');
        buttons.forEach(btn => {
            if (btn.innerText.trim() === targetText) btn.click();
        });
    }
});

// B. Result Page Smart Scrolling (Spacebar)
document.addEventListener('keydown', (e) => {
    const resScreen = document.getElementById('result-screen');
    
    // Only run if Result Screen is active
    if (!resScreen || !resScreen.classList.contains('active')) return;

    // Ignore if typing
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Spacebar Logic
    if (e.code === 'Space') {
        e.preventDefault(); 
        const items = document.querySelectorAll('.review-item');
        const headerOffset = 80; 
        const currentTop = window.scrollY + headerOffset + 10; 

        let nextItem = null;
        for (let item of items) {
            if (item.offsetTop > currentTop) {
                nextItem = item;
                break; 
            }
        }
        if (nextItem) {
            window.scrollTo({
                top: nextItem.offsetTop - headerOffset,
                behavior: 'smooth'
            });
        }
    }
});
