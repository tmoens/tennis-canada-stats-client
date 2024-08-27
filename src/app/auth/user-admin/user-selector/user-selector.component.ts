import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserDTO } from '../../UserDTO';
import { Router } from '@angular/router';
import { UserAdminService } from '../user-admin.service';
import { AppStateService } from '../../../app-state.service';
import { STATSTOOL } from '../../../../assets/stats-tools';

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html',
})
export class UserSelectorComponent implements OnInit {
  @Output() selected = new EventEmitter<UserDTO>();

  constructor(
    public appState: AppStateService,
    private router: Router,
    public service: UserAdminService
  ) {}

  ngOnInit(): void {
    this.service.getAllUsers();
  }

  // when the user clicks on a user, go view it
  onSelect(instance: UserDTO | null) {
    this.selected.emit(instance);
    this.service.select(instance);
    this.router
      .navigateByUrl(STATSTOOL.USER_MANAGER.route + '/view/' + instance.id)
      .then();
  }
}
