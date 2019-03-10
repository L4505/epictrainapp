import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { Train } from '../models/train';
import { Sort } from '@angular/material/sort';
import { DataService } from '../services/data.service';
import { of } from 'rxjs';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnChanges {

  @Input() trainData;
  trains: Train[];
  sortedData: Train[];
  displayedColumns: string[] = ['Juna', 'Lähtöasema', 'Pääteasema', 'Saapumisaika'];
  displayedColumnsDeparting: string[] = ['Juna', 'Lähtöasema', 'Pääteasema', 'Lähtöaika'];
  private tabChange: boolean;

  constructor(private data: DataService, private search: SearchComponent) { }

  tabClick(tab) {
    if (tab.index === 0) {
      this.data.setDeparting();
      this.search.getTrains('arrival');
    } else {
      this.data.setDeparting();
      this.search.getTrains('departure');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
      this.trains = changes.trainData.currentValue;




    // this.sortedData = changes.trainData.currentValue;
    /*
   if (this.trainData) {
       this.trains  = this.trainData;
       //console.log(this.trains);
       this.sortedData = this.trains.slice();
    } else { console.log('tyhjää täynnä'); }

    let source = from(this.trainData);

    const trains = {
      next: x => this.trains = x,
      error: err => console.error('Error ' + err),
      complete: () => console.log('complete!'),
    };
    //source.subscribe(trains);
    */

  }
 /*
  sortData(sort: Sort) {
    const data = this.trains.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'train': return compare(a.trainNumber, b.trainNumber, isAsc);
        case 'departureStation': return compare(a.timeTableRows[0].stationShortCode, b.timeTableRows[0].stationShortCode, isAsc);
        case 'arrivalStation': return compare(a.timeTableRows[a.timeTableRows.length - 1].stationShortCode,
           b.timeTableRows[b.timeTableRows.length - 1].stationShortCode, isAsc);
        //case 'time': return compare(a.time[0].scheduledTime, b.time[0].scheduledTime, isAsc);
        default: return 0;
      }
    });
  } */
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
