import {Injectable} from '@angular/core';
import {UserDTO} from '../UserDTO';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppStateService} from '../../app-state.service';
import {AuthApiService} from '../auth-api.service';
import {Router} from '@angular/router';
import {UserFilter} from './user-filter';
import {STATSTOOL} from '../../../assets/stats-tools';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  filter: UserFilter;
  public selected$: BehaviorSubject<UserDTO> = new BehaviorSubject<UserDTO>(null);
  get selected() { return this.selected$.getValue(); }

  // This keeps track of whether the user is editing or browsing
  public inEditMode = false;

  filteredList: UserDTO[] = [];

  constructor(
    private authApiService: AuthApiService,
    private message: MatSnackBar,
    private appState: AppStateService,
    private router: Router,
  ) {
  }

  initialize() {
      this.filter = new UserFilter();
  }

  applyFilter(filter: UserFilter) {
    this.filter = filter;
    this.authApiService.getUsers(filter)
      .subscribe((data: UserDTO[]) => {
        if (data) {
          this.filteredList = data;
          if (!this.selected && this.filteredList.length > 0) {
            this.select(this.filteredList[0]);
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
    this.authApiService.create(user)
      .subscribe((u: UserDTO) => this.refilterAndNavigate(u));
  }

  delete(id: string) {
    this.authApiService.delete(id).subscribe((result) => {
      if (result) {
        this.message.open(result.name + ' deleted.', null, {duration: this.appState.getState('confirmMessageDuration')});
        this.refilterAndNavigate(null);
      }
    });
  }

  update(user: UserDTO) {
    this.authApiService.update(user)
      .subscribe((u: UserDTO) => {
        this.refilterAndNavigate(u);
      });
  }

  activate(user: UserDTO) {
    this.authApiService.activate(user)
      .subscribe((u: UserDTO) => {
        this.refilterAndNavigate(u);
      });
  }

  deactivate(user: UserDTO) {
    this.authApiService.deactivate(user)
      .subscribe((u: UserDTO) => {
        this.refilterAndNavigate(u);
      });
  }

  forceLogout(user: UserDTO) {
    this.authApiService.forceLogout(user)
      .subscribe((u: UserDTO) => {
        this.refilterAndNavigate(u);
      });
  }

  refilterAndNavigate(user?: UserDTO) {
    // In case any of the changes drop or add the user from or to the filtered set.
    if (user) {
      this.selectById(user.id);
    } else {
      this.select(null);
    }
    this.applyFilter(this.filter);
    this.router.navigateByUrl(STATSTOOL.USER_MANAGER.route + '/view' + ((user) ? '/' + user.id : ''));
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

  isInitialsInUse(email: string): Observable<boolean> {
    return this.authApiService.isInitialsInUse(email);
  }

  enterEditMode() {
    this.inEditMode = true;
  }

  enterBrowseMode() {
    this.inEditMode = false;
  }
}
