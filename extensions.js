// extensions.js - COMPLETE (Hooks + Shortcuts + S-Pen Annotation)

// --- GLOBAL DRAWING STATE ---
let canvas, ctx;
let isDrawing = false;
let currentTool = 'pen'; // 'pen' or 'highlighter'
let drawings = {}; // Stores paths: { qIndex: [ {points:[], tool:''} ] }
let currentPaths = []; // Current question's paths

// 1. EXAM HOOKS
const EXAM_HOOKS = {
    onExamStart: function(profileName) {
        console.log("Exam Started: " + profileName);
        const nextBtn = document.getElementById('next-btn');
        if(nextBtn) nextBtn.style.background = "#2962ff"; 
        const timer = document.getElementById('timer');
        if(timer) timer.style.display = 'block';
        if (profileName === 'NABARD_P2' && nextBtn) nextBtn.style.background = "#673ab7"; 
        
        // Initialize Drawing Canvas
        initCanvas();
    },

    onQuestionLoad: function(profileName, question, index) {
        const cBox = document.getElementById('conf-box');
        
        // Setup Canvas for new Question
        setTimeout(() => resizeAndLoadCanvas(index), 50); // Small delay for DOM layout

        // Descriptive Logic
        if (question.type === 'descriptive') {
            if(cBox) cBox.style.display = 'none';
            const box = document.getElementById('options-box');
            const textArea = box ? box.querySelector('textarea') : null;
            if (textArea && !document.getElementById('word-counter-' + index)) {
                const counter = document.createElement('div');
                counter.id = 'word-counter-' + index;
                counter.style.cssText = "font-size:0.85rem; color:#555; text-align:right; margin-bottom:5px; font-family:monospace;";
                const updateCount = () => {
                    const text = textArea.value.trim();
                    const wC = text === "" ? 0 : text.split(/\s+/).length;
                    counter.innerText = `Words: ${wC} | Chars: ${text.length}`;
                    counter.style.color = wC > 400 ? "#d32f2f" : "#555";
                    counter.style.fontWeight = wC > 400 ? "bold" : "normal";
                };
                updateCount();
                textArea.addEventListener('input', updateCount);
                box.insertBefore(counter, textArea);
            }
        } else {
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

function resizeAndLoadCanvas(qIndex) {
    if(!canvas) return;
    const container = document.getElementById('touch-area');
    
    // Resize canvas to full scrollable height
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
    // NOTE: In real app, you'd want to persist 'drawings' to localStorage too
    // But strokes are heavy, so we keep in RAM for session only here.
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
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    // Exam Screen Shortcuts
    const examScreen = document.getElementById('exam-screen');
    if (examScreen && examScreen.classList.contains('active')) {
        const key = e.key.toLowerCase();
        if (e.key === 'ArrowRight') { if (typeof nextQ === 'function') nextQ(); } 
        else if (e.key === 'ArrowLeft') { if (typeof prevQ === 'function') prevQ(); }
        if (['1', '2', '3', '4', '5'].includes(e.key)) {
            const idx = parseInt(e.key) - 1;
            const options = document.querySelectorAll('#options-box .opt-label');
            if (options[idx]) options[idx].click();
        }
        const confMap = { 'w': '100%', 'a': '50:50', 'd': 'Logic', 's': 'Guess' };
        if (confMap[key]) {
            const targetText = confMap[key];
            const buttons = document.querySelectorAll('.c-btn');
            buttons.forEach(btn => { if (btn.innerText.trim() === targetText) btn.click(); });
        }
    }

    // Result Screen Shortcuts (Snap Scroll)
    const resScreen = document.getElementById('result-screen');
    if (resScreen && resScreen.classList.contains('active')) {
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
