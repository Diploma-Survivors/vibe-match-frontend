"use client";

import { useEffect, useRef } from "react";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions with pixel ratio for better quality
    const setCanvasDimensions = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(pixelRatio, pixelRatio);
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Mouse interaction
    const mouse = {
      x: undefined as number | undefined,
      y: undefined as number | undefined,
      radius: 100,
    };

    window.addEventListener("mousemove", (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener("mouseout", () => {
      mouse.x = undefined;
      mouse.y = undefined;
    });

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      distance: number;
      angle: number;
      speed: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 2 + 0.5; // Smaller particles for more refined look
        this.density = Math.random() * 20 + 5;
        this.distance = Math.random() * 100; // Random distance from center
        this.angle = Math.random() * Math.PI * 2; // Random angle
        this.speed = Math.random() * 0.02 + 0.01; // Rotation speed
      }

      update() {
        // Mouse repulsion
        if (mouse.x !== undefined && mouse.y !== undefined) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;

            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
          } else {
            // Return to original position with slight movement
            this.angle += this.speed;

            const newX =
              this.baseX + Math.cos(this.angle) * this.distance * 0.05;
            const newY =
              this.baseY + Math.sin(this.angle) * this.distance * 0.05;

            this.x += (newX - this.x) * 0.05;
            this.y += (newY - this.y) * 0.05;
          }
        } else {
          // Gentle orbital movement when no mouse interaction
          this.angle += this.speed;

          const newX = this.baseX + Math.cos(this.angle) * this.distance * 0.05;
          const newY = this.baseY + Math.sin(this.angle) * this.distance * 0.05;

          this.x += (newX - this.x) * 0.05;
          this.y += (newY - this.y) * 0.05;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "#603fff";
        ctx.fill();
      }
    }

    // Create particles in a globe-like distribution
    const particleCount = 500; // More particles for better density
    const particles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4; // Globe radius

    for (let i = 0; i < particleCount; i++) {
      // Create particles in a spherical distribution
      const angle1 = Math.random() * Math.PI * 2; // Horizontal angle
      const angle2 = Math.random() * Math.PI * 2; // Vertical angle

      const x = centerX + radius * Math.cos(angle1) * Math.sin(angle2);
      const y = centerY + radius * Math.sin(angle1) * Math.sin(angle2);

      particles.push(new Particle(x, y));
    }

    // Connect particles with lines to form a globe-like structure
    function connectParticles() {
      if (!ctx) return;

      const maxDistance = 100; // Maximum distance for connection
      ctx.lineWidth = 0.2; // Thinner lines for more refined look

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Calculate opacity based on distance
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(96, 63, 255, ${opacity * 0.5})`;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation loop
    function animate() {
      if (!ctx) return;
      ctx.clearRect(
        0,
        0,
        canvas?.width || 0 / (window.devicePixelRatio || 1),
        canvas?.height || 0 / (window.devicePixelRatio || 1)
      );

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      connectParticles();
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-white"
      style={{ zIndex: -1 }}
    />
  );
}
