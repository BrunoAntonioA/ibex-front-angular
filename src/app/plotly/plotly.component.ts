import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Plotly } from '../../../node_modules/plotly.js/dist/plotly.min.js';
import * as _ from 'lodash';

import { interval, timer } from 'rxjs';

import { ApisolverService } from '../shared/apisolver/apisolver.service';

import { Instruccion } from '../shared/apisolver/instruccion.model';

declare var Plotly: any;

@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.css']
})
export class PlotlyComponent implements OnInit {

  @ViewChild('chart') el : ElementRef;

  constructor(private apisolverService: ApisolverService) { }

  ngOnInit(): void {
    console.log("afterinit");
    setTimeout(() => {
      this.basicChart()
    }, 1000);
  }

  basicChart(){
    const element = this.el.nativeElement;
    const data = [{
      x: [1, 2, 3, 4],
      y: [1, 2, 3, 4]
    }]
    const style = {
      margin: { t: 0},
      colors : {
        line: 234152
      }
    }
    Plotly.plot( element, data, style)
  }

  async changeData(){
   let points = await this.getData()
    console.log('points: ', points)
    const element = this.el.nativeElement;

    await console.log('points.x :', points.x)
    await console.log('points.y :', points.y)
    
    await Plotly.extendTraces(element, {
      x: points.x,
      y:  points.y
    }, [0]);
  }

  async getData(){
    let x = []
    let y = []

    let instruction = new Instruccion;
    instruction.instruc = "glw";
    instruction.param = "";
    instruction.port = 8000;
    
    await this.apisolverService.postInstruction(instruction).subscribe((res: any) =>{
        console.log("glw:", res.array)

        res.array.forEach(vector => {
          if ( vector.x != null && vector.y != null){
            x.push(vector.x)
            y.push(vector.y)
          }
        });
        
    });
      
    return {"x" : x, "y" : y}
  }
      
}
