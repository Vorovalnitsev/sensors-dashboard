import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartItemComponent } from './chart-item.component';
import { ChartModule } from 'angular-highcharts';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select'
import { ChartService } from './chart.service';
import { ColorPickerModule } from 'ngx-color-picker';


@NgModule({
  declarations: [
    ChartItemComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    MatIconModule,
    MatSelectModule,
    ColorPickerModule
  ],
  exports: [ChartItemComponent],
  providers: [ChartService]
})
export class ChartItemModule { }
