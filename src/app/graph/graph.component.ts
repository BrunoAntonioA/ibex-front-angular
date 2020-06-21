import { Component, OnInit, ViewChild } from '@angular/core';
import { dataSeries } from "./data-series";
import { interval, timer } from 'rxjs';

import { ApisolverService } from '../shared/apisolver/apisolver.service';

import { Instruccion } from '../shared/apisolver/instruccion.model';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit{
  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;

  constructor(private apisolverService: ApisolverService) {
    this.initChartData();
  }

  ngOnInit(){
    
    const contador = interval(4000);
    
    contador.subscribe(() =>{
      var instruccion = new Instruccion();
      instruccion.instruc = "run";
      instruccion.param = "100 0.1";
      instruccion.port = 8000;
      this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
      console.log(res.response);
    });
    });
  
  }

  changeData(){
    let instruction = new Instruccion;
    instruction.instruc = "get";
    instruction.param = "";
    instruction.port = 8000;
    
    this.apisolverService.postInstruction(instruction).subscribe((res: any) =>{
      console.log("res:", res)
    });
    
    var data = [
      {
        x: 1,
        y: 3
      },
      {
        x: 2,
        y: 6
      },
      {
        x: 3,
        y: 9
      }
    ];

    this.series = [
      {
        name: "peeky blanders",
        data: data
      }
    ]

  }
    


  public initChartData(): void {
    let dates = [];
    dataSeries.forEach(element => {
      console.log(element);
      dates.push(element.y)
    });

    this.series = [
      {
        name: "XYZ MOTORS",
        data: dates
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      
      align: "center"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
      },
      title: {
        text: "y"
      }
    };
    this.xaxis = {
      type: "numeric",
      title:{
        text: "x"
      }
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
      }
    };
  }
}
