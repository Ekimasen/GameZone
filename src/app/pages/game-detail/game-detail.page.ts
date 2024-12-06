import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RawgService } from '../../services/rawg.service';
import { FavoriteService } from '../../services/favorite.service'; // Import FavoriteService

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.page.html',
  styleUrls: ['./game-detail.page.scss'],
})
export class GameDetailPage implements OnInit {
  game: any;
  screenshots: any[] = [];
  isLoading = true;
  isFavorite = false; // Add a flag to track favorite state

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private favoriteService: FavoriteService // Inject FavoriteService
  ) {}

  ngOnInit() {
    const gameId = +this.route.snapshot.paramMap.get('id')!;
    this.loadGameDetails(gameId);
    this.isFavorite = this.favoriteService.isFavorite(gameId); // Check if the game is already a favorite
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
    if (this.isFavorite) {
      this.favoriteService.removeFromFavorite(game.id);
    } else {
      this.favoriteService.addToFavorite(game);
    }
    this.isFavorite = !this.isFavorite;
  }

  getGenres(game: any): string {
    return game.genres ? game.genres.map((g: any) => g.name).join(', ') : 'N/A';
  }
}
