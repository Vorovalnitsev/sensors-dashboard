import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { ISensor } from '../sensor/interface/sensor.interface';
import { SensorsService } from '../sensor/sensors.service';

@Component({
  selector: 'app-chart-item',
  templateUrl: './chart-item.component.html',
  styleUrls: ['./chart-item.component.css']
})
export class ChartItemComponent implements OnInit {

  @Input() chartId = 0;
  @Input() from = 0;
  @Input() to = 0;

  @Output() removeChartEvent = new EventEmitter<number>();
  value: number = 0;
  chart: Chart = new Chart(); 

  availableSensorsId: string[] = [];
  activeSensors: ISensor[] = [];
  constructor(private sensorsService: SensorsService) {
   let chart = new Chart({
      chart: {
        type: 'line',
        width: 550
      },
      title: {
        text: 'Chart'
      },
      credits: {
        enabled: false
      },
      series: [],
      xAxis: {
        type: "datetime",
        title: {
          text: 'Date'        
        },
        labels: {
          formatter: function() {
            return Highcharts.dateFormat('%b/%e/%Y', Number.parseInt(this.value.toString()));
          }
        }
      } 
    });

    this.chart = chart;
  }

  ngOnInit(): void {
    this.chart.ref$.subscribe(chart => 
      chart.update({title: {text: `Chart # ${this.chartId}`}})
    )
    const sensors = localStorage.getItem(this.chartId.toString());
    if (sensors) {
      this.activeSensors = JSON.parse(sensors);
      for ( let sensor of this.activeSensors) {
        this.sensorsService.getSensorValuesById(sensor.id, this.from, this.to).subscribe(item => {
          this.activeSensors[this.activeSensors.findIndex(i => i.id === sensor.id)].values = item.values;
          this.chart.addSeries({
            type: sensor.type,
            name: sensor.id, 
            data: sensor.values,
            color: sensor.color
          }  as Highcharts.SeriesLineOptions,
          true,
          true);
        });
      }
    }
    this.sensorsService.getAvailableSensorsId().subscribe(items => { 
    let isUsed = false;
    for (let id of items){
      isUsed = false;
      for (let sensor of this.activeSensors)
        if (id === sensor.id)
          isUsed = true;
      if (!isUsed)
        this.availableSensorsId.push(id);
      }    
      if(this.activeSensors.length === 0)
        this.addSensor(this.availableSensorsId[Math.floor(Math.random() * this.availableSensorsId.length)]);
    })
  }

  ngOnChanges() {
    this.updateLines();
  }

  updateLines (){
    for ( let sensor of this.activeSensors) {
      this.sensorsService.getSensorValuesById(sensor.id, this.from, this.to).subscribe(item => {
          this.activeSensors[this.activeSensors.findIndex(item => item.id === sensor.id)].values = item.values;
          this.chart.ref$.subscribe(chart => 
            chart.series[this.activeSensors.findIndex(item => item.id === sensor.id)]
            .update({
              data: item.values,     
            } as Highcharts.SeriesLineOptions)
          )
        });
    }
  }

  addSensor(id: string) {
    this.availableSensorsId = this.availableSensorsId.filter(item => item != id );
    this.sensorsService.getSensorValuesById(id, this.from, this.to).subscribe(item => {
      item.color = `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 1.0)`;
      item.type='line';
      this.chart.addSeries({
        type: 'line',
        name: item.id, 
        data: item.values,
        color: item.color
      },
      true,
      true);
      this.activeSensors.push(item);
      this.saveSensorsToLocalStorage();
    })
  }
  changeTypeBar(id: string) {
    const itemIndex = this.activeSensors.findIndex(item => item.id == id);
    if (this.activeSensors[itemIndex].type === 'line')
      this.activeSensors[itemIndex].type = 'bar'
        else
          this.activeSensors[itemIndex].type = 'line';
    const item = this.activeSensors[itemIndex];
  
    this.chart.ref$.subscribe(chart => {
      chart.series[this.activeSensors.findIndex(item => item.id === id)]
      .update({
          type: item.type     
      } as Highcharts.SeriesLineOptions);
      this.saveSensorsToLocalStorage();
    });
  }
  changeSeriesColor(id: string, color: any) {
    const itemIndex = this.activeSensors.findIndex(item => item.id === id);
    this.activeSensors[itemIndex].color = color;
    const item = this.activeSensors[itemIndex];
    
    this.chart.ref$.subscribe(chart => {
      chart.series[this.activeSensors.findIndex(item => item.id === id)]
      .update({
        color: item.color     
      } as Highcharts.SeriesLineOptions);
      this.saveSensorsToLocalStorage();
    })
  }
  
  removeSensor(id: string) {
    this.chart.removeSeries(this.activeSensors.findIndex(item => item.id == id));
    this.availableSensorsId.push(id);
    this.activeSensors = this.activeSensors.filter(item => item.id != id );
    this.saveSensorsToLocalStorage();
  }

  removeChart(id: number) {
    localStorage.removeItem(this.chartId.toString());
    this.removeChartEvent.emit(id);
  } 
  saveSensorsToLocalStorage() {
    const sensors = this.activeSensors.map( item => {
      item.values = [];
      return item;
    })
    if (sensors.length > 0)
      localStorage.setItem(this.chartId.toString(), JSON.stringify(sensors));
  }
}
