import { Component } from '@angular/core';
import { DinoGameComponent } from './dino-game/dino-game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DinoGameComponent],
  template: `<app-dino-game></app-dino-game>`,
})
export class AppComponent {}
