import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RawgService } from '../../services/rawg.service';
import { FavoriteService } from '../../services/favorite.service';
import { DatabaseService } from '../../services/database.service'; // Import DatabaseService

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.page.html',
  styleUrls: ['./game-detail.page.scss'],
})
export class GameDetailPage implements OnInit {
  game: any;
  screenshots: any[] = [];
  isLoading = true;
  isFavorite = false;
  userId: number | null = null; // Use nullable type

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private favoriteService: FavoriteService,
    private databaseService: DatabaseService // Inject DatabaseService
  ) {}

  async ngOnInit() {
    this.userId = await this.databaseService.getLoggedInUserId(); // Get the logged-in user ID
    const gameId = +this.route.snapshot.paramMap.get('id')!;
    this.loadGameDetails(gameId);
    if (this.userId) {
      this.isFavorite = this.favoriteService.isFavorite(this.userId, gameId); // Check if the game is already a favorite
    }
  }

  loadGameDetails(gameId: number) {
    this.rawgService.getGameDetails(gameId).subscribe({
      next: (response) => {
        this.game = response;
        this.isLoading = false;
        this.loadGameScreenshots(gameId);
      },
      error: (error) => {
        console.error('Error fetching game details:', error);
        this.isLoading = false;
      },
    });
  }

  loadGameScreenshots(gameId: number) {
    this.rawgService.getGameScreenshots(gameId).subscribe({
      next: (response) => {
        this.screenshots = response.results;
      },
      error: (error) => {
        console.error('Error fetching game screenshots:', error);
      },
    });
  }

  toggleFavorite(game: any) {
    if (this.userId) {
      if (this.isFavorite) {
        this.favoriteService.removeFromFavorite(this.userId, game.id);
      } else {
        this.favoriteService.addToFavorite(this.userId, game);
      }
      this.isFavorite = !this.isFavorite;
    }
  }

  getGenres(game: any): string {
    return game.genres ? game.genres.map((g: any) => g.name).join(', ') : 'N/A';
  }
}
