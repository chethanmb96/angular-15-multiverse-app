import { Component, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { CharacterFilter } from '../../models/character.model';

@Component({
  selector: 'app-character-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './character-filter.component.html',
  styleUrls: ['./character-filter.component.css']
})
export class CharacterFilterComponent implements OnInit, OnDestroy {
  @Input() initialFilters: CharacterFilter = {};
  @Output() filtersChange = new EventEmitter<CharacterFilter>();

  filterForm = new FormGroup({
    name: new FormControl(''),
    status: new FormControl('all'),
    species: new FormControl('all'),
    gender: new FormControl('all')
  });

  readonly statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: '🟢 Alive', value: 'alive' },
    { label: '🔴 Dead', value: 'dead' },
    { label: '⚪ Unknown', value: 'unknown' }
  ];

  readonly speciesOptions = [
    { label: 'All Species', value: 'all' },
    { label: 'Human', value: 'Human' },
    { label: 'Alien', value: 'Alien' },
    { label: 'Humanoid', value: 'Humanoid' },
    { label: 'Robot', value: 'Robot' },
    { label: 'Mythological', value: 'Mythological Creature' },
    { label: 'Animal', value: 'Animal' },
    { label: 'Cronenberg', value: 'Cronenberg' }
  ];

  readonly genderOptions = [
    { label: 'All Genders', value: 'all' },
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    { label: 'Genderless', value: 'genderless' },
    { label: 'Unknown', value: 'unknown' }
  ];

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (this.initialFilters) {
      this.filterForm.patchValue({
        name: this.initialFilters.name || '',
        status: this.initialFilters.status || 'all',
        species: this.initialFilters.species || 'all',
        gender: this.initialFilters.gender || 'all'
      }, { emitEvent: false });
    }

    // Debounce name search input
    this.filterForm.get('name')?.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.emitCurrentFilters();
    });

    // Instant update for select dropdown changes
    this.filterForm.get('status')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.emitCurrentFilters());
    this.filterForm.get('species')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.emitCurrentFilters());
    this.filterForm.get('gender')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.emitCurrentFilters());
  }

  private emitCurrentFilters(): void {
    const val = this.filterForm.value;
    const filter: CharacterFilter = {
      name: val.name || '',
      status: val.status || 'all',
      species: val.species || 'all',
      gender: val.gender || 'all'
    };
    this.filtersChange.emit(filter);
  }

  resetFilters(): void {
    this.filterForm.reset({
      name: '',
      status: 'all',
      species: 'all',
      gender: 'all'
    });
    this.emitCurrentFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
