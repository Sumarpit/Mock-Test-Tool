// extensions.js - COMPLETE (Hooks + Shortcuts + S-Pen + TCS Mode + Smart Nav)

// --- GLOBAL DRAWING STATE ---
let canvas, ctx;
let isDrawing = false;
let currentTool = 'pen'; 
let drawings = {}; 
let currentPaths = []; 

// 1. EXAM HOOKS
const EXAM_HOOKS = {
    onExamStart: function(profileName) {
        console.log("Exam Started: " + profileName);
        
        const nextBtn = document.getElementById('next-btn');
        if(nextBtn) nextBtn.style.background = "#2962ff"; 
        
        const timer = document.getElementById('timer');
        if(timer) timer.style.display = 'block';

        if (profileName === 'SEBI_P2') {
            document.body.classList.add('tcs-mode'); 
            if(nextBtn) nextBtn.style.background = "#00796b"; 
            
            const toolbar = document.querySelector('.annot-toolbar');
            if(toolbar) toolbar.style.display = 'none';

            const sidebar = document.getElementById('pane-sidebar');
            if(sidebar) {
                sidebar.classList.remove('collapsed');
                sidebar.style.width = "280px"; 
            }
            
            const handle = document.querySelector('.sidebar-handle');
            if(handle) handle.style.display = 'none';

        } else {
            document.body.classList.remove('tcs-mode');
            const toolbar = document.querySelector('.annot-toolbar');
            if(toolbar) toolbar.style.display = 'flex';
            
            const handle = document.querySelector('.sidebar-handle');
            if(handle) handle.style.display = 'flex';
        }

        if (profileName === 'NABARD_P2' && nextBtn) {
            nextBtn.style.background = "#673ab7"; 
        }
        
        initCanvas();
    },

    onQuestionLoad: function(profileName, question, index) {
        const cBox = document.getElementById('conf-box');
        const optionsBox = document.getElementById('options-box');
        
        setTimeout(() => resizeAndLoadCanvas(index), 50); 

        if (question.type === 'descriptive') {
            if(cBox) cBox.style.display = 'none'; 
            
            const textArea = optionsBox ? optionsBox.querySelector('textarea') : null;
            
            if (textArea) {
                if (document.body.classList.contains('tcs-mode')) {
                    textArea.classList.add('tcs-textarea');
                    textArea.setAttribute('spellcheck', 'false'); 
                    textArea.setAttribute('onpaste', 'return false'); 
                    textArea.setAttribute('autocomplete', 'off');
                }

                if (!document.getElementById('word-counter-' + index)) {
                    const counter = document.createElement('div');
                    counter.id = 'word-counter-' + index;
                    
                    if (document.body.classList.contains('tcs-mode')) {
                        counter.className = 'tcs-word-count'; 
                    } else {
                        counter.style.cssText = "font-size:0.85rem; color:#555; text-align:right; margin-bottom:5px; font-family:monospace;";
                    }

                    const updateCount = () => {
                        const text = textArea.value.trim();
                        const wC = text === "" ? 0 : text.split(/\s+/).length;
                        const cC = text.length;
                        counter.innerText = `Words: ${wC} | Chars: ${cC}`;
                        
                        if (!document.body.classList.contains('tcs-mode')) {
                            counter.style.color = wC > 400 ? "#d32f2f" : "#555";
                            counter.style.fontWeight = wC > 400 ? "bold" : "normal";
                        }
                    };
                    updateCount();
                    textArea.addEventListener('input', updateCount);
                    
                    if (document.body.classList.contains('tcs-mode')) {
                        optionsBox.appendChild(counter);
                    } else {
                        optionsBox.insertBefore(counter, textArea);
                    }
                }
            }
        } 
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
    
    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', endDraw);
    canvas.addEventListener('pointerout', endDraw);
    
    canvas.style.pointerEvents = 'none'; 
    
    const container = document.getElementById('touch-area');
    if (container) {
        container.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'pen') {
                canvas.style.pointerEvents = 'auto'; 
                canvas.dispatchEvent(new PointerEvent('pointerdown', e));
            } else {
                canvas.style.pointerEvents = 'none';
            }
        });
    }
}

function resizeAndLoadCanvas(qIndex) {
    if(!canvas) return;
    const container = document.getElementById('touch-area');
    if (!container) return;
    
    // FIX: Multiply resolution by devicePixelRatio for HD Pen Strokes
    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.offsetWidth * dpr;
    canvas.height = container.scrollHeight * dpr;
    
    // Scale CSS visually back to normal size
    canvas.style.width = container.offsetWidth + 'px';
    canvas.style.height = container.scrollHeight + 'px';
    
    // Normalize coordinates for the context
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentPaths = drawings[qIndex] || [];
    redrawCanvas();
}

function startDraw(e) {
    if (e.pointerType !== 'pen' && e.button !== 0) return; 
    isDrawing = true;
    canvas.setPointerCapture(e.pointerId); 
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top; 
    
    currentPaths.push({ tool: currentTool, points: [{x, y}] });
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setupBrush();
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    currentPaths[currentPaths.length - 1].points.push({x, y});
    
    ctx.lineTo(x, y);
    ctx.stroke();
}

function endDraw(e) {
    if (!isDrawing) return;
    isDrawing = false;
    canvas.releasePointerCapture(e.pointerId);
    
    if(typeof currIdx !== 'undefined') drawings[currIdx] = currentPaths;
}

function setupBrush() {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (currentTool === 'pen') {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#e74c3c'; 
        ctx.globalCompositeOperation = 'source-over';
    } else if (currentTool === 'highlighter') {
        ctx.lineWidth = 15;
        ctx.strokeStyle = 'rgba(255, 235, 59, 0.4)'; 
        ctx.globalCompositeOperation = 'multiply'; 
    }
}

function redrawCanvas() {
    if(!currentPaths.length) return;
    currentPaths.forEach(path => {
        ctx.beginPath();
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

// 4. SMART GESTURE NAVIGATION
(function initSmartGestures() {
    const container = document.getElementById('touch-area');
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let isValidSwipe = false;

    container.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') {
            isValidSwipe = false;
            return;
        }
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

        if (Math.abs(diffX) > 80 && Math.abs(diffY) < 60) {
            if (diffX > 0) {
                if (typeof nextQ === 'function') nextQ();
            } else {
                if (typeof prevQ === 'function') prevQ();
            }
        }
        
        isValidSwipe = false; 
    });
})();
