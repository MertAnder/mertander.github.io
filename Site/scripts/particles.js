class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#ff3366', '#ba3be7', '#3366ff', '#00ffcc', '#ffcc00'];
        this.mouse = { x: null, y: null, radius: 100 };
        
        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles(); // Yeniden boyutlandırmada parçacıkları tekrar oluştur
    }

    createParticles() {
        const density = Math.min(window.innerWidth / 10, 100);
        this.particles = [];
        
        for (let i = 0; i < density; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                originalSize: Math.random() * 3 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Arkaplan gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(26, 26, 46, 0.2)');
        gradient.addColorStop(1, 'rgba(48, 43, 99, 0.2)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Parçacıkları çiz
        this.drawParticles();
        
        // Şekil ekleme (örnek: merkezde daire)
        this.drawCenterShape();
        
        requestAnimationFrame(() => this.animate());
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Hareket
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Fare etkileşimi
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.x -= dx * force * 0.1;
                particle.y -= dy * force * 0.1;
                particle.size = particle.originalSize * 3;
            } else {
                particle.size = particle.originalSize;
                
                // Kenarlardan sektirme
                if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            }
            
            // Parçacık çizimi
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Bağlantı çizgileri
            this.drawConnections(particle);
        });
    }

    drawConnections(particle) {
        this.particles.forEach(other => {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const opacity = 1 - distance/120;
                this.ctx.beginPath();
                this.ctx.strokeStyle = `${particle.color.replace(')', `, ${opacity})`)}`;
                this.ctx.lineWidth = 0.5;
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(other.x, other.y);
                this.ctx.stroke();
            }
        });
    }

    drawCenterShape() {
        // Merkezde dönen şekil
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const time = Date.now() * 0.001;
        const radius = 50 + Math.sin(time) * 10;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Şekil etrafında parçacıklar
        for (let i = 0; i < 5; i++) {
            const angle = time + i * Math.PI * 0.4;
            const x = centerX + Math.cos(angle) * (radius + 30);
            const y = centerY + Math.sin(angle) * (radius + 30);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = this.colors[i % this.colors.length];
            this.ctx.fill();
        }
    }

    addEventListeners() {
        // Fare hareketi
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        // Dokunmatik destek
        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        });
        
        // Yeniden boyutlandırma
        window.addEventListener('resize', () => this.resizeCanvas());
    }
}

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});