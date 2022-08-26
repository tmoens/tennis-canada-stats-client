import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserLoaderService} from '../user-loader.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserDTO} from '../../UserDTO';
import {Router} from '@angular/router';
import {UntypedFormBuilder} from '@angular/forms';
import {UserAdminService} from '../user-admin.service';
import {debounceTime} from 'rxjs/operators';
import {UserFilter} from '../user-filter';
import {AppStateService} from '../../../app-state.service';
import {STATSTOOL} from '../../../../assets/stats-tools';

@Component({
  selector: 'app-user-selector',
  template: `
    <mat-card>
      <mat-card-content>
        <div fxLayout="column" fxLayoutGap="20px">
          <H2>Users List</H2>
          <ng-container *ngIf="service.filteredList.length > 0">
            <mat-selection-list #items dense [multiple]="false"
                                (selectionChange)="onSelect(items.selectedOptions.selected[0]?.value)">
              <mat-list-option *ngFor="let item of service.filteredList"
                               [value]="item"
                               [selected]="service.selected?.id === item.id"
                               [class.selected]="service.selected && service.selected.id === item.id">
                <div mat-line>
                  <div class="h4">
                    {{item.name}}
                  </div>
                </div>
                <div *ngIf="item.email" mat-line>Email: {{item.email}}</div>
                <div *ngIf="item.username" mat-line>User Id: {{item.username}}</div>
              </mat-list-option>
            </mat-selection-list>
          </ng-container>
          <div *ngIf="service.filteredList.length == 0">
            <p>No users match the current filter.</p>
            <p>Try relaxing the filter criteria. </p>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class UserSelectorComponent implements OnInit {
  @Output() selected = new EventEmitter<UserDTO>();

  // Build the filter form.
  mfForm = this.fb.group(this.service.filter);

  users: UserDTO[] = [];
  constructor(
    public appState: AppStateService,
    private readonly loader: UserLoaderService,
    private snackBar: MatSnackBar,
    private router: Router,
    public service: UserAdminService,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    // any time a filter value changes, reapply the filter.
    this.mfForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.service.applyFilter(new UserFilter(this.mfForm.value));
    });
    this.service.applyFilter(new UserFilter(this.mfForm.value));
  }

  // when the user clicks on a user, go view it
  onSelect(instance: UserDTO | null) {
    this.selected.emit(instance);
    this.service.select(instance);
    this.router.navigateByUrl(STATSTOOL.USER_MANAGER.route + '/view/' + instance.id);
  }


}
