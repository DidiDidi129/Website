class Snowflake {
    constructor(canvas, windStrength) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.windStrength = windStrength;
        this.reset(true);
    }

    reset(initial = false) {
        this.radius = Math.random() * 4 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.opacity = 1;

        this.x = Math.random() * this.canvas.width;
        if (initial) {
            this.y = -this.radius - Math.random() * this.canvas.height;
        } else {
            this.y = -this.radius - Math.random() * 50;
        }
    }

    update(wind) {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 1 + wind * this.windStrength;
        this.angle += 0.02;

        // reset if snowflake goes off any edge
        if (this.y - this.radius > this.canvas.height || this.x + this.radius < 0 || this.x - this.radius > this.canvas.width) {
            this.reset();
        }
    }

    draw(globalOpacity = 1) {
        this.ctx.fillStyle = `rgba(255,255,255,${this.opacity * globalOpacity})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class Snow {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.flakes = [];
        this.maxFlakes = 80;
        this.wind = 0;
        this.windStrength = 2;
        this.globalOpacity = 1;
        this.fadeSpeed = 0.05;

        this.initEvents();
        this.resize();
        this.animate();

        // Gradual spawn
        this.spawnInterval = setInterval(() => {
            if (this.flakes.length < this.maxFlakes) {
                this.flakes.push(new Snowflake(this.canvas, this.windStrength));
            } else {
                clearInterval(this.spawnInterval);
            }
        }, 200);
    }

    initEvents() {
        window.addEventListener('mousemove', (e) => {
            const halfWidth = this.canvas.width / 2;
            if (e.clientX < halfWidth) {
                this.wind = -1 + (e.clientX / halfWidth) * 1;
            } else {
                this.wind = ((e.clientX - halfWidth) / halfWidth) * 1;
            }
        });

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        if (window.location.hash) {
            this.globalOpacity -= this.fadeSpeed;
            if (this.globalOpacity < 0) this.globalOpacity = 0;
        } else {
            this.globalOpacity += this.fadeSpeed;
            if (this.globalOpacity > 1) this.globalOpacity = 1;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let flake of this.flakes) {
            flake.update(this.wind);
            flake.draw(this.globalOpacity);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// initialize snow
window.addEventListener('load', () => {
    new Snow('snowCanvas');
});
