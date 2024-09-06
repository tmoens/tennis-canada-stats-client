import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivateComponent } from './auth/guards/can-deactivate-component';

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) {}

  async confirm(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(CanDeactivateComponent, {
      data: {
        message: message,
      },
    });

    return dialogRef.afterClosed().toPromise();
  }
}
