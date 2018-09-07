import { Component, OnInit } from '@angular/core';
import {AppStateService} from "../app-state.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public appState:AppStateService,) { }

  ngOnInit() {
    this.appState.setActiveTool("Home");
  }
}
