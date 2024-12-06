import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent {
  progress = 0; // Progress starts at 0
  pikaPosition = 0; // Position of the Pikachu
  @Output() loadingComplete = new EventEmitter<void>(); // Emit when loading is done

  constructor() {
    this.incrementProgress();
  }

  incrementProgress() {
    const interval = setInterval(() => {
      this.progress += 5; // Increment progress by 5%
      this.pikaPosition = this.progress; // Sync Pikachu's position with the progress bar

      if (this.progress >= 100) {
        clearInterval(interval);
        this.loadingComplete.emit(); // Notify when loading reaches 100%
      }
    }, 200); // Update progress every 200ms
  }
}
