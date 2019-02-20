import { Component, OnInit, ViewChild } from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable, Subscription} from 'rxjs';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Train } from '../models/train';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import gql from 'graphql-tag';
import { element } from '@angular/core/src/render3';
import { Station } from '../models/Station';
import { FormControl, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Juna', 'Lähtöasema', 'Pääteasema', 'Saapumisaika'];
  displayedColumnsDeparting: string[] = ['Juna', 'Lähtöasema', 'Pääteasema', 'Lähtöaika'];

  loading: boolean;
  test; // trains
  time; // train arrival/departure times
  private querySubscription: Subscription;

  stations: Station[];
  userInput = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(private apollo: Apollo, private data: DataService) { }

  ngOnInit() {
    this.getStations();
    this.filteredOptions = this.userInput.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  fArr = (arr: Train[], isArriving: boolean) => {
    let type = 'ARRIVAL';
      if (isArriving === false) { type = 'DEPARTURE'; }
    return arr.map(nested => nested.timeTableRows
      .filter(filtered => filtered.stationShortCode === this.data.search && filtered.type === type));
    }

  /**
   * Get all stations with passenger traffic
   */
  getStations(): void {
      this.data.getStations()
        .subscribe((stations) => {
          this.stations = stations.filter(station => station.passengerTraffic === true);
          this.options = this.stations.map(station => station.stationName);
          // console.log(this.stations);
        });
  }
  /**
   * Autocomplete filter
   * @param value string
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit() {
    const stationName = this.stations.filter(station => station.stationName === this.userInput.value);
    this.data.setStation(stationName[0]['stationShortCode']);
      this.getTrains('arrival');
  }

    getTrains(typestring: string) {
      let isArriving = true;
      if (typestring === 'departure') { isArriving = false; }
      this.querySubscription = this.apollo.watchQuery<any>({
        query: this.data.getStationsTrainsUsingGET(this.data.search, this.data.trainType, 10)
      })
        .valueChanges
        .subscribe(results => {
          this.loading = results.loading;
          const data = results.data.viewer.getStationsTrainsUsingGET;
          this.test = data.filter(train => train.timeTableRows.find(ttr =>
            ttr.type === typestring.toUpperCase() && ttr.stationShortCode === this.data.search));
          this.time = this.fArr(this.test, isArriving);
          this.test = Object.assign([], this.test, {time: this.time}); // get arrival/departure
          this.test.sort = this.sort; // sorting
          // console.log(this.test);
          // console.log(this.time);
        });
    }

    getDeparting() {
      this.data.setDeparting();
      this.getTrains('departure');
    }
}
