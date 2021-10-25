import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserAdminService} from '../user-admin.service';
import {UserDTO} from '../../UserDTO';
import {AuthService} from '../../auth.service';
import {STATSTOOL} from '../../../../assets/stats-tools';
import {EditMode} from '../user-editor/user-editor.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  user: UserDTO;

  constructor(
    private router: Router,
    public service: UserAdminService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.service.selected$.subscribe((u: UserDTO) => {
      this.user = u;
    });
  }

  create() {
    this.router.navigate([STATSTOOL.USER_MANAGER.route + '/' + EditMode.CREATE, {
      mode: EditMode.CREATE,
    }]);
  }

  delete(id: string) {
    this.service.delete(id);
  }

  edit() {
    this.router.navigate([STATSTOOL.USER_MANAGER.route + '/' + EditMode.EDIT, {
      id: this.service.selected.id,
      mode: EditMode.EDIT,
    }]);
  }

}
