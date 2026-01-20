// extensions.js - COMPLETE & FIXED

// 1. EXAM HOOKS (Logic for UI changes during exam)
const EXAM_HOOKS = {
    // Run when Exam Starts
    onExamStart: function(profileName) {
        console.log("Exam Started: " + profileName);
        
        // Reset defaults
        const nextBtn = document.getElementById('next-btn');
        if(nextBtn) nextBtn.style.background = "#2962ff"; 
        
        const timer = document.getElementById('timer');
        if(timer) timer.style.display = 'block';

        // NABARD Phase 2 Specifics (Purple Theme)
        if (profileName === 'NABARD_P2' && nextBtn) {
            nextBtn.style.background = "#673ab7"; 
        }
    },

    // Run when Question Loads
    onQuestionLoad: function(profileName, question, index) {
        const cBox = document.getElementById('conf-box');
        
        // --- LOGIC FOR DESCRIPTIVE QUESTIONS ---
        if (question.type === 'descriptive') {
            if(cBox) cBox.style.display = 'none'; // Hide confidence buttons
            
            // Inject Word Counter
            const box = document.getElementById('options-box');
            const textArea = box ? box.querySelector('textarea') : null;

            if (textArea) {
                if (!document.getElementById('word-counter-' + index)) {
                    const counter = document.createElement('div');
                    counter.id = 'word-counter-' + index;
                    counter.style.cssText = "font-size:0.85rem; color:#555; text-align:right; margin-bottom:5px; font-family:monospace;";
                    
                    const updateCount = () => {
                        const text = textArea.value.trim();
                        const wordCount = text === "" ? 0 : text.split(/\s+/).length;
                        const charCount = text.length;
                        counter.innerText = `Words: ${wordCount} | Chars: ${charCount}`;
                        
                        // Warning if exceeding typical limit (400 words)
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
        // --- LOGIC FOR OBJECTIVE QUESTIONS ---
        else {
             if(cBox) cBox.style.display = 'block';
        }
    }
}; 

// 2. KEYBOARD SHORTCUTS (Outside the Hook Object)

document.addEventListener('keydown', (e) => {
    // A. SAFETY CHECK: Don't run shortcuts if typing in a text box
    // This allows typing answers for descriptive questions without triggering navigation
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    // --- CONTEXT 1: EXAM SCREEN SHORTCUTS ---
    const examScreen = document.getElementById('exam-screen');
    if (examScreen && examScreen.classList.contains('active')) {
        
        const key = e.key.toLowerCase();

        // 1. Navigation (Left/Right Arrows)
        if (e.key === 'ArrowRight') {
            if (typeof nextQ === 'function') nextQ();
        } 
        else if (e.key === 'ArrowLeft') {
            if (typeof prevQ === 'function') prevQ();
        }

        // 2. Option Selection (Number Keys 1-5)
        if (['1', '2', '3', '4', '5'].includes(e.key)) {
            const idx = parseInt(e.key) - 1;
            const options = document.querySelectorAll('#options-box .opt-label');
            // Simulate click to trigger save logic
            if (options[idx]) options[idx].click();
        }

        // 3. Confidence Selection (WASD)
        // W=100%, A=50:50, S=Guess, D=Logic
        const confMap = { 'w': '100%', 'a': '50:50', 'd': 'Logic', 's': 'Guess' };
        if (confMap[key]) {
            const targetText = confMap[key];
            const buttons = document.querySelectorAll('.c-btn');
            buttons.forEach(btn => {
                if (btn.innerText.trim() === targetText) btn.click();
            });
        }
    }

    // --- CONTEXT 2: RESULT SCREEN SHORTCUTS ---
    const resScreen = document.getElementById('result-screen');
    if (resScreen && resScreen.classList.contains('active')) {
        
        // Smart Scrolling with Spacebar
        if (e.code === 'Space') {
            e.preventDefault(); // Stop default jumpy scroll
            
            const items = document.querySelectorAll('.review-item');
            const headerOffset = 20; // Adjust for comfort
            const currentTop = window.scrollY + headerOffset + 10; 

            // Find the next question box below current view
            let nextItem = null;
            for (let item of items) {
                if (item.offsetTop > currentTop) {
                    nextItem = item;
                    break; 
                }
            }

            // Smooth scroll to it
            if (nextItem) {
                window.scrollTo({
                    top: nextItem.offsetTop - headerOffset,
                    behavior: 'smooth'
                });
            }
        }
    }
});
