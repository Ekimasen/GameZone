import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { DatabaseService } from '../../services/database.service'; // Import DatabaseService

@Component({
  selector: 'app-favorite',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritePage implements OnInit {
  favoriteGames: any[] = [];
  userId: number | null = null; // Use nullable type for user ID

  constructor(
    private favoriteService: FavoriteService,
    private databaseService: DatabaseService // Inject DatabaseService
  ) {}

  async ngOnInit() {
    this.userId = await this.databaseService.getLoggedInUserId(); // Get logged-in user ID
    if (this.userId) {
      this.loadFavoriteGames();
    }
  }

  loadFavoriteGames() {
    if (this.userId) {
      this.favoriteGames = this.favoriteService.getFavoriteGames(this.userId); // Pass user ID to service
    }
  }

  removeFromFavorite(gameId: number) {
    if (this.userId) {
      this.favoriteService.removeFromFavorite(this.userId, gameId); // Pass user ID to service
      this.loadFavoriteGames();
    }
  }
}
