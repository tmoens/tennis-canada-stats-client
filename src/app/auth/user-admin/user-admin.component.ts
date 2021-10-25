import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStateService} from '../../app-state.service';
import {UserAdminService} from './user-admin.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AuthService} from '../auth.service';
import {STATSTOOL} from '../../../assets/stats-tools';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss'],
})
export class UserAdminComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public appState: AppStateService,
    public authService: AuthService,
    public service: UserAdminService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.route.url.subscribe( () => this.appState.setActiveTool(STATSTOOL.USER_MANAGER));
  }
}
