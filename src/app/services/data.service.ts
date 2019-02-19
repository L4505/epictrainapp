import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Train } from '../models/train';
import { Station } from '../models/Station';
import { map, catchError } from 'rxjs/operators';
import gql from 'graphql-tag';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private stationsURL = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
  search;
  private arriving = 'arriving_trains';
  private departing = 'departing_trains';
  trainType = this.arriving;

  constructor(private http: HttpClient) { }

  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(this.stationsURL);
  }

  /**
   *
   * @param stationShortCode string, ie. HKI, JY
   * @param mode arriving_trains or departing_trains
   * @param amount int, amount of trains to get
   */
  getStationsTrainsUsingGET (stationShortCode: string, mode: string, amount: number) { return gql`
  {
    viewer {
      getStationsTrainsUsingGET(station: "${stationShortCode}", ${mode}: ${amount}, where:"[*trainCategory=Long-distance]") {
        trainNumber
          trainType
         	timeTableRows {
            trainStopping
            stationShortCode
            scheduledTime
            cancelled
            actualTime
            type
          }
        }
      }
    }
  `;
}

  setStation(input: string): void {
    this.search = input;
    console.log(input);
  }

  setDeparting() {
    if (this.trainType === this.arriving) {
      this.trainType = this.departing;
    } else if (this.trainType === this.departing) {
      this.trainType = this.arriving;
    }
    console.log(this.trainType);
  }
}
