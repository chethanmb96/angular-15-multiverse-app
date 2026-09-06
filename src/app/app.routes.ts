import { Routes } from '@angular/router';
import { CharacterListComponent } from './pages/character-list/character-list.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { EpisodesComponent } from './pages/episodes/episodes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  { path: 'characters', component: CharacterListComponent, title: 'Multiverse Explorer | Characters' },
  { path: 'favorites', component: FavoritesComponent, title: 'Multiverse Explorer | Favorites' },
  { path: 'episodes', component: EpisodesComponent, title: 'Multiverse Explorer | Episodes' },
  { path: '**', redirectTo: 'characters' }
];
