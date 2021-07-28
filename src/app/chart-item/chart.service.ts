import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private charts: number[] = []
  constructor(
  ) { }
  addChart(): Observable<number> {
    if (this.charts.length < 4) {
      const lastId = this.charts.length == 0? 0: Math.max(...this.charts);
      const item = lastId + 1
      this.charts.push(item); 
      return of(item); 
    }
    return of();
  }

  getCharts(): Observable<Array<number>> {
    return of(this.charts);
  }

  removeChart(id: number): Observable<number> {
    this.charts = this.charts.filter(item => item != id)
    return of(id);
  }
}
