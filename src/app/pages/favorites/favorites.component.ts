import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { Character } from '../../models/character.model';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CharacterDetailModalComponent } from '../../components/character-detail-modal/character-detail-modal.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CharacterCardComponent,
    CharacterDetailModalComponent
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);

  favorites$ = this.favoritesService.favorites$;
  selectedCharacter: Character | null = null;

  onRemoveFavorite(character: Character): void {
    this.favoritesService.toggleFavorite(character);
    if (this.selectedCharacter?.id === character.id) {
      this.selectedCharacter = null;
    }
  }

  onClearAll(): void {
    if (confirm('Are you sure you want to clear all your saved multiverse favorites?')) {
      this.favoritesService.clearFavorites();
      this.selectedCharacter = null;
    }
  }

  openCharacterDetails(character: Character): void {
    this.selectedCharacter = character;
  }

  closeCharacterDetails(): void {
    this.selectedCharacter = null;
  }
}
