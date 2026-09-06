import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models/character.model';
import { Episode } from '../../models/episode.model';
import { CharacterService } from '../../services/character.service';
import { StatusColorPipe } from '../../pipes/status-color.pipe';

@Component({
  selector: 'app-character-detail-modal',
  standalone: true,
  imports: [CommonModule, StatusColorPipe],
  templateUrl: './character-detail-modal.component.html',
  styleUrls: ['./character-detail-modal.component.css']
})
export class CharacterDetailModalComponent implements OnChanges {
  @Input() character: Character | null = null;
  @Input() isFavorite: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<Character>();

  private characterService = inject(CharacterService);

  episodes: Episode[] = [];
  loadingEpisodes = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['character'] && this.character) {
      this.fetchEpisodes();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  onToggleFavorite(): void {
    if (this.character) {
      this.toggleFavorite.emit(this.character);
    }
  }

  private fetchEpisodes(): void {
    if (!this.character || !this.character.episode || this.character.episode.length === 0) {
      this.episodes = [];
      return;
    }

    this.loadingEpisodes = true;
    this.characterService.getEpisodesByUrls(this.character.episode).subscribe({
      next: (episodes) => {
        this.episodes = episodes;
        this.loadingEpisodes = false;
      },
      error: () => {
        this.episodes = [];
        this.loadingEpisodes = false;
      }
    });
  }
}
