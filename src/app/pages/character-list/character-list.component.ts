import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Character, CharacterFilter, PageInfo } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { FavoritesService } from '../../services/favorites.service';

import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CharacterFilterComponent } from '../../components/character-filter/character-filter.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CharacterDetailModalComponent } from '../../components/character-detail-modal/character-detail-modal.component';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    CharacterCardComponent,
    CharacterFilterComponent,
    PaginationComponent,
    CharacterDetailModalComponent
  ],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  private characterService = inject(CharacterService);
  private favoritesService = inject(FavoritesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  characters: Character[] = [];
  pageInfo: PageInfo = { count: 0, pages: 1, next: null, prev: null };
  currentFilters: CharacterFilter = { page: 1 };

  loading = true;
  errorMessage = '';

  selectedCharacter: Character | null = null;
  favoriteIds = new Set<number>();

  private destroy$ = new Subject<void>();

  // Dummy array for skeleton loader cards
  readonly skeletonArray = Array(8).fill(0);

  ngOnInit(): void {
    // Track favorites
    this.favoritesService.favorites$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(favs => {
      this.favoriteIds = new Set(favs.map(f => f.id));
    });

    // Listen to query parameters for deep linking
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const page = params['page'] ? parseInt(params['page'], 10) : 1;
      const name = params['name'] || '';
      const status = params['status'] || 'all';
      const species = params['species'] || 'all';
      const gender = params['gender'] || 'all';

      this.currentFilters = { page, name, status, species, gender };
      this.fetchCharacters();
    });
  }

  fetchCharacters(): void {
    this.loading = true;
    this.errorMessage = '';

    this.characterService.getCharacters(this.currentFilters).subscribe({
      next: (response) => {
        this.characters = response.results;
        this.pageInfo = response.info;
        this.loading = false;
        // Scroll to top of list smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.characters = [];
        this.pageInfo = { count: 0, pages: 1, next: null, prev: null };
        this.loading = false;
        if (err.status === 404) {
          this.errorMessage = 'No dimension inhabitants found matching your query criteria.';
        } else {
          this.errorMessage = 'Failed to fetch data from the multiverse index. Please try again.';
        }
      }
    });
  }

  onFiltersChange(filter: CharacterFilter): void {
    // Reset to page 1 on filter change
    this.updateQueryParams({
      ...filter,
      page: 1
    });
  }

  onPageChange(newPage: number): void {
    this.updateQueryParams({
      ...this.currentFilters,
      page: newPage
    });
  }

  private updateQueryParams(filters: CharacterFilter): void {
    const queryParams: Record<string, string | number | null> = {};

    if (filters.page && filters.page > 1) queryParams['page'] = filters.page;
    if (filters.name?.trim()) queryParams['name'] = filters.name.trim();
    if (filters.status && filters.status !== 'all') queryParams['status'] = filters.status;
    if (filters.species && filters.species !== 'all') queryParams['species'] = filters.species;
    if (filters.gender && filters.gender !== 'all') queryParams['gender'] = filters.gender;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '' // replace existing query params
    });
  }

  isFavorite(characterId: number): boolean {
    return this.favoriteIds.has(characterId);
  }

  onToggleFavorite(character: Character): void {
    this.favoritesService.toggleFavorite(character);
  }

  openCharacterDetails(character: Character): void {
    this.selectedCharacter = character;
  }

  closeCharacterDetails(): void {
    this.selectedCharacter = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
