import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { Train } from '../models/train';
import { DataService } from '../services/data.service';
import { Station } from '../models/Station';
import { FormControl, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RequireMatch as RequireMatch } from './requireMatch';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  loading: boolean;
  test; // trains
  time; // train arrival/departure times
  private querySubscription: Subscription;

  stations: Station[];
  userInput = new FormControl('', [Validators.required]);
  // userInput = new FormControl('', [Validators.required, RequireMatch]);
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
    const stationName = this.stations.filter(
      s => s.stationName.toLowerCase() === this.userInput.value || s.stationName === this.userInput.value );
    if (!Array.isArray(stationName) || !stationName.length) {
      console.log('userinput not valid');
    } else {
      this.data.setStation(stationName[0]['stationShortCode']);
      this.getTrains('arrival');
    }


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
          this.test = results.data.viewer.getStationsTrainsUsingGET
            .filter(train => train.timeTableRows.find(ttr =>
              ttr.type === typestring.toUpperCase() && ttr.stationShortCode === this.data.search));

          this.time = this.fArr(this.test, isArriving);
          this.test = Object.assign([], this.test, {time: this.time}); // get arrival/departure time

          // this.test = this.getStationNames(this.stations, this.test);
          // console.log(this.loading);
          // console.log(this.test);
          // console.log(this.time);
        });
  }

  getStationNames = (station: Station[], train: Train[]) => {
    for (let index = 0; index < station.length; index++) {
      const el = station[index];
      if (el.stationUICCode === train[0].timeTableRows[0].stationUICCode) {
         train[0].timeTableRows[0].stationShortCode = el.stationName;
      }
    }
  }

  resetSearch() {
    this.test = undefined;
    this.userInput.setValue('');
  }

  isLate() {
    for (let i = 0; i < this.test.time[i][0].differenceInMinutes.length; i++) {
      let el = this.test.time[i][0].differenceInMinutes[i];
      if (el > 0) {
        el = `${el} min myöhässä`;
        console.log(el);
      } else { el = ''; }
    }
  }

  isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
    }
    return true;
  }


} // endof class
