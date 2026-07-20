/* =========================================================================
   DYNAMIC DOT FIELD ENGINE (Balanced Production Profile)
   ========================================================================= */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const scroller = document.getElementById('main-scroller');

const config = {
    dotRadius: 1.3,
    dotSpacing: 20,
    cursorRadius: 350,      
    cursorForce: 0.2,      
    bulgeStrength: 90,
    glowRadius: 160
};

let mouse = { x: -1000, y: -1000 };
let currentScrollOffset = 0;
let kineticEnergy = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mouse.x > -1000) {
        ctx.save();
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, config.glowRadius);
        glowGrad.addColorStop(0, 'rgba(129, 140, 248, 0.06)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    const scrollShift = (currentScrollOffset * 0.22) % config.dotSpacing;
    const padding = 40; 

    ctx.fillStyle = 'rgba(147, 160, 248, 0.32)'; 

    for (let x = -padding; x < canvas.width + padding; x += config.dotSpacing) {
        for (let y = -padding; y < canvas.height + padding; y += config.dotSpacing) {
            
            let renderX = x;
            let renderY = y - scrollShift;

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
const navLinks = document.querySelectorAll('.nav-link');
let activeSectionIndex = 0;
let isAnimating = false;

window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isAnimating) return;

    if (e.deltaY > 0 && activeSectionIndex < sections.length - 1) {
        executeSceneSweep(activeSectionIndex + 1);
    } else if (e.deltaY < 0 && activeSectionIndex > 0) {
        executeSceneSweep(activeSectionIndex - 1);
    }
}, { passive: false });

function executeSceneSweep(targetIndex) {
    if (typeof targetIndex !== 'undefined') {
        activeSectionIndex = targetIndex;
    }
    isAnimating = true;
    kineticEnergy = 5.5;

    // Shift viewport sections vertically
    sections.forEach((section, index) => {
        const structuralOffset = (index - activeSectionIndex) * 100;
        section.style.transform = `translateY(${structuralOffset}%)`;
    });

    // Update nav HUD link active states
    navLinks.forEach((link, index) => {
        if (index === activeSectionIndex) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    currentScrollOffset = activeSectionIndex * window.innerHeight;

    setTimeout(() => {
        isAnimating = false;
    }, 650);
}

animate();