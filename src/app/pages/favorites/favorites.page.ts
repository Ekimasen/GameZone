import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritePage implements OnInit {
  favoriteGames: any[] = [];

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit() {
    this.loadFavoriteGames();
  }

  loadFavoriteGames() {
    this.favoriteGames = this.favoriteService.getFavoriteGames();
  }

  removeFromFavorite(gameId: number) {
    this.favoriteService.removeFromFavorite(gameId);
    this.loadFavoriteGames();
  }
}
