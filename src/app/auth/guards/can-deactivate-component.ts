import {Component, Inject, } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-can-deactivate',
  templateUrl: './can-deactivate-component.html',
  styleUrls: ['./can-deactivate-component.scss']
})

export class CanDeactivateComponent {

  constructor(
    public dialogRef: MatDialogRef<CanDeactivateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; },
    ) {}

  ignoreChanges() {
    this.dialogRef.close(true);
  }

  continueEditing() {
    this.dialogRef.close(false);
  }
}
