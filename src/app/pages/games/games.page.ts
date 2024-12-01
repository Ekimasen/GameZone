import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RawgService } from '../../services/rawg.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
})
export class GamesPage implements OnInit {
  platformId!: number;
  games: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  currentPage = 1;
  pageSize = 20; // Number of games per page
  totalPages: number = 1;
  searchQuery = ''; // Holds the search query

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private router: Router
  ) {}

  ngOnInit() {
    this.platformId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchGamesByPlatform(this.platformId, this.currentPage); // Initially fetch games by platform
  }

  onSearchButtonClick() {
    if (this.searchQuery.trim() !== '') {
      this.currentPage = 1; // Reset to the first page when a new search is made
      this.fetchGames(this.searchQuery, this.platformId); // Pass platformId with the search query
    } else {
      // If search query is empty, fetch games for the platform without search
      this.fetchGamesByPlatform(this.platformId, this.currentPage);
    }
  }

  fetchGames(query: string = '', platformId: number) {
    this.isLoading = true;
    this.errorMessage = null;

    // Fetch the games using the query and platformId
    this.rawgService.searchGames(query, this.currentPage, this.pageSize, platformId).subscribe({
      next: (response) => {
        console.log('API Response:', response); // Log the response for debugging
        if (response.count === 0) {
          this.errorMessage = 'No games found for your search.';
        } else {
          this.games = response.results;
          this.totalPages = Math.ceil(response.count / this.pageSize);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching games:', error);
        this.errorMessage = 'Failed to load games. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  fetchGamesByPlatform(platformId: number, page: number) {
    this.isLoading = true;
    this.errorMessage = null;

    // Fetch games by platform without search query
    this.rawgService.getGamesByPlatform(platformId, page, this.pageSize).subscribe({
      next: (response) => {
        this.games = response.results;
        this.totalPages = Math.ceil(response.count / this.pageSize);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching games by platform:', error);
        this.errorMessage = 'Failed to load games. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  loadNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchGames(this.searchQuery, this.platformId); // Ensure the search query is passed with pagination
    }
  }

  loadPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchGames(this.searchQuery, this.platformId); // Ensure the search query is passed with pagination
    }
  }

  getGenres(game: any): string {
    return game.genres ? game.genres.map((g: any) => g.name).join(', ') : 'N/A';
  }
  goToGameDetail(game: any) {
    this.router.navigate(['/game-detail', game.id], {
      state: { gameDetails: game }
    });
  }
}
