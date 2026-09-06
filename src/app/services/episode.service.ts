import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Episode, EpisodeResponse } from '../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private http = inject(HttpClient);
  private baseUrl = 'https://rickandmortyapi.com/api/episode';

  getEpisodes(page: number = 1, name?: string): Observable<EpisodeResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (name?.trim()) {
      params = params.set('name', name.trim());
    }
    return this.http.get<EpisodeResponse>(this.baseUrl, { params });
  }

  getEpisodeById(id: number): Observable<Episode> {
    return this.http.get<Episode>(`${this.baseUrl}/${id}`);
  }
}
