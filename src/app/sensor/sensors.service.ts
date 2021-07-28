import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ISensor } from './interface/sensor.interface';

@Injectable({
  providedIn: 'root'
})
export class SensorsService {
  COUNT_OF_VALUES: number = 20;
  sensors: Array<ISensor> = [
    {
      id: 'Humidity inside',
      values: []
    },
    {
      id: 'Temperature inside',
      values: []
    },
    {
      id: 'Light inside',
      values: []
    },
    {
      id: 'Humidity outside',
      values: []
    },
    {
      id: 'Temperature outside',
      values: []
    },
    {
      id: 'Light outside',
      values: []
    },
  ]
  constructor() {}

  getAvailableSensorsId(): Observable<string[]> {
    return of(this.sensors.map(item => item.id));
  }

  getSensorValuesById(id: string, from: number, to: number): Observable<ISensor> {
    let sensor = this.sensors.find(item => item.id === id);
    if (sensor) {

      const step = Math.floor((to - from)/this.COUNT_OF_VALUES);
      if(
        sensor.values.length === this.COUNT_OF_VALUES
        && sensor.values[0][0] === from 
        && to - sensor.values[this.COUNT_OF_VALUES - 1][0] <= step
        )
        return of(sensor)
        else {
          sensor.values = [];
          for(let i = 0; i < this.COUNT_OF_VALUES; i++)
            sensor.values.push([from + step * i , Math.floor(Math.random() * 100)])
          return of(sensor)
        }  
    }
    return of()
  }
}
