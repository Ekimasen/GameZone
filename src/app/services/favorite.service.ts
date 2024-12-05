import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  constructor() {}

  private getLocalStorageKey(userId: number): string {
    return `favoriteGames_${userId}`;
  }

  private loadFavorites(userId: number): any[] {
    const storedGames = localStorage.getItem(this.getLocalStorageKey(userId));
    return storedGames ? JSON.parse(storedGames) : [];
  }

  private saveFavorites(userId: number, favoriteGames: any[]): void {
    localStorage.setItem(this.getLocalStorageKey(userId), JSON.stringify(favoriteGames));
  }

  addToFavorite(userId: number, game: any) {
    const favoriteGames = this.loadFavorites(userId);
    favoriteGames.push(game);
    this.saveFavorites(userId, favoriteGames);
  }

  getFavoriteGames(userId: number): any[] {
    return this.loadFavorites(userId);
  }

  removeFromFavorite(userId: number, gameId: number) {
    let favoriteGames = this.loadFavorites(userId);
    favoriteGames = favoriteGames.filter(game => game.id !== gameId);
    this.saveFavorites(userId, favoriteGames);
  }

  isFavorite(userId: number, gameId: number): boolean {
    const favoriteGames = this.loadFavorites(userId);
    return favoriteGames.some(game => game.id === gameId);
  }
}
