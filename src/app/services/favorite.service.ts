import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoriteGames: any[] = [];

  constructor() {}

  addToFavorite(game: any) {
    this.favoriteGames.push(game);
  }

  getFavoriteGames(): any[] {
    return this.favoriteGames;
  }

  removeFromFavorite(gameId: number) {
    this.favoriteGames = this.favoriteGames.filter(game => game.id !== gameId);
  }

  isFavorite(gameId: number): boolean {
    return this.favoriteGames.some(game => game.id === gameId);
  }
}
