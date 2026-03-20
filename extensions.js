// 2. CANVAS & S-PEN LOGIC
function initCanvas() {
    canvas = document.getElementById('drawing-canvas');
    if(!canvas) return;
    ctx = canvas.getContext('2d', { alpha: true });
    
    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', endDraw);
    canvas.addEventListener('pointerout', endDraw);
    canvas.addEventListener('pointercancel', endDraw); // Catch browser interruptions
    
    // Default to transparent for fingers/mouse
    canvas.style.pointerEvents = 'none'; 
    
    // MAGIC: Hover detection for S-Pen
    // When the pen hovers over the screen, instantly make the canvas solid to capture the stroke.
    document.addEventListener('pointermove', (e) => {
        if (!canvas) return;
        if (e.pointerType === 'pen' || e.pointerType === 'stylus') {
            canvas.style.pointerEvents = 'auto'; 
        } else {
            // Let fingers and mouse fall through to scroll or click options
            if (!isDrawing) canvas.style.pointerEvents = 'none';
        }
    });
}

function resizeAndLoadCanvas(qIndex) {
    if(!canvas) return;
    const container = document.getElementById('touch-area');
    if (!container) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.offsetWidth * dpr;
    canvas.height = container.scrollHeight * dpr;
    
    canvas.style.width = container.offsetWidth + 'px';
    canvas.style.height = container.scrollHeight + 'px';
    
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentPaths = drawings[qIndex] || [];
    redrawCanvas();
}

function startDraw(e) {
    if (e.pointerType !== 'pen' && e.pointerType !== 'stylus' && e.button !== 0) return; 
    isDrawing = true;
    
    try { canvas.setPointerCapture(e.pointerId); } catch(err){}
    
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
    
    try { canvas.releasePointerCapture(e.pointerId); } catch(err){}
    
    const currentPath = currentPaths[currentPaths.length - 1];
    if (currentPath && currentPath.points.length > 0) {
        const startP = currentPath.points[0];
        const endP = currentPath.points[currentPath.points.length - 1];
        
        // Calculate how far the pen moved during this stroke
        const dist = Math.hypot(endP.x - startP.x, endP.y - startP.y);
        
        // TAP DETECTION: If the stroke was tiny (less than 5px), treat it as a click!
        if (dist < 5 && currentPath.points.length < 10) {
            currentPaths.pop(); // Remove the accidental dot from memory
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            redrawCanvas(); // Redraw without the dot
            
            // Temporarily hide canvas and forward the click to the option underneath!
            canvas.style.pointerEvents = 'none';
            const target = document.elementFromPoint(e.clientX, e.clientY);
            if (target) {
                target.click(); // Select the option
            }
            return; // Stop here, don't save this stroke
        } else {
            if(typeof currIdx !== 'undefined') drawings[currIdx] = currentPaths;
        }
    }
}
