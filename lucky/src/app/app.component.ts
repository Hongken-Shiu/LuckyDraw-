import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LuckyDrawService } from './services/lucky-draw.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('gachaAnimation', [
      state('normal', style({ transform: 'scale(1)' })),
      transition('* => spin', [
        animate('6s', keyframes([
          style({ transform: 'rotate(0deg) scale(1)', offset: 0 }),
          style({ transform: 'rotate(360deg) scale(1.5)', offset: 0.2 }),
          style({ transform: 'rotate(720deg) scale(0.8)', offset: 0.4 }),
          style({ transform: 'rotate(1080deg) scale(1.2)', offset: 0.6 }),
          style({ transform: 'rotate(1440deg) scale(0.9)', offset: 0.8 }),
          style({ transform: 'rotate(1800deg) scale(1)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class AppComponent {
  backgroundStyle = {
    'background-image': 'url("assets/images/rosaria.jpg")',
    'background-size': 'cover',
    'background-position': 'center center', 
    'background-repeat': 'no-repeat',
    'min-height': '100vh', 
  };
  animationState = 'normal';
  isDrawing = false;
  winner: string | null = null;
  isMuted = false;

  private spinSound: HTMLAudioElement | null = null;
  private winnerSound: HTMLAudioElement | null = null;

  constructor(
    private luckyDrawService: LuckyDrawService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize audio objects only in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.spinSound = new Audio('/assets/sounds/baka.mp3');
      this.winnerSound = new Audio('/assets/sounds/cute.mp3');
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.spinSound) this.spinSound.muted = this.isMuted;
    if (this.winnerSound) this.winnerSound.muted = this.isMuted;
  }

  startDraw(): void {
    if (this.isDrawing) return;

    this.isDrawing = true;
    this.winner = null;
    this.animationState = 'spin';

    if (this.spinSound && !this.isMuted) {
      this.spinSound.currentTime = 0;
      this.spinSound.play();
    }

    this.luckyDrawService.getParticipants().subscribe((participants) => {
      setTimeout(() => {
        this.winner = this.luckyDrawService.drawWinner(participants);
        this.animationState = 'normal';
        this.isDrawing = false;

        if (this.spinSound) this.spinSound.pause();
        if (this.winnerSound && !this.isMuted) {
          this.winnerSound.currentTime = 0;
          this.winnerSound.play();
        }
      }, 6000);
    });
  }
}