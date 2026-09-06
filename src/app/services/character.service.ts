import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse, Character, CharacterFilter } from '../models/character.model';
import { Episode } from '../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private http = inject(HttpClient);
  private baseUrl = 'https://rickandmortyapi.com/api';

  getCharacters(filter: CharacterFilter = {}): Observable<ApiResponse<Character>> {
    let params = new HttpParams();

    if (filter.page) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.name?.trim()) {
      params = params.set('name', filter.name.trim());
    }
    if (filter.status && filter.status !== 'all') {
      params = params.set('status', filter.status);
    }
    if (filter.species && filter.species !== 'all') {
      params = params.set('species', filter.species);
    }
    if (filter.gender && filter.gender !== 'all') {
      params = params.set('gender', filter.gender);
    }

    return this.http.get<ApiResponse<Character>>(`${this.baseUrl}/character`, { params });
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/character/${id}`);
  }

  getMultipleCharacters(ids: number[]): Observable<Character[]> {
    if (!ids || ids.length === 0) {
      return of([]);
    }
    return this.http.get<Character[] | Character>(`${this.baseUrl}/character/${ids.join(',')}`).pipe(
      map(res => Array.isArray(res) ? res : [res])
    );
  }

  getEpisodesByUrls(episodeUrls: string[]): Observable<Episode[]> {
    if (!episodeUrls || episodeUrls.length === 0) {
      return of([]);
    }
    // Rick and Morty API allows batching episode IDs: /api/episode/1,2,3
    const ids = episodeUrls
      .map(url => url.split('/').filter(Boolean).pop())
      .filter((id): id is string => !!id);

    if (ids.length === 0) return of([]);

    return this.http.get<Episode[] | Episode>(`${this.baseUrl}/episode/${ids.join(',')}`).pipe(
      map(res => Array.isArray(res) ? res : [res]),
      catchError(() => of([]))
    );
  }
}
