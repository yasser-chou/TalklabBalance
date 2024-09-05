import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private chartUpdateSource = new Subject<void>();

  // Observable stream for triggering chart updates
  chartUpdate$ = this.chartUpdateSource.asObservable();

  // Method to trigger chart update
  triggerChartUpdate() {
    this.chartUpdateSource.next();
  }
}
