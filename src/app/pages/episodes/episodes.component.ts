import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Episode, EpisodeResponse } from '../../models/episode.model';
import { EpisodeService } from '../../services/episode.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.css']
})
export class EpisodesComponent implements OnInit {
  private episodeService = inject(EpisodeService);

  episodes: Episode[] = [];
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  loading = true;
  errorMessage = '';

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.fetchEpisodes();

    this.searchControl.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.fetchEpisodes();
    });
  }

  fetchEpisodes(): void {
    this.loading = true;
    this.errorMessage = '';

    const search = this.searchControl.value || '';
    this.episodeService.getEpisodes(this.currentPage, search).subscribe({
      next: (res: EpisodeResponse) => {
        this.episodes = res.results;
        this.totalPages = res.info.pages;
        this.totalCount = res.info.count;
        this.loading = false;
      },
      error: (err) => {
        this.episodes = [];
        this.totalPages = 1;
        this.totalCount = 0;
        this.loading = false;
        if (err.status === 404) {
          this.errorMessage = 'No episodes match your search query.';
        } else {
          this.errorMessage = 'Failed to fetch episodes.';
        }
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchEpisodes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
