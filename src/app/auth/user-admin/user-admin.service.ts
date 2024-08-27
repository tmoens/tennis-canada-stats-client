import { Injectable } from '@angular/core';
import { UserDTO } from '../UserDTO';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStateService } from '../../app-state.service';
import { AuthApiService } from '../auth-api.service';
import { Router } from '@angular/router';
import { STATSTOOL } from '../../../assets/stats-tools';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  public selected$: BehaviorSubject<UserDTO> = new BehaviorSubject<UserDTO>(
    null
  );
  // This keeps track of whether the user is editing or browsing
  public inEditMode = false;
  userList: UserDTO[] = [];

  constructor(
    private authApiService: AuthApiService,
    private message: MatSnackBar,
    private appState: AppStateService,
    private router: Router
  ) {}

  get selected() {
    return this.selected$.getValue();
  }

  initialize() {
    // Intentionally left blank.
  }

  getAllUsers() {
    this.authApiService.getUsers().subscribe((data: UserDTO[]) => {
      if (data) {
        this.userList = data;
        if (!this.selected && this.userList.length > 0) {
          this.select(this.userList[0]);
        }
      }
    });
  }

  select(user: UserDTO) {
    this.selected$.next(user);
  }

  selectById(id: string) {
    if (id) {
      this.authApiService.getInstance(id).subscribe((user: UserDTO) => {
        if (user) {
          this.select(user);
        } else {
          this.select(null);
        }
      });
    }
  }

  getById(id: string): Observable<UserDTO> {
    return this.authApiService.getInstance(id);
  }

  create(user: UserDTO) {
    this.authApiService
      .create(user)
      .subscribe((u: UserDTO) => this.reloadAndNavigate(u));
  }

  delete(id: string) {
    this.authApiService.delete(id).subscribe((result) => {
      if (result) {
        this.message.open(result.name + ' deleted.', null, {
          duration: this.appState.getState('confirmMessageDuration'),
        });
        this.reloadAndNavigate(null);
      }
    });
  }

  update(user: UserDTO) {
    this.authApiService.update(user).subscribe((u: UserDTO) => {
      this.reloadAndNavigate(u);
    });
  }

  activate(user: UserDTO) {
    this.authApiService.activate(user).subscribe((u: UserDTO) => {
      this.reloadAndNavigate(u);
    });
  }

  deactivate(user: UserDTO) {
    this.authApiService.deactivate(user).subscribe((u: UserDTO) => {
      this.reloadAndNavigate(u);
    });
  }

  forceLogout(user: UserDTO) {
    this.authApiService.forceLogout(user).subscribe((u: UserDTO) => {
      this.reloadAndNavigate(u);
    });
  }

  reloadAndNavigate(user?: UserDTO) {
    // In case any of the changes drop or add the user from or to the filtered set.
    if (user) {
      this.selectById(user.id);
    } else {
      this.select(null);
    }
    this.getAllUsers();
    this.router
      .navigateByUrl(
        STATSTOOL.USER_MANAGER.route + '/view' + (user ? '/' + user.id : '')
      )
      .then();
  }

  isEmailInUse(email: string): Observable<boolean> {
    return this.authApiService.isEmailInUse(email);
  }

  isUsernameInUse(email: string): Observable<boolean> {
    return this.authApiService.isUsernameInUse(email);
  }

  isNameInUse(email: string): Observable<boolean> {
    return this.authApiService.isNameInUse(email);
  }

  enterBrowseMode() {
    this.inEditMode = false;
  }
}
