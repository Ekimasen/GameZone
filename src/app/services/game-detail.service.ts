import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameDetailService {
  private steamApiKey = '8AA9C37C8E8EA4F47F779B970B5EC19F';

  constructor(private http: HttpClient) {}

  getAppList(): Observable<any[]> {
    return this.http.get<any>('https://api.steampowered.com/ISteamApps/GetAppList/v2/').pipe(
      map(response => response.applist.apps)
    );
  }

  getGameDetails(appId: string): Observable<any> {
    return this.http.get<any>(`https://store.steampowered.com/api/appdetails?appids=${appId}&key=${this.steamApiKey}`).pipe(
      map(response => response[appId].data)
    );
  }
}
