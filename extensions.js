// extensions.js
// This file handles specific behavioral overrides for exams.

const EXAM_HOOKS = {
    
    // 1. Run when the Exam Starts (Initialize UI)
    onExamStart: function(profileName) {
        console.log("Extension Hook: Exam Started for " + profileName);
        
        // Reset Defaults (Important so previous exam settings don't stick)
        document.getElementById('next-btn').style.background = "#2962ff"; 
        document.getElementById('timer').style.display = 'block';

        // --- CUSTOMIZATIONS ---

        // Example: For NABARD Phase 2, change button color to Purple to indicate "Phase 2 Mode"
        if (profileName === 'NABARD_P2') {
            document.getElementById('next-btn').style.background = "#673ab7"; // Deep Purple
        }

        // Example: For SSC, maybe you want to hide the timer? (Just an example)
        if (profileName === 'SSC_NO_TIMER') {
            document.getElementById('timer').style.display = 'none';
        }
    },

    // 2. Run every time a Question Loads (Per-Question Logic)
    onQuestionLoad: function(profileName, question, index) {
        // Reset defaults
        const cBox = document.getElementById('conf-box');
        
        // --- CUSTOMIZATIONS ---

        // Logic: If it's NABARD Phase 2, we might want to hide Confidence options 
        // even for objective questions if we want to simulate a standard exam feel.
        if (profileName === 'NABARD_P2') {
            if (question.type === 'descriptive') {
                cBox.style.display = 'none'; // Always hide for descriptive
            } else {
                // Optional: Hide for objective too if you prefer
                // cBox.style.display = 'none'; 
            }
        }
    }
};
