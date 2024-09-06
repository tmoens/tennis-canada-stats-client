import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppStateService } from '../app-state.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { TC_DATE_FORMATS } from '../dateFormats';
import { UntypedFormControl } from '@angular/forms';
import { STATSTOOL } from '../../assets/stats-tools';
import { JobStatusService } from '../job-status/job-status.service';
import { JobState } from '../job-status/job.state';
import { JobStats } from '../job-status/job-stats';

const BUILD_RATINGS_REPORT_URL = '/Event/buildRatingsReport';
const DOWNLOAD_RATINGS_REPORT_URL = '/Event/downloadRatingsReport';

@Component({
  selector: 'app-tournament-strength',
  templateUrl: './tournament-strength.component.html',
  styleUrls: ['./tournament-strength.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: TC_DATE_FORMATS }],
})
export class TournamentStrengthComponent implements OnInit {
  state: { buildingRatings: boolean; ratingsReady: boolean } = {
    buildingRatings: false,
    ratingsReady: false,
  };
  result = 'No result.';
  downloadURL: string;
  today: Date;
  beginningOfTime: Date;
  toDateFC: UntypedFormControl;
  fromDate: any;
  filterCriteria: any;
  requestStatus: JobStats;
  progress = 0;

  periods = [
    { label: '1 month prior', value: '31' },
    { label: '2 months prior', value: '61' },
    { label: '3 months prior', value: '91' },
    { label: '4 months prior', value: '122' },
    { label: '6 months prior', value: '182' },
    { label: '9 months prior', value: '273' },
    { label: '12 months prior', value: '365' },
  ];
  jurisdictions = [
    { label: 'All', value: '' },
    { label: 'Tennis Alberta', value: 'AB' },
    { label: 'Tennis Manitoba', value: 'MB' },
    { label: 'Tennis BC', value: 'BC' },
    { label: 'Tennis Quebec', value: 'QC' },
    { label: 'Tennis NovaScotia', value: 'NS' },
    { label: 'Tennis NL', value: 'NL' },
    { label: 'Tennis New Brunswick', value: 'NB' },
    { label: 'Ontario Tennis Association', value: 'ON' },
    { label: 'Tennis Saskatchewan', value: 'SK' },
    { label: 'Tennis PEI', value: 'PE' },
    { label: 'Tennis Canada', value: 'TC' },
  ];

  genders = [
    { label: 'Both', value: '' },
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
  ];

  constructor(
    private appState: AppStateService,
    private http: HttpClient,
    private jobStatusService: JobStatusService
  ) {
    this.toDateFC = new UntypedFormControl(moment());
    this.fromDate = moment();
    this.today = new Date();
    this.beginningOfTime = new Date('2014-01-01');
  }

  ngOnInit() {
    this.appState.setActiveTool(STATSTOOL.TOURNAMENT_STRENGTH_REPORTER);
    this.resetFilters();
    // When initializing, check if there is already an upload in progress
    // If so, just join in to get status updates.
    this.pollStatus();
  }

  resetFilters() {
    this.filterCriteria = {
      period: this.periods[0],
      jurisdiction: this.jurisdictions[0],
      gender: this.genders[0],
      categories: {
        allSeniorCategories: true,
        seniorCategories: [
          { id: 'O30', value: true },
          { id: 'O35', value: true },
          { id: 'O40', value: true },
          { id: 'O45', value: true },
          { id: 'O50', value: true },
          { id: 'O55', value: true },
          { id: 'O60', value: true },
          { id: 'O65', value: true },
          { id: 'O70', value: true },
          { id: 'O75', value: true },
          { id: 'O80', value: true },
          { id: 'O85', value: true },
        ],
        allJuniorCategories: true,
        juniorCategories: [
          { id: 'U18', value: true },
          { id: 'U16', value: true },
          { id: 'U14', value: true },
          { id: 'U12', value: true },
        ],
        allAdultCategories: true,
        adultCategories: [
          { id: 'Open', value: true, code: 'L1' },
          { id: '5.0', value: true, code: 'L2' },
          { id: '4.5', value: true, code: 'L3' },
          { id: '4.0', value: true, code: 'L4' },
          { id: '3.5', value: true, code: 'L5' },
          { id: '3.0', value: true, code: 'L6' },
          { id: '2.5', value: true, code: 'L7' },
        ],
      },
    };
    this.toDateFC = new UntypedFormControl(moment());
  }

  // For managing which junior categories are selected.
  // When a junior category is selected, just check if the "all" item should be checked
  juniorCategorySelected(item: any) {
    this.filterChange();
    this.filterCriteria.categories.allJuniorCategories =
      this.resetCategoryGroupSelector(
        this.filterCriteria.categories.juniorCategories,
        item
      );
  }

  // For managing which adult categories are selected.
  // When an adult category is selected, just check if the "all" item should be checked
  adultCategorySelected(item: any) {
    this.filterChange();
    this.filterCriteria.categories.allAdultCategories =
      this.resetCategoryGroupSelector(
        this.filterCriteria.categories.adultCategories,
        item
      );
  }

  // For managing which senior categories are selected.
  // When a senior category is selected, just check if the "all" item should be checked
  seniorCategorySelected(item: any) {
    this.filterChange();
    this.filterCriteria.categories.allSeniorCategories =
      this.resetCategoryGroupSelector(
        this.filterCriteria.categories.seniorCategories,
        item
      );
  }

  // When an item in a group is selected, check if all the items are selected
  // note that the item selected  has the value it had *before* it was ticked
  resetCategoryGroupSelector(catArray: string | any[], changingItem: any) {
    let all = true;
    for (const item of catArray) {
      if (item.id === changingItem) {
        if (item.value) {
          all = false;
          break;
        }
      } else if (!item.value) {
        all = false;
        break;
      }
    }
    return all;
  }

  // When the "all juniors categories" tick box gets selected, if they are already all selected,
  // then deselect them all, otherwise select them all
  allJuniorsSelected() {
    this.filterChange();
    this.setEntireCategoryGroup(
      this.filterCriteria.categories.juniorCategories,
      this.filterCriteria.categories.allJuniorCategories
    );
  }

  allAdultsSelected() {
    this.filterChange();
    this.setEntireCategoryGroup(
      this.filterCriteria.categories.adultCategories,
      this.filterCriteria.categories.allAdultCategories
    );
  }

  allSeniorsSelected() {
    this.filterChange();
    this.setEntireCategoryGroup(
      this.filterCriteria.categories.seniorCategories,
      this.filterCriteria.categories.allSeniorCategories
    );
  }

  setEntireCategoryGroup(categoryArray: any, value: any) {
    for (const category of categoryArray) {
      category.value = value;
    }
  }

  filterChange() {
    this.state.ratingsReady = false;
    this.requestStatus = null;
  }

  // Construct the URL which is used to build the report.
  buildReportURL(): string {
    this.state.ratingsReady = false;
    const searchString = [];

    if (this.filterCriteria.jurisdiction.value !== '') {
      searchString.push('province=' + this.filterCriteria.jurisdiction.value);
    }

    /* Push the "to date" into the search string */
    searchString.push('to=' + this.toDateFC.value.format('YYYY-MM-DD'));

    /* Calculate the "from date" and push it into the search string. */
    this.fromDate = moment(this.toDateFC.value);
    searchString.push(
      'from=' +
        this.fromDate
          .subtract(this.filterCriteria.period.value, 'days')
          .format('YYYY-MM-DD')
    );

    /* Add a search string item for every selected category */
    const categories: string[] = [];
    for (const cat of this.filterCriteria.categories.juniorCategories) {
      if (cat.value) {
        categories.push('J' + cat.id);
      }
    }
    for (const cat of this.filterCriteria.categories.adultCategories) {
      if (cat.value) {
        categories.push('A' + cat.code);
      }
    }
    for (const cat of this.filterCriteria.categories.seniorCategories) {
      if (cat.value) {
        categories.push('S' + cat.id);
      }
    }
    const adjustedCategories: string[] = [];
    for (const cat of categories) {
      if (this.filterCriteria.gender.value) {
        adjustedCategories.push(
          cat.slice(0, 1) +
            this.filterCriteria.gender.value +
            'S' +
            cat.slice(1)
        );
      } else {
        adjustedCategories.push(cat.slice(0, 1) + 'MS' + cat.slice(1));
        adjustedCategories.push(cat.slice(0, 1) + 'FS' + cat.slice(1));
      }
    }
    searchString.push('categories=' + adjustedCategories);
    return `${environment.serverPrefix}${BUILD_RATINGS_REPORT_URL}?${searchString.join('&')}`;
  }

  async buildReport() {
    this.state.buildingRatings = true;
    this.state.ratingsReady = false;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    // Because the query can take a long time, we don't do anything with the response.
    // Instead, we start polling for status of the report building.
    this.http.get<string>(this.buildReportURL(), httpOptions).subscribe(() => {
      this.pollStatus();
    });
  }

  pollStatus(): void {
    this.jobStatusService
      .getStatus(BUILD_RATINGS_REPORT_URL)
      .subscribe((data) => {
        this.requestStatus = data;
        if (this.requestStatus.status === JobState.IN_PROGRESS) {
          setTimeout(() => this.pollStatus(), 200);
        } else if (this.requestStatus.status === JobState.DONE) {
          this.state.buildingRatings = false;
          if (this.requestStatus.data.filename) {
            this.state.ratingsReady = true;
            this.downloadURL = `${environment.serverPrefix}${DOWNLOAD_RATINGS_REPORT_URL}?filename=${this.requestStatus.data.filename}`;
          } else {
            // If the job is finished, there should be a filename. But just in case, fail silently.
            this.state.ratingsReady = false;
          }
        } else {
          this.state.ratingsReady = false;
          this.state.buildingRatings = false;
        }
      });
  }
}
