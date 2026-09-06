import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models/character.model';
import { StatusColorPipe } from '../../pipes/status-color.pipe';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule, StatusColorPipe],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.css']
})
export class CharacterCardComponent {
  @Input() character!: Character;
  @Input() isFavorite: boolean = false;

  @Output() cardClick = new EventEmitter<Character>();
  @Output() toggleFavorite = new EventEmitter<Character>();

  onToggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleFavorite.emit(this.character);
  }

  onCardClick(): void {
    this.cardClick.emit(this.character);
  }
}
