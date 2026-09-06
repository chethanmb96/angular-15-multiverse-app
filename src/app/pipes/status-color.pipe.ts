import { Pipe, PipeTransform } from '@angular/core';
import { CharacterStatus } from '../models/character.model';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(status: CharacterStatus): string {
    switch (status) {
      case 'Alive':
        return 'status-alive';
      case 'Dead':
        return 'status-dead';
      default:
        return 'status-unknown';
    }
  }
}
