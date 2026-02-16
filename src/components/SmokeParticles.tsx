import { useEffect, useRef } from 'react';

export default function SmokeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 0.5 - 0.3;
        this.radius = Math.random() * 40 + 20;
        this.opacity = 0;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Fade in and out
        if (this.life < this.maxLife * 0.3) {
          this.opacity = this.life / (this.maxLife * 0.3) * 0.15;
        } else if (this.life > this.maxLife * 0.7) {
          this.opacity = (1 - (this.life - this.maxLife * 0.7) / (this.maxLife * 0.3)) * 0.15;
        } else {
          this.opacity = 0.15;
        }

        // Slight horizontal drift
        this.vx += (Math.random() - 0.5) * 0.01;
        this.vx *= 0.99;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        
        // Orange/purple smoke gradient
        gradient.addColorStop(0, `rgba(203, 161, 53, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(138, 82, 224, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(203, 161, 53, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      isDead() {
        return this.life >= this.maxLife || this.y < -100;
      }
    }

    // Particles array
    const particles: Particle[] = [];
    const maxParticles = 30;

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(11, 11, 11, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (particles.length < maxParticles && Math.random() < 0.1) {
        particles.push(new Particle());
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].isDead()) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
