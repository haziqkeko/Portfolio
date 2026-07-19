/* =========================================================================
   DYNAMIC DOT FIELD ENGINE (Balanced Production Profile)
   ========================================================================= */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const scroller = document.getElementById('main-scroller');

// Balanced settings: Tight high-density grid with fine, visible data coordinates
const config = {
    dotRadius: 1.3,         /* Increased slightly for sharp visibility */
    dotSpacing: 20,         /* Dropped back down to match the clean grid density of pic 2 */
    cursorRadius: 350,      
    cursorForce: 0.2,      
    bulgeStrength: 90,      /* Elegant lens warping push */
    glowRadius: 160
};

let mouse = { x: -1000, y: -1000 };
let currentScrollOffset = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Monitor interactive coordinates
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Sync grid scrolling velocity 
scroller.addEventListener('scroll', () => {
    currentScrollOffset = scroller.scrollTop;
}, { passive: true });

function animate() {
    // 1. RENDER CLEAN TRANSPARENT SURFACE (Pristine Obsidian #060911 Base)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. REFINED SUBTLE RADIAL MOUSE GLOW
    if (mouse.x > -1000) {
        ctx.save();
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, config.glowRadius);
        glowGrad.addColorStop(0, 'rgba(129, 140, 248, 0.06)'); /* Just enough to hint at cursor position */
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    // 3. REFINED GRID DISTRIBUTION
    const scrollShift = (currentScrollOffset * 0.22) % config.dotSpacing;
    const padding = 40; 

    // Crisp tech-indigo tint balanced at 32% visibility to guarantee it pops without distracting
    ctx.fillStyle = 'rgba(147, 160, 248, 0.32)'; 

    for (let x = -padding; x < canvas.width + padding; x += config.dotSpacing) {
        for (let y = -padding; y < canvas.height + padding; y += config.dotSpacing) {
            
            let renderX = x;
            let renderY = y - scrollShift;

            // 4. MOUSE BULGE SYSTEM MATRIX
            const dx = renderX - mouse.x;
            const dy = renderY - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.cursorRadius) {
                const distortionForce = (1 - distance / config.cursorRadius) * config.bulgeStrength * config.cursorForce;
                
                if (distance > 0) {
                    renderX += (dx / distance) * distortionForce;
                    renderY += (dy / distance) * distortionForce;
                }
            }

            // Render single grid tracking coordinate
            ctx.beginPath();
            ctx.arc(renderX, renderY, config.dotRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    requestAnimationFrame(animate);
}
/* =========================================================================
   KINETIC SLIDE INTERACTION ENGINE
   ========================================================================= */
const sections = document.querySelectorAll('.hero-container, .about-container');
let activeSectionIndex = 0;
let isAnimating = false;

window.addEventListener('wheel', (e) => {
    // Block sluggish native browser scrolling responses
    e.preventDefault();
    
    // Ignore input commands if a high-speed transition sweep is currently active
    if (isAnimating) return;

    // Evaluate scroll wheel vector trajectories (Positive = Downward, Negative = Upward)
    if (e.deltaY > 0 && activeSectionIndex < sections.length - 1) {
        activeSectionIndex++;
        executeSceneSweep();
    } else if (e.deltaY < 0 && activeSectionIndex > 0) {
        activeSectionIndex--;
        executeSceneSweep();
    }
}, { passive: false }); // 'passive: false' is mandatory to allow preventDefault() to function

function executeSceneSweep() {
    isAnimating = true;
    
    // Fire an aggressive energy spike directly into the dot field configuration
    kineticEnergy = 5.5;

    // Dynamically calculate and shift the vertical transform matrix for all layout modules
    sections.forEach((section, index) => {
        const structuralOffset = (index - activeSectionIndex) * 100;
        section.style.transform = `translateY(${structuralOffset}%)`;
    });

    // Artificially update our scroll position counter variable to maintain background parallax tracking
    currentScrollOffset = activeSectionIndex * window.innerHeight;

    // Release the system lock immediately after the premium CSS animation curve finishes its sweep
    setTimeout(() => {
        isAnimating = false;
    }, 650); /* Matches the 0.65s transition timing defined inside style.css */
}

animate();