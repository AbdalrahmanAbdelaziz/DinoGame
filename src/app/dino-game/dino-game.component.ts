import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dino-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dino-game.component.html',
  styleUrls: ['./dino-game.component.css'],
})
export class DinoGameComponent implements OnInit, OnDestroy {
  isJumping = false;
  intervalId: any;
  score = 0;
  scoreIntervalId: any;
  gameOver = false;
  isGameActive = false;

  private jumpSound: HTMLAudioElement;
  private backgroundSound: HTMLAudioElement;
  private crashSound: HTMLAudioElement;

  constructor() {
    this.jumpSound = new Audio('sounds/jump.mp3');
    this.crashSound = new Audio('sounds/crash.mp3');

    this.backgroundSound = new Audio('sounds/background.mp3');
    this.backgroundSound.loop = true; 
    this.backgroundSound.volume = 0.5;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if ((event.code === 'Space' || event.code === 'ArrowUp') && !this.gameOver) {
      this.jump();
    }
  }

  ngOnInit(): void {
    this.startGame();
  }

  startGame(): void {
    this.score = 0;
    this.gameOver = false;
    this.isGameActive = true;

    this.backgroundSound.currentTime = 0; 
    this.backgroundSound.play().catch(e => console.error("Background sound play failed:", e)); 

    // Start score counter
    this.scoreIntervalId = setInterval(() => {
      if (!this.gameOver) {
        this.score++;
      }
    }, 100);

    // Start collision detection
    this.intervalId = setInterval(() => {
      if (this.gameOver) {
        clearInterval(this.intervalId);
        return;
      }

      const dino = document.getElementById('dino');
      const cactus = document.getElementById('cactus');
      if (!dino || !cactus) return;

      const dinoTop = parseInt(getComputedStyle(dino).getPropertyValue('top'));
      const cactusLeft = parseInt(
        getComputedStyle(cactus).getPropertyValue('left')
      );

      // Collision detection logic
      if (cactusLeft < 80 && cactusLeft > 0 && dinoTop >= 140) {
        this.endGame();
      }
    }, 10);
  }

  jump(): void {
    if (this.isJumping) return;

    this.isJumping = true;
    this.jumpSound.currentTime = 0; // Rewind to start
    this.jumpSound.play().catch(e => console.error("Jump sound play failed:", e)); // Play jump sound

    setTimeout(() => {
      this.isJumping = false;
    }, 300);
  }

  endGame(): void {
    this.gameOver = true;
    this.isGameActive = false;
    clearInterval(this.intervalId);
    clearInterval(this.scoreIntervalId);

    // Stop background sound and play crash sound
    this.backgroundSound.pause();
    this.backgroundSound.currentTime = 0; // Reset for next game
    this.crashSound.currentTime = 0; // Rewind to start
    this.crashSound.play().catch(e => console.error("Crash sound play failed:", e));

    alert('Game Over! Your score: ' + this.score);
  }

  restartGame(): void {
    // Stop crash sound if it's still playing
    this.crashSound.pause();
    this.crashSound.currentTime = 0;

    const cactus = document.getElementById('cactus');
    if (cactus) {
      cactus.style.animation = 'none';
      cactus.offsetHeight;
      cactus.style.animation = '';
    }
    this.startGame();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    clearInterval(this.scoreIntervalId);

    // Stop all sounds when the component is destroyed
    this.jumpSound.pause();
    this.backgroundSound.pause();
    this.crashSound.pause();

    this.jumpSound.currentTime = 0;
    this.backgroundSound.currentTime = 0;
    this.crashSound.currentTime = 0;
  }
}