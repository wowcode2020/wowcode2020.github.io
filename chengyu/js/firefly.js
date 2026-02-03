/**
 * 萤火虫Canvas特效
 * 在夜空中飞舞的明亮萤火虫
 */

class FireflyEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.fireflies = [];
        this.animationId = null;
        this.lastTime = 0;
        this.config = {
            count: 15,
            minSize: 1,
            maxSize: 2,
            minSpeed: 0.15,
            maxSpeed: 0.4,
            glowSize: 30,
            colors: [
                'rgba(255, 220, 80, 1.0)',   // 亮黄色
                'rgba(255, 200, 60, 1.0)',   // 金黄色
                'rgba(255, 180, 40, 1.0)'    // 橙黄色
            ]
        };

        this.init();
    }

    init() {
        this.canvas = document.getElementById('fireflyCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createFireflies();
        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.config.count = 8;
        }
    }

    resize() {
        if (!this.canvas) return;

        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';

        this.ctx.scale(dpr, dpr);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    createFireflies() {
        this.fireflies = [];

        for (let i = 0; i < this.config.count; i++) {
            this.fireflies.push(this.createFirefly(i));
        }
    }

    createFirefly(index) {
        const size = this.random(this.config.minSize, this.config.maxSize);
        const phase = Math.random() * Math.PI * 2;

        return {
            x: Math.random() * this.width,
            // 萤火虫只在屏幕下半部分（40%-100%高度）
            y: this.height * 0.4 + Math.random() * (this.height * 0.6),
            size: size,
            speedX: this.random(-this.config.minSpeed, this.config.maxSpeed),
            speedY: this.random(-this.config.minSpeed * 0.5, this.config.maxSpeed * 0.3),
            angle: Math.random() * Math.PI * 2,
            angleSpeed: this.random(0.002, 0.008),
            phase: phase,
            phaseSpeed: this.random(0.01, 0.025),
            opacity: this.random(0.7, 1.0),
            baseOpacity: this.random(0.7, 1.0),
            blinkSpeed: this.random(0.008, 0.022),
            blinkOffset: Math.random() * Math.PI * 2,
            color: this.config.colors[index % this.config.colors.length]
        };
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    update(deltaTime) {
        if (!deltaTime) deltaTime = 16;
        const timeFactor = deltaTime / 16;

        this.fireflies.forEach(firefly => {
            firefly.angle += firefly.angleSpeed * timeFactor;
            firefly.phase += firefly.phaseSpeed * timeFactor;
            firefly.blinkOffset += firefly.blinkSpeed * timeFactor;

            const driftX = Math.sin(firefly.angle) * 0.25;
            const driftY = Math.cos(firefly.angle * 1.1) * 0.15;

            firefly.x += (firefly.speedX + driftX) * timeFactor;
            firefly.y += (firefly.speedY + driftY) * timeFactor;

            firefly.opacity = firefly.baseOpacity + Math.sin(firefly.blinkOffset) * 0.2;
            firefly.opacity = Math.max(0.5, Math.min(1.0, firefly.opacity));

            if (firefly.x < -60) firefly.x = this.width + 60;
            if (firefly.x > this.width + 60) firefly.x = -60;
            if (firefly.y < -60) firefly.y = this.height + 60;
            if (firefly.y > this.height + 60) firefly.y = -60;
        });
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.fireflies.forEach(firefly => {
            this.drawFirefly(firefly);
        });
    }

    drawFirefly(firefly) {
        const { x, y, size, opacity, color } = firefly;
        const glowSize = size * this.config.glowSize;

        const baseColor = this.parseColor(color);

        // 外层大范围光晕（很淡）
        const outerGradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        outerGradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity * 0.15})`);
        outerGradient.addColorStop(0.5, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity * 0.05})`);
        outerGradient.addColorStop(1, 'transparent');

        this.ctx.beginPath();
        this.ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        this.ctx.fillStyle = outerGradient;
        this.ctx.fill();

        // 中层光晕（中等亮度）
        const midGradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 4);
        midGradient.addColorStop(0, `rgba(255, 245, 180, ${opacity * 0.6})`);
        midGradient.addColorStop(0.4, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity * 0.4})`);
        midGradient.addColorStop(1, 'transparent');

        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        this.ctx.fillStyle = midGradient;
        this.ctx.fill();

        // 内层强光（小范围高亮）
        const innerGradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        innerGradient.addColorStop(0, `rgba(255, 255, 240, ${opacity})`);
        innerGradient.addColorStop(0.5, `rgba(255, 235, 150, ${opacity * 0.9})`);
        innerGradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity * 0.5})`);

        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = innerGradient;
        this.ctx.fill();

        // 核心亮点（最亮）
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity + 0.1})`;
        this.ctx.fill();
    }

    parseColor(colorString) {
        const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3])
            };
        }
        return { r: 255, g: 220, b: 80 };
    }

    animate(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (deltaTime < 100) {
                requestAnimationFrame((time) => this.animate(time));
            }
            return;
        }

        this.update(deltaTime);
        this.draw();

        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }

    restart() {
        this.createFireflies();
    }
}

// 页面加载完成后初始化萤火虫效果
document.addEventListener('DOMContentLoaded', () => {
    window.fireflyEffect = new FireflyEffect();
});
