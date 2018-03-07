import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as d3Chromatic from 'd3-scale-chromatic';

@Component({
  selector: 'app-assay-curves',
  templateUrl: './assay-curves.component.html',
  styleUrls: ['./assay-curves.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssayCurvesComponent implements OnInit {

  private x: any;
  private y: any;
  private width: number;
  private height: number;

  private xAxis: any;
  private yAxis: any;
  private colorScale: any;
  private margin: any = { top: 50, bottom: 20, left: 30, right: 20, colorbar: 20, xaxis: 15, pages: 40 };

  private chart: any;

  constructor() { }

  ngOnInit() {
    this.chartSetup(300, 200);

    this.chartSetup(500, 400);
  }

  chartSetup(base_width, base_height) {
    // this.width = base_width - this.margin.left - this.margin.right;
    // this.height = base_height - this.margin.top - this.margin.bottom;
    // let assay_data = [{
    //   'x': 1e-5,
    //   'y': 0.03
    // },
    // {
    //   'x': 1e-4,
    //   'y': 0.05
    // },
    // {
    //   'x': 1e-3,
    //   'y': 0.1
    // },
    // {
    //   'x': 1e-2,
    //   'y': 0.5
    // },
    // {
    //   'x': 1e-1,
    //   'y': 0.7
    // },
    // {
    //   'x': 1e0,
    //   'y': 0.90
    // },
    // {
    //   'x': 1e1,
    //   'y': 0.92
    // },
    // {
    //   'x': 1e2,
    //   'y': 0.95
    // },
    // {
    //   'x': 1e3,
    //   'y': 0.96
    // }]
    //
    // let fitted_data = [{ 'ic50': 1e-2 }];
    //
    // let fittedfunc = function(x) {
    //   let A = 1
    //   let B = 1
    //   let C = 1e-2
    //   let D = 0
    //
    //   // return(A - D) / (1 + 10^((Math.log10(x) - Math.log10(C))*B))
    //   //
    //   return x * (1 + Math.random() / 10)
    //
    // }
    //
    // this.x = d3.scaleLog()
    //   .rangeRound([0, this.width])
    //   .domain([1e-5, 1e3]);
    //
    // this.y = d3.scaleLinear()
    //   .rangeRound([this.height, 0])
    //   .domain([0, 1]);
    //
    //
    // this.xAxis = d3.axisBottom(this.x)
    //   .ticks(6, '.0e')
    //   .tickSize(-this.height);
    //
    // this.yAxis = d3.axisLeft(this.y)
    // .tickSize(-this.width)
    // .tickFormat(d3.format(".0%"));
    //
    // this.colorScale = d3
    //   .scaleSequential(d3Chromatic.interpolateGnBu)
    //   .domain([Math.log10(1e-5), Math.log10(1e-1)]);
    //
    // var valueline = d3.line()
    //   .x(d => this.x(d.x))
    //   .y(d => this.y(fittedfunc(d.y)));
    //
    //
    // var svg = d3.select("#assay-curve").append("svg")
    //   .attr("width", this.width + this.margin.left + this.margin.right)
    //   .attr("height", this.height + this.margin.top + this.margin.bottom)
    //
    // svg.append('g')
    //   .attr('class', 'axis axis--x')
    //   .classed('axis-off', this.height <= 200)
    //   .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
    //   .call(this.xAxis);
    //
    // svg.append('g')
    //   .attr('class', 'axis axis--y')
    //   .classed('axis-off', this.height <= 200)
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    //   .call(this.yAxis);
    //
    //   this.chart = svg.append("g")
    //     .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    //
    // this.chart.append('rect')
    //   .attr('class', 'rect-limits')
    //   .classed('axis-off', this.height > 200)
    //   .attr('x', this.x(0))
    //   .attr('y', this.y(1))
    //   .attr('width', this.width)
    //   .attr('height', this.height)
    //
    // this.chart.append("path")
    //   .attr("class", "fitted-curve")
    //   .attr("d", valueline(assay_data))
    //   .attr("stroke-dasharray", "6,6");
    //
    //
    // this.chart.selectAll('line')
    //   .data(fitted_data)
    //   .enter().append('line')
    //   .attr('class', 'ic50')
    //   .attr('x1', d => this.x(d.ic50))
    //   .attr('x2', d => this.x(d.ic50))
    //   .attr('y1', this.y(0))
    //   .attr('y2', this.y(1))
    //   .attr('stroke', d => this.colorScale(Math.log10(d.ic50)))
    //
    // this.chart.selectAll('circle')
    //   .data(assay_data)
    //   .enter().append("circle")
    //   .attr('class', 'expt-data')
    //   .attr("cy", d => this.y(d.y))
    //   .attr("cx", d => this.x(d.x))
    //   .attr("r", 4);
    //
    //
    //
    // this.chart.selectAll('text')
    //   .data(fitted_data)
    //   .enter().append('text')
    //   .attr('class', 'annotation')
    //   .attr('x', d => this.x(d.ic50) + 10)
    //   .attr('y', this.y(0.5))
    //   .text(d => "EC50: " + d.ic50);
  }
}
