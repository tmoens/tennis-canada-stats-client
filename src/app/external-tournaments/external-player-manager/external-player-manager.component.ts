import { Component,  OnInit } from '@angular/core';

import { VRPlayer } from '../VRPlayer';
import { ExternalPlayer } from './external-player';
import { ExternalTournamentService } from '../external-tournament.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/count';
import {of} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-itf-player-list',
  templateUrl: './external-player-manager.component.html',
  styleUrls: ['./external-player-manager.component.scss'],
})

export class ExternalPlayerManagerComponent implements OnInit {
  // The filtered set of ITF Players the user is looking at to give them VR IDs
  ITFPlayers$: Observable<ExternalPlayer[]>;
  ITFPlayers: ExternalPlayer[];

  // The ITF Player the user has selected and is trying to give a VR ID to
  selectedITFPlayer: ExternalPlayer;

  // Elements of the filter for ITF Players that the user can set.
  onlyPlayersWithoutVRID: boolean; // skip players who already have a VR ID (default is true)
  searchString: string; // any string in the last name OR in the ITF ID (default is empty)

  // The list of VR players whose last name matches the last name of the ITF player currently selected
  VRPlayers$: Observable<VRPlayer[]>;
  VRPlayers: VRPlayer[];
  VRPlayerCount: number;

  // Input field that contains the proposed VR ID for an existing ITF Player
  newVRIdentifier: string;
  failedVRPlayerLookup = false; // asked to look up a VR player that does not exist;
  newVRPlayer = new VRPlayer();

  // For showing progress to the user
  externalPlayersLoading = false;
  VRPlayersLoading = false;
  matchesCompleted = 0;

  // If the user needs instruction what to do if she cannot find a VR player to match
  // an existing ITF player.
  showVRMatchHelp = false;

  // A rxjs subject based that changes when the ITF player search values change.
  // When it changes, it triggers a new ITF player search via the itfDataService
  // which in turn causes the ITFPLayers Observable to be updated.
  // Note if it is a Subject (as per the Angular demo) and not a BehaviorSubject,
  // Then the initial http response from the server does not make it to the GUI
  private ITFSearchTerms = new BehaviorSubject('nothing');

  // Similar thing for keeping the VR Player List updated.
  // It effectively holds an observable steam of the selected ITF player IDs
  // When it changes, it triggers a new request for VR Players.
  private VRSearchTerms = new BehaviorSubject<string>('');

  // An Observable for the response to an update request
  private updateStatus$ = new Observable<number>();
  lastUpdateStatus = -1;

  constructor(
    private externalTournamentService: ExternalTournamentService
  ) {};


  ngOnInit() {
    // By default, filter out ITF players that already have a VR ID
    this.onlyPlayersWithoutVRID = true;

    // This is where the work gets done to keep the ITF Players List
    // up to date whenever the search filter changes.
    // Ideally, I think the filter terms should be in the BehaviorSubject
    // but I am just pulling them from local variables.
    this.ITFPlayers = [];
    this.ITFPlayers$ = this.ITFSearchTerms
      .debounceTime(300)        // wait 100ms after each keystroke before considering the term
      .switchMap(() => this.externalTournamentService.searchPlayers(this.searchString, this.onlyPlayersWithoutVRID))
      .catch(error => {
        console.log(error);
        return of<ExternalPlayer[]>([]);
      });

    // Watch for the arrival of the ITF Players from the Server
    this.VRPlayers = [];
    this.ITFPlayers$.subscribe(
      data => {
        this.ITFPlayersArrived(data);
      },
    );

    this.VRPlayers$ = this.VRSearchTerms.pipe(
      debounceTime(300),
      switchMap((id: string) => this.externalTournamentService.findVRMatches(id))
  );

    this.VRPlayers$.subscribe(data => {
      this.VRPlayersArrived(data);
    });

    // Do an initial search.
    this.onITFPlayerFilterChange();
  }

  // TODO priority: medium. Manage state properly
  // We seem to be building state haphazardly and it is a little obtuse in
  // the code when we adjust state.
  // For example, when we chose a new player from the ITF player list, should we really have
  // to know to unset a failed VR lookup for a different ITF Player. Not so much.

  // a new ITF Player Search was requested.
  onITFPlayerFilterChange(): void {
    this.externalPlayersLoading = true;
    this.ITFSearchTerms.next('nothing');
    this.selectedITFPlayer = null;
    // We need to clear anything that was in progress when the search was done
    // Wipe the vrIdentifier that was being entered.
    this.newVRIdentifier = null;
    // A clearly invalid ITF ID which will not be found and therefore will match no VR Players
    this.VRPlayersLoading = false;
    this.VRSearchTerms.next(null);
    // There is no putative link to a player in the VR database.
    this.newVRPlayer = new VRPlayer();
    // There is no failed lookup for a VR player.
    this.failedVRPlayerLookup = false;
    this.showVRMatchHelp = false;
  }

  // When an ITF player is selected, go get a list of VR players with matching last names.
  onSelectITFPlayer(player: ExternalPlayer): void {
    if (this.selectedITFPlayer != player) {
      this.selectedITFPlayer = player;
      // Wipe the vrIdentifier that was being entered (if any).
      this.newVRIdentifier = null;
      this.VRPlayersLoading = true;
      this.VRSearchTerms.next(this.selectedITFPlayer.playerId)
      this.newVRPlayer = new VRPlayer();
      this.failedVRPlayerLookup = false;
      this.showVRMatchHelp = false;
    }
  }

  // When a VR Player is selected, set the putative new VR ID for the selected ITF Player
  onSelectVRPlayer(player: VRPlayer = null): void {
    if (player === null) {
      this.newVRPlayer = null;
      this.newVRIdentifier = null;
    } else {
      this.newVRIdentifier = player.playerId;
      this.newVRPlayer = player;
    }
    this.failedVRPlayerLookup = false;
  }

  // The user has manually entered a vrId for an ITF Player
  onVRIDChange(): void {
    this.newVRPlayer = new VRPlayer();
    this.failedVRPlayerLookup = false;

    // TODO priority: lowest -> next 5 lines are a duplication of the validation on the form.
    // would like to just check the form validation, but ok.
    let n = parseInt(this.newVRIdentifier);
    if (isNaN(n)|| (10000000 > n || 100000000 < n)) {
      return;
    }

    // The supplied VR ID syntactically valid (8 digits) - go look for the player.
    this.externalTournamentService.getVRPlayerById(this.newVRIdentifier)
      .then(player => {
        if (player != null) {
          this.newVRPlayer = player;
        } else {
          this.failedVRPlayerLookup = true;
        }
      });
  }

  ITFPlayersArrived(data):void {
    this.ITFPlayers = data;
    this.externalPlayersLoading = false;
    this.VRPlayersLoading = false;
    this.showVRMatchHelp = false;
    this.matchesCompleted = 0;
  }

  VRPlayersArrived(data):void {
    this.VRPlayers = data;
    this.VRPlayerCount = data.length;
    this.VRPlayersLoading = false;
    this.showVRMatchHelp = (this.VRPlayerCount === 0);
    this.lookupVRPlayer();
  }

  onShowVRMatchHelp() {
    this.showVRMatchHelp = true;
  }

  // The match is correct - it is shown clearly to the user and the user confirmed
  // So DO IT
  onConfirmMatch():void {
    this.externalTournamentService.setExternalPlayerVRID(this.selectedITFPlayer.playerId, this.newVRPlayer.playerId)
      .then(updatedPlayer => {
        if (updatedPlayer) {
          // Touch up the ITF player list without reloading it.
          for (const i in this.ITFPlayers) {
            const index = parseInt(i, 10);
            if (this.ITFPlayers[i].playerId === updatedPlayer.playerId) {
              this.ITFPlayers[i] = updatedPlayer;
              if (this.ITFPlayers.length > index + 1) {
                this.onSelectITFPlayer(this.ITFPlayers[index + 1]);
              } else {
                this.onSelectITFPlayer(this.ITFPlayers[0]);
              }
              break;
            }
          }
          this.matchesCompleted++;
        }
        // clear it in 5 seconds
        setTimeout(() => {
          this.lastUpdateStatus = -1;
        }, 5000);
      });
  }

  onNoMatch(): void {
    this.lookupVRPlayer();
  }

  /*
   * Assuming that there is a selected player from the ITF list,
   * AND that player has a VRID, look if that VR player is in the
   * local list of VRPlayers.
   */
  lookupVRPlayer() {
    for (const p of this.VRPlayers) {
      if (this.selectedITFPlayer.tcPlayer && p.playerId === this.selectedITFPlayer.tcPlayer.playerId) {
        this.onSelectVRPlayer(p);
        return;
      }
    }
    this.onSelectVRPlayer();
  }
}
