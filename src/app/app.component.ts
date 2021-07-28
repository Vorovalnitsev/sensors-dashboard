import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ChartService } from './chart-item/chart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private chartService: ChartService) {}
  title = 'sensors-dashboard';
  charts: number[] = [];
  range = new FormGroup({
    start: new FormControl(new Date(Date.now() - 24 * 3600 * 1000)),
    end: new FormControl(new Date())  
  });
  from: number = 0;
  to: number = 0;
  ngOnInit() {
    this.chartService.getCharts().subscribe(items => this.charts = items);
    this.from = new Date(this.range.controls.start.value).valueOf();
    this.to = new Date(this.range.controls.end.value).valueOf();
    const charts = localStorage.getItem('charts');
    
    if (charts) {
     const items = charts.split(',');
     for (let item of items)
      this.charts.push(parseInt(item));
    }
    
  }
  ngAfterViewInit() {
    if(this.charts.length === 0)
      this.addChart();
  }

  addChart() {
    this.chartService.addChart().subscribe(item => {
      this.chartService.getCharts().subscribe(items => {
        this.charts = items;
        localStorage.setItem('charts', this.charts.join());
      });
    })
  }
  removeChart(id: number){
    this.chartService.removeChart(id).subscribe(item => {
      this.chartService.getCharts().subscribe(items => {
        this.charts = items;
        localStorage.setItem('charts', this.charts.join());
      });
    })
  }

  onChangeDateTo(event: MatDatepickerInputEvent<Date>) {
    const from = new Date(this.range.controls.start.value).valueOf();
    const to = new Date(this.range.controls.end.value).valueOf();
    if (from > 0 && to > 0) {
      this.from = from;
      this.to = to;    
    }
  }
}
