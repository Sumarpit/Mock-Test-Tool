// extensions.js - COMPLETE (Hooks + Shortcuts + S-Pen + TCS Mode + Smart Nav)

// --- GLOBAL DRAWING STATE ---
let canvas, ctx;
let isDrawing = false;
let currentTool = 'pen'; // 'pen' or 'highlighter'
let drawings = {}; // Stores paths: { qIndex: [ {points:[], tool:''} ] }
let currentPaths = []; // Current question's paths

// 1. EXAM HOOKS
const EXAM_HOOKS = {
    // Run when Exam Starts
    onExamStart: function(profileName) {
        console.log("Exam Started: " + profileName);
        
        const nextBtn = document.getElementById('next-btn');
        if(nextBtn) nextBtn.style.background = "#2962ff"; // Default Blue
        
        const timer = document.getElementById('timer');
        if(timer) timer.style.display = 'block';

        // --- PROFILE SPECIFIC THEMES & MODES ---
        
        // 1. SEBI Phase 2 (TCS iON Strict Mode)
        if (profileName === 'SEBI_P2') {
            document.body.classList.add('tcs-mode'); // Trigger CSS overrides
            if(nextBtn) nextBtn.style.background = "#00796b"; // Teal Theme
        } else {
            document.body.classList.remove('tcs-mode'); // Reset for other exams
        }

        // 2. NABARD Phase 2 (Purple Theme)
        if (profileName === 'NABARD_P2' && nextBtn) {
            nextBtn.style.background = "#673ab7"; 
        }
        
        // Initialize Drawing Canvas
        initCanvas();
    },

    // Run when Question Loads
    onQuestionLoad: function(profileName, question, index) {
        const cBox = document.getElementById('conf-box');
        const optionsBox = document.getElementById('options-box');
        
        // Setup Canvas for new Question (Delay ensures DOM is ready)
        setTimeout(() => resizeAndLoadCanvas(index), 50); 

        // --- LOGIC FOR DESCRIPTIVE QUESTIONS ---
        if (question.type === 'descriptive') {
            if(cBox) cBox.style.display = 'none'; // Hide confidence box
            
            const textArea = optionsBox ? optionsBox.querySelector('textarea') : null;
            
            if (textArea) {
                // TCS MODE SPECIFIC ENFORCEMENT
                if (document.body.classList.contains('tcs-mode')) {
                    textArea.classList.add('tcs-textarea');
                    textArea.setAttribute('spellcheck', 'false'); // Disable spellcheck
                    textArea.setAttribute('onpaste', 'return false'); // Disable paste
                    textArea.setAttribute('autocomplete', 'off');
                }

                // Inject Word Counter
                if (!document.getElementById('word-counter-' + index)) {
                    const counter = document.createElement('div');
                    counter.id = 'word-counter-' + index;
                    
                    // Style depends on mode
                    if (document.body.classList.contains('tcs-mode')) {
                        counter.className = 'tcs-word-count'; // Use CSS class
                    } else {
                        counter.style.cssText = "font-size:0.85rem; color:#555; text-align:right; margin-bottom:5px; font-family:monospace;";
                    }

                    const updateCount = () => {
                        const text = textArea.value.trim();
                        const wC = text === "" ? 0 : text.split(/\s+/).length;
                        const cC = text.length;
                        counter.innerText = `Words: ${wC} | Chars: ${cC}`;
                        
                        // Warning logic (Standard mode only)
                        if (!document.body.classList.contains('tcs-mode')) {
                            counter.style.color = wC > 400 ? "#d32f2f" : "#555";
                            counter.style.fontWeight = wC > 400 ? "bold" : "normal";
                        }
                    };
                    updateCount();
                    textArea.addEventListener('input', updateCount);
                    
                    // In TCS Mode, counter goes AFTER text area. In Standard, BEFORE.
                    if (document.body.classList.contains('tcs-mode')) {
                        optionsBox.appendChild(counter);
                    } else {
                        optionsBox.insertBefore(counter, textArea);
                    }
                }
            }
        } 
        // --- LOGIC FOR OBJECTIVE QUESTIONS ---
        else {
             if(cBox) cBox.style.display = 'block';
        }
    }
};

// 2. CANVAS & S-PEN LOGIC
function initCanvas() {
    canvas = document.getElementById('drawing-canvas');
    if(!canvas) return;
    ctx = canvas.getContext('2d', { alpha: true });
    
    // Bind Events (Pointer Events handle Mouse, Touch, and Pen)
    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', endDraw);
    canvas.addEventListener('pointerout', endDraw);
    
    // Allow passing clicks through canvas if not drawing
    canvas.style.pointerEvents = 'none'; 
    
    // Smart Event Listener on Parent to detect Pen
    const container = document.getElementById('touch-area');
    if (container) {
        container.addEventListener('pointerdown', (e) => {
            // If it's a PEN, activate canvas immediately
            if (e.pointerType === 'pen') {
                canvas.style.pointerEvents = 'auto'; // Capture the stroke
                // We might miss the first down event, so manually trigger
                canvas.dispatchEvent(new PointerEvent('pointerdown', e));
            } else {
                // If Finger/Mouse, let it scroll/click options (Pass through)
                canvas.style.pointerEvents = 'none';
            }
        });
    }
}

function resizeAndLoadCanvas(qIndex) {
    if(!canvas) return;
    const container = document.getElementById('touch-area');
    if (!container) return;
    
    // Resize canvas to full scrollable height (Supports Split Screen)
    canvas.width = container.offsetWidth;
    canvas.height = container.scrollHeight; 
    
    // Clear and Redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentPaths = drawings[qIndex] || [];
    redrawCanvas();
}

function startDraw(e) {
    if (e.pointerType !== 'pen' && e.button !== 0) return; // Prioritize Pen, allow Left Mouse
    isDrawing = true;
    canvas.setPointerCapture(e.pointerId); // Lock input to canvas
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top; // Correct for scroll is handled by CSS positioning
    
    // Start a new path
    currentPaths.push({
        tool: currentTool,
        points: [{x, y}]
    });
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setupBrush();
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Save point
    currentPaths[currentPaths.length - 1].points.push({x, y});
    
    // Draw visual
    ctx.lineTo(x, y);
    ctx.stroke();
}

function endDraw(e) {
    if (!isDrawing) return;
    isDrawing = false;
    canvas.releasePointerCapture(e.pointerId);
    
    // Save to global storage
    if(typeof currIdx !== 'undefined') drawings[currIdx] = currentPaths;
}

function setupBrush() {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (currentTool === 'pen') {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#e74c3c'; // Red Pen
        ctx.globalCompositeOperation = 'source-over';
    } else if (currentTool === 'highlighter') {
        ctx.lineWidth = 15;
        ctx.strokeStyle = 'rgba(255, 235, 59, 0.4)'; // Transparent Yellow
        ctx.globalCompositeOperation = 'multiply'; // Blends with text
    }
}

function redrawCanvas() {
    if(!currentPaths.length) return;
    currentPaths.forEach(path => {
        ctx.beginPath();
        // Set style based on saved tool
        if (path.tool === 'pen') {
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#e74c3c';
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.lineWidth = 15;
            ctx.strokeStyle = 'rgba(255, 235, 59, 0.4)';
            ctx.globalCompositeOperation = 'multiply';
        }
        
        if(path.points.length > 0) {
            ctx.moveTo(path.points[0].x, path.points[0].y);
            for (let i = 1; i < path.points.length; i++) {
                ctx.lineTo(path.points[i].x, path.points[i].y);
            }
            ctx.stroke();
        }
    });
}

// Global functions for Toolbar
window.setTool = function(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    if(tool === 'pen') document.getElementById('tool-pen').classList.add('active');
    if(tool === 'highlighter') document.getElementById('tool-high').classList.add('active');
};

window.clearCanvas = function() {
    if(!canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentPaths = [];
    if(typeof currIdx !== 'undefined') drawings[currIdx] = [];
};


// 3. KEYBOARD SHORTCUTS
document.addEventListener('keydown', (e) => {
    // A. SAFETY CHECK: Don't run shortcuts if typing in a text box
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    // --- CONTEXT 1: EXAM SCREEN SHORTCUTS ---
    const examScreen = document.getElementById('exam-screen');
    if (examScreen && examScreen.classList.contains('active')) {
        const key = e.key.toLowerCase();

        // 1. Navigation
        if (e.key === 'ArrowRight') { if (typeof nextQ === 'function') nextQ(); } 
        else if (e.key === 'ArrowLeft') { if (typeof prevQ === 'function') prevQ(); }

        // 2. Option Selection
        if (['1', '2', '3', '4', '5'].includes(e.key)) {
            const idx = parseInt(e.key) - 1;
            const options = document.querySelectorAll('#options-box .opt-label');
            if (options[idx]) options[idx].click();
        }

        // 3. Confidence Selection
        const confMap = { 'w': '100%', 'a': '50:50', 'd': 'Logic', 's': 'Guess' };
        if (confMap[key]) {
            const targetText = confMap[key];
            const buttons = document.querySelectorAll('.c-btn');
            buttons.forEach(btn => { if (btn.innerText.trim() === targetText) btn.click(); });
        }
    }

    // --- CONTEXT 2: RESULT SCREEN SHORTCUTS ---
    const resScreen = document.getElementById('result-screen');
    if (resScreen && resScreen.classList.contains('active')) {
        // Smart Scrolling
        if (e.code === 'Space') {
            e.preventDefault(); 
            const items = document.querySelectorAll('.review-item');
            const headerOffset = 20; 
            const currentTop = window.scrollY + headerOffset + 10; 
            let nextItem = null;
            for (let item of items) {
                if (item.offsetTop > currentTop) { nextItem = item; break; }
            }
            if (nextItem) {
                window.scrollTo({ top: nextItem.offsetTop - headerOffset, behavior: 'smooth' });
            }
        }
    }
});

// 4. SMART GESTURE NAVIGATION (STRICTLY BLOCKS PEN)
(function initSmartGestures() {
    const container = document.getElementById('touch-area');
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let isValidSwipe = false;

    // Use POINTER events instead of TOUCH events to reliably detect Pen
    container.addEventListener('pointerdown', (e) => {
        // STRICT FILTER: Only 'touch' (finger) is allowed for navigation.
        // 'pen' and 'mouse' are completely ignored for swipe logic.
        if (e.pointerType !== 'touch') {
            isValidSwipe = false;
            return;
        }

        // If we are somehow drawing, also ignore
        if (isDrawing) {
            isValidSwipe = false;
            return;
        }

        isValidSwipe = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    container.addEventListener('pointerup', (e) => {
        if (!isValidSwipe) return;

        const endX = e.clientX;
        const endY = e.clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Thresholds: Swipe must be > 80px horizontal and < 60px vertical
        // This prevents scrolling from being interpreted as a swipe
        if (Math.abs(diffX) > 80 && Math.abs(diffY) < 60) {
            if (diffX > 0) {
                // Swipe Left -> Next
                if (typeof nextQ === 'function') nextQ();
            } else {
                // Swipe Right -> Prev
                if (typeof prevQ === 'function') prevQ();
            }
        }
        
        isValidSwipe = false; // Reset
    });
})();
