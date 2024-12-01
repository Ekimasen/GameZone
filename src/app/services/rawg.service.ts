import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RawgService {
  private apiKey = 'f6956f56935341ca8587135c98852bc8';
  private baseUrl = 'https://api.rawg.io/api';

  constructor(private http: HttpClient) {}

  // Fetch platforms from the RAWG API
  getPlatforms(): Observable<any> {
    return this.http.get(`${this.baseUrl}/platforms?key=${this.apiKey}`);
  }

  // Fetch details of a single game
  getGameDetails(gameId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/games/${gameId}?key=${this.apiKey}`);
  }

  // Fetch games for a specific platform with pagination
  getGamesByPlatform(platformId: number, page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('platforms', platformId.toString())
      .set('page', page.toString())
      .set('page_size', pageSize.toString())
      .set('key', this.apiKey);

    return this.http.get(`${this.baseUrl}/games`, { params });
  }

  // Search games across all platforms with pagination and platform filter
  searchGames(query: string, page: number, pageSize: number, platformId: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString())
      .set('key', this.apiKey)
      .set('search', query)
      .set('platforms', platformId.toString()); // Add the platform filter

    return this.http.get(`${this.baseUrl}/games`, { params });
  }

  // Fetch screenshots for a specific game
  getGameScreenshots(gameId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/games/${gameId}/screenshots?key=${this.apiKey}`);
  }
}
