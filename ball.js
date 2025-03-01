class Ball {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.radius = 20;
        this.reset();
        
        // Ball properties
        this.gravity = 0.5;
        this.bounce = 0.8; // Energy loss on bounce
        this.friction = 0.99; // Horizontal friction
        
        // Animation properties
        this.animationId = null;
        this.isRunning = false;
    }

    reset() {
        // Reset ball position and velocity
        this.x = this.canvas.width / 2;
        this.y = this.radius;
        this.dx = 5; // Initial horizontal velocity
        this.dy = 0; // Initial vertical velocity
        this.speed = 1;
    }

    update() {
        // Apply gravity
        this.dy += this.gravity * this.speed;

        // Update position
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;

        // Bounce off walls
        if (this.x + this.radius > this.canvas.width) {
            this.x = this.canvas.width - this.radius;
            this.dx = -this.dx * this.bounce;
        } else if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.dx = -this.dx * this.bounce;
        }

        // Bounce off floor and ceiling
        if (this.y + this.radius > this.canvas.height) {
            this.y = this.canvas.height - this.radius;
            this.dy = -this.dy * this.bounce;
            this.dx *= this.friction; // Apply friction on bounce
        } else if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.dy = -this.dy * this.bounce;
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ball with gradient
        const gradient = this.ctx.createRadialGradient(
            this.x - this.radius/3, 
            this.y - this.radius/3, 
            this.radius/10,
            this.x,
            this.y,
            this.radius
        );
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(1, '#c92a2a');

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.closePath();

        // Add shadow
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
    }

    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setSpeed(speed) {
        this.speed = speed;
    }
}

// Initialize the animation when the page loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const ball = new Ball(canvas);
    
    // Control buttons
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const speedSlider = document.getElementById('speedSlider');

    startBtn.addEventListener('click', () => ball.start());
    stopBtn.addEventListener('click', () => ball.stop());
    resetBtn.addEventListener('click', () => {
        ball.stop();
        ball.reset();
        ball.draw();
    });

    speedSlider.addEventListener('input', (e) => {
        ball.setSpeed(e.target.value / 5);
    });

    // Initial draw
    ball.draw();
}); 