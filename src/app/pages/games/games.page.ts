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
  pageSize = 20;
  totalPages: number = 1;
  searchQuery = '';

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize the platform ID and fetch games by platform
    this.platformId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchGamesByPlatform(this.platformId, this.currentPage);
  }

  // Handle search button click event
  onSearchButtonClick() {
    if (this.searchQuery.trim() !== '') {
      this.currentPage = 1;
      this.fetchGames(this.searchQuery, this.platformId);
    } else {
      this.fetchGamesByPlatform(this.platformId, this.currentPage);
    }
  }

  // Fetch games based on search query and platform ID
  fetchGames(query: string = '', platformId: number) {
    this.isLoading = true;
    this.errorMessage = null;

    this.rawgService.searchGames(query, this.currentPage, this.pageSize, platformId).subscribe({
      next: (response) => {
        console.log('API Response:', response);
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

  // Fetch games by platform ID
  fetchGamesByPlatform(platformId: number, page: number) {
    this.isLoading = true;
    this.errorMessage = null;

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

  // Load the next page of games
  loadNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchGames(this.searchQuery, this.platformId);
    }
  }

  // Load the previous page of games
  loadPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchGames(this.searchQuery, this.platformId);
    }
  }

  // Get the genres of a game as a string
  getGenres(game: any): string {
    return game.genres ? game.genres.map((g: any) => g.name).join(', ') : 'N/A';
  }

  // Navigate to the game detail page
  goToGameDetail(game: any) {
    this.router.navigate(['/game-detail', game.id], {
      state: { gameDetails: game }
    });
  }
}
