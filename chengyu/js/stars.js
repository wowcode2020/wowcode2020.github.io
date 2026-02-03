/**
 * 星星背景特效
 * 在夜空中创建闪烁的星星
 */

class StarsEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.stars = [];
        this.animationId = null;
        this.config = {
            count: 150,
            minSize: 0.5,
            maxSize: 2,
            colors: [
                'rgba(255, 255, 255, 0.8)',
                'rgba(255, 255, 240, 0.7)',
                'rgba(240, 240, 255, 0.6)'
            ]
        };

        this.init();
    }

    init() {
        this.canvas = document.getElementById('starsCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createStars();
        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
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

    createStars() {
        this.stars = [];

        for (let i = 0; i < this.config.count; i++) {
            // 星星只在屏幕上半部分（0-60%高度）
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.height * 0.6),
                size: this.random(this.config.minSize, this.config.maxSize),
                opacity: this.random(0.3, 0.9),
                blinkSpeed: this.random(0.005, 0.02),
                blinkOffset: Math.random() * Math.PI * 2,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)]
            });
        }
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    update() {
        this.stars.forEach(star => {
            star.blinkOffset += star.blinkSpeed;
            star.opacity = 0.3 + Math.sin(star.blinkOffset) * 0.4;
            star.opacity = Math.max(0.2, Math.min(0.9, star.opacity));
        });
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.stars.forEach(star => {
            this.drawStar(star);
        });
    }

    drawStar(star) {
        const { x, y, size, opacity, color } = star;

        // 星星本体
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = color.replace(/[\d.]+\)$/, `${opacity})`);
        this.ctx.fill();

        // 微弱光晕
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');

        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    animate() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.draw();
            return;
        }

        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.starsEffect = new StarsEffect();
});
