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
  gameIds: number[] = []; // Array to store game IDs
  isLoading = true;
  showPlatforms = false; // Flag to toggle visibility of platform list
  games: any[] = []; // Store multiple game objects

  constructor(private rawgService: RawgService) {}

  ngOnInit() {
    this.fetchPlatforms();
    this.fetchGameIds(); // Fetch game IDs on initialization
  }

  fetchPlatforms() {
    this.rawgService.getPlatforms().subscribe({
      next: (response) => {
        this.platforms = response.results; // RAWG API returns the platforms in `results`
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching platforms:', error);
        this.isLoading = false;
      },
    });
  }

  fetchGameIds() {
    this.rawgService.getGamesByPlatform(18, 1, 50).subscribe({ // Fetch games from a specific platform, e.g., platform ID 18 (PlayStation)
      next: (response) => {
        this.gameIds = response.results.map((game: any) => game.id); // Extract game IDs
        this.loadRandomGameDetails();
      },
      error: (error) => {
        console.error('Error fetching game IDs:', error);
        this.isLoading = false;
      },
    });
  }

  loadRandomGameDetails() {
    const selectedGameIds = this.getRandomGameIds(5); // Get 5 random game IDs
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
    this.showPlatforms = !this.showPlatforms; // Toggle the visibility of the platforms list
  }

  // Method to get a random platform ID
  getRandomPlatformId(): number {
    const randomIndex = Math.floor(Math.random() * this.platforms.length);
    return this.platforms[randomIndex]?.id; // Return random platform ID, if available
  }
}
