import { Pipe, PipeTransform } from '@angular/core';

// Truncate a string to a given length replacing the truncated part with three dots.
@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 60, trail = '...'): string {
    if (!value) {
      return '';
    }
    if (value.length <= limit) {
      return value;
    }
    return value.slice(0, limit) + trail;
  }
}
