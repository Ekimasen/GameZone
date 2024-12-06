import { Component, OnInit } from '@angular/core';
import { RawgService } from '../services/rawg.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  platforms: any[] = [];
  gameIds: number[] = [];
  isLoading = true;
  showPlatforms = false;
  games: any[] = [];

  constructor(private rawgService: RawgService) {}

  ngOnInit() {
    this.fetchPlatforms(); 
    this.fetchGameIds();
  }

  // Fetches the list of gaming platforms
  fetchPlatforms() {
    this.rawgService.getPlatforms().subscribe({
      next: (response) => {
        this.platforms = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching platforms:', error);
        this.isLoading = false;
      },
    });
  }

  // Fetches game IDs from a specific platform
  fetchGameIds() {
    this.rawgService.getGamesByPlatform(18, 1, 50).subscribe({
      next: (response) => {
        this.gameIds = response.results.map((game: any) => game.id);
        this.loadRandomGameDetails();
      },
      error: (error) => {
        console.error('Error fetching game IDs:', error);
        this.isLoading = false;
      },
    });
  }

  // Loads details of random games
  loadRandomGameDetails() {
    const selectedGameIds = this.getRandomGameIds(5);
    selectedGameIds.forEach(gameId => {
      this.rawgService.getGameDetails(gameId).subscribe({
        next: (response) => {
          if (response.background_image) {
            this.games.push(response);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching game details:', error);
          this.isLoading = false;
        },
      });
    });
  }

  // Method to get multiple random game IDs
  getRandomGameIds(count: number): number[] {
    const randomIds = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * this.gameIds.length);
      randomIds.push(this.gameIds[randomIndex]);
    }
    return randomIds;
  }

  // Method to toggle the visibility of the platform list
  togglePlatforms() {
    this.showPlatforms = !this.showPlatforms;
  }

  // Method to get a random platform ID
  getRandomPlatformId(): number {
    const randomIndex = Math.floor(Math.random() * this.platforms.length);
    return this.platforms[randomIndex]?.id;
  }
}
