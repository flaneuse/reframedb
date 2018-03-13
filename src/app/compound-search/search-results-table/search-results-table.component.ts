import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource, MatSort, MatChipsModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {SearchResult, SearchResultService} from "../compound-search.component";
import {Router} from "@angular/router";

export interface Compound {
  qid: string;
  ikey: string;
  name: string;
  chemspider: string;
  pubchem: string;
}

@Component({
  selector: 'app-search-results-table',
  templateUrl: './search-results-table.component.html',
  styleUrls: ['./search-results-table.component.css']
})
export class SearchResultsTableComponent implements OnInit {
  @Input() result; //that is currently redundant, but could replace the entire search result service Observable

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  sdata: SearchResult;

  assayColumns = ["Crypto-HCT-8 Host Cells (Wild C. parvum)",
    "Tuberculosis tyrosyl-tRNA synthetase inhibitor",
    "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)",
    "P. falciparum (Dd2) viability",
    "Zika cytopathic effect inhibition in Vero E6 cells"];

  displayedColumns = ['name', 'alias'].concat(this.assayColumns);
  // // , 'assay0', 'assay1', 'assay2', 'assay3', 'assay4'];
  // displayedColumns = ['name', 'ikey', 'pubchem', 'chemspider', 'qid'];
  dataSource = new MatTableDataSource<Compound>();

  constructor(
    private searchResultService: SearchResultService,
    private el: ElementRef,
    private router: Router,
    ) {
    this.searchResultService.newSearchResult$.subscribe(
      result => {
        this.sdata = result;
        console.log('RAW JSON')
        console.log(result);
        this.dataSource.data = this.prepareViewData(this.sdata.data);
      });
  }

  ngOnInit() {
    // in conjunction with the result input, this would work as a data provider for th table at component initialization
    // this.dataSource.data = this.prepareViewData(this.result.data);
  }

  rowClicked(event, qid){
    this.router.navigate([`compound_data/${qid.split('/').pop()}`]);
  }


  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log(this.dataSource.sort)
    this.dataSource.paginator = this.paginator;
  }

  prepareViewData(raw_json: Object): any {
    let compounds: Array<Compound> = [];

    if (raw_json) {
      for (let x of raw_json['results']['bindings']) {
        // console.log('RAW JSON')
        // console.log(x);

        compounds.push({
          'qid': x['c']['value'],
          'ikey': x['ikey']['value'],
          'name': x['cLabel']['value'],
          'chemspider': x['csid'] ? x['csid']['value'] : " ",
          'pubchem': x['cid'] ? x['cid']['value'] : " ",
        });
      }
    }

  //   let test = [{'name':'RU84687', 'alias': ["N-acetyl-N-[1-(1,1'-biphenyl-4-ylmethyl)-2-oxoazepan-3-yl]-3-formyl-O-phosphonotyrosinamide"],  'assays': [{"name":"Crypto-HCT-8 Host Cells (Wild C. parvum)", "value": 0}, {"name": "Tuberculosis tyrosyl-tRNA synthetase inhibitor", "value": 1}, {"name": "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)", "value": 0}, {"name": "P. falciparum (Dd2) viability", "value": 0}, {"name": "Zika cytopathic effect inhibition in Vero E6 cells", "value": 1}]},
  //   {'name':'Canthaxanthin', 'alias': [],                                                                                                     'assays': [{"name":"Crypto-HCT-8 Host Cells (Wild C. parvum)", "value": 0}, {"name": "Tuberculosis tyrosyl-tRNA synthetase inhibitor", "value": 0}, {"name": "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)", "value": 1}, {"name": "P. falciparum (Dd2) viability", "value": 1}, {"name": "Zika cytopathic effect inhibition in Vero E6 cells", "value": 1}]},
  //   {'name':'ritanserin tartrate', 'alias': "N-acetyl-N-[1-(1,1'-biphenyl-4-ylmethyl)-2-oxoazepan-3-yl]-3-formyl-O-phosphonotyrosinamide",                'assays': [{"name":"Crypto-HCT-8 Host Cells (Wild C. parvum)", "value": 0}, {"name": "Tuberculosis tyrosyl-tRNA synthetase inhibitor", "value": 0}, {"name": "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)", "value": 0}, {"name": "P. falciparum (Dd2) viability", "value": 0}, {"name": "Zika cytopathic effect inhibition in Vero E6 cells", "value": 0}]},
  //   {'name':'nandrolone cypionate', 'alias': ["19-Nortestosterone cyclopentylpropionate"],                                                    'assays': [{"name":"Crypto-HCT-8 Host Cells (Wild C. parvum)", "value": 0}, {"name": "Tuberculosis tyrosyl-tRNA synthetase inhibitor", "value": 1}, {"name": "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)", "value": 0}, {"name": "P. falciparum (Dd2) viability", "value": 0}, {"name": "Zika cytopathic effect inhibition in Vero E6 cells", "value": 1}]},
  //   {'name':'imatinib', 'alias': ["CGP 57148", "Gleevec®", "Glivec®", "STI571"],                                                              'assays': [{"name":"Crypto-HCT-8 Host Cells (Wild C. parvum)", "value": 1}, {"name": "Tuberculosis tyrosyl-tRNA synthetase inhibitor", "value": 0}, {"name": "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)", "value": 0}, {"name": "P. falciparum (Dd2) viability", "value": 0}, {"name": "Zika cytopathic effect inhibition in Vero E6 cells", "value": 1}]},
  //   {'name':'tazobactam', 'alias': ["CL-298741", "Tazobactam", "YTR-830H"],                                                                   'assays': [{"name":"Crypto-HCT-8 Host Cells (Wild C. parvum)", "value": 0}, {"name": "Tuberculosis tyrosyl-tRNA synthetase inhibitor", "value": 1}, {"name": "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)", "value": 0}, {"name": "P. falciparum (Dd2) viability", "value": 1}, {"name": "Zika cytopathic effect inhibition in Vero E6 cells", "value": 1}]}
  // ]



  let test = [{'name':'RU84687', 'alias': ["N-acetyl-N-[1-(1,1'-biphenyl-4-ylmethyl)-2-oxoazepan-3-yl]-3-formyl-O-phosphonotyrosinamide"],
  "Crypto-HCT-8 Host Cells (Wild C. parvum)": "false_",
  "Tuberculosis tyrosyl-tRNA synthetase inhibitor": "true_",
  "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)": "false_",
  "P. falciparum (Dd2) viability": "false_",
  "Zika cytopathic effect inhibition in Vero E6 cells": "true_"},

  {'name':'Canthaxanthin', 'alias': [],
  "Crypto-HCT-8 Host Cells (Wild C. parvum)": "false_",
  "Tuberculosis tyrosyl-tRNA synthetase inhibitor": "true_",
  "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)": "false_",
  "P. falciparum (Dd2) viability": "false_",
  "Zika cytopathic effect inhibition in Vero E6 cells": "true_"},

  {'name':'ritanserin tartrate', 'alias': "N-acetyl-N-[1-(1,1'-biphenyl-4-ylmethyl)-2-oxoazepan-3-yl]-3-formyl-O-phosphonotyrosinamide",
  "Crypto-HCT-8 Host Cells (Wild C. parvum)": "false_",
  "Tuberculosis tyrosyl-tRNA synthetase inhibitor": "false_",
  "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)": "false_",
  "P. falciparum (Dd2) viability": "true_",
  "Zika cytopathic effect inhibition in Vero E6 cells": "false_"},

  {'name':'nandrolone cypionate', 'alias': ["19-Nortestosterone cyclopentylpropionate"],
  "Crypto-HCT-8 Host Cells (Wild C. parvum)": "true_",
  "Tuberculosis tyrosyl-tRNA synthetase inhibitor": "false_",
  "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)": "true_",
  "P. falciparum (Dd2) viability": "true_",
  "Zika cytopathic effect inhibition in Vero E6 cells": "false_"},

  {'name':'imatinib', 'alias': ["CGP 57148", "Gleevec®", "Glivec®", "STI571"],
  "Crypto-HCT-8 Host Cells (Wild C. parvum)": "false_",
  "Tuberculosis tyrosyl-tRNA synthetase inhibitor": "true_",
  "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)": "false_",
  "P. falciparum (Dd2) viability": "false_",
  "Zika cytopathic effect inhibition in Vero E6 cells": "false_"},

  {'name':'tazobactam', 'alias': ["CL-298741", "Tazobactam", "YTR-830H"],
  "Crypto-HCT-8 Host Cells (Wild C. parvum)": "false_",
  "Tuberculosis tyrosyl-tRNA synthetase inhibitor": "false_",
  "Crypto-C. parvum high-content imaging proliferation (Bunch Grass Farm)": "false_",
  "P. falciparum (Dd2) viability": "false_",
  "Zika cytopathic effect inhibition in Vero E6 cells": "false_"}]

    return test;
  }
}
