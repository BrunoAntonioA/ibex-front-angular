import { Component, OnInit } from '@angular/core';

import { ApisolverService } from '../shared/apisolver/apisolver.service';

import { Lines } from '../shared/lines.model';
import { Parameters } from '../shared/parameters.model';



@Component({
  selector: 'app-ibex',
  templateUrl: './ibex.component.html',
  styleUrls: ['./ibex.component.css']
})
export class IbexComponent implements OnInit {

  parameters: Parameters;
  lines: Lines;
  instanciaFlag: Boolean;
  graficoFlag: Boolean;

  constructor(private apiSolverService: ApisolverService) { }

  ngOnInit(): void {

    this.apiSolverService.currentLines.subscribe(lines => this.lines = lines)
    this.apiSolverService.currentParameters.subscribe(parameters => this.parameters = parameters)
  }

}
