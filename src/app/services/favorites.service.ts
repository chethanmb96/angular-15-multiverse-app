import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'rm_multiverse_favorites';
  private favoritesSubject = new BehaviorSubject<Character[]>(this.loadFavorites());

  favorites$: Observable<Character[]> = this.favoritesSubject.asObservable();

  private loadFavorites(): Character[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveFavorites(favorites: Character[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Could not save favorites to localStorage', e);
    }
  }

  getFavorites(): Character[] {
    return this.favoritesSubject.getValue();
  }

  isFavorite(characterId: number): boolean {
    return this.favoritesSubject.getValue().some(c => c.id === characterId);
  }

  toggleFavorite(character: Character): boolean {
    const current = this.favoritesSubject.getValue();
    const index = current.findIndex(c => c.id === character.id);
    let updated: Character[];
    let added = false;

    if (index >= 0) {
      updated = current.filter(c => c.id !== character.id);
      added = false;
    } else {
      updated = [character, ...current];
      added = true;
    }

    this.saveFavorites(updated);
    this.favoritesSubject.next(updated);
    return added;
  }

  removeFavorite(characterId: number): void {
    const current = this.favoritesSubject.getValue();
    const updated = current.filter(c => c.id !== characterId);
    this.saveFavorites(updated);
    this.favoritesSubject.next(updated);
  }

  clearFavorites(): void {
    this.saveFavorites([]);
    this.favoritesSubject.next([]);
  }
}
