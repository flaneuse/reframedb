import {Component, OnInit, forwardRef, Inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Http, Response} from "@angular/http";

import {SearchResult, WDQService} from "../compound-search/compound-search.component"
import { InteractionTableDataService } from "../interaction-table/interaction-table.component"

import { gottlieb, gottlieb_pub } from '../../assets/gottlieb_data';


@Component({
  selector: 'app-compound-data',
  templateUrl: './compound-data.component.html',
  styleUrls: ['./compound-data.component.css'],
})
export class CompoundDataComponent implements OnInit {
  qid: string;
  results: Object;
  data: Object;
  label: string;
  tableData: Array<Object> = [];
  aliases: Array<string> = [];
  concat_aliases: string = '';
  table_data: Array<Object> = [];
  graphData;
  prop_name_map: Object = {};
  propsToDisplay: Array<string> = ['P274', 'P231', 'P662', 'P661', 'P592', 'P715', 'P683', 'P665', 'P233', 'P2017',
    'P234', 'P235', 'P652', 'P595', 'P3636', 'P232', 'P2275', 'P267', 'P2892', 'P3345', 'P486', 'P2115'];

  constructor(
    @Inject(forwardRef(() => WDQService)) public wd: WDQService,
    private route: ActivatedRoute,
    private http: Http,
    private interactionTableDataService: InteractionTableDataService
  ) {
    route.params.subscribe(params => {
      this.qid = params['qid'];
    });
  }

  ngOnInit() {
    this.wd.search(`
      SELECT DISTINCT ?prop ?pLabel WHERE {
        ?p wikibase:directClaim ?prop .
        SERVICE wikibase:label {bd:serviceParam wikibase:language "en" . }
      }
    `).subscribe(
      (results: SearchResult[]) => {
        let dt = results.pop().data;
        for (let x of dt['results']['bindings']) {
          let p: string = x['prop']['value'].split('/').pop();

          this.prop_name_map[p] = x['pLabel']['value'];
        }

        this.buildData();

      },
      (err: any) => {
        console.log(err);

      },
      () => {

      }
    );
  }

  buildData(): void {
    let query: string = `https://query.wikidata.org/sparql?query=describe <http://www.wikidata.org/entity/${this.qid}>&format=json`;

    this.http.request(query)
      .subscribe((res: Response) => {
        this.data = res.json();
        let tmp: Object = {};

        for (let x of this.data['results']['bindings']) {
          if (x['predicate']['value'] === 'http://www.w3.org/2000/01/rdf-schema#label' &&
            x['object'].hasOwnProperty('xml:lang') &&
            x['object']['xml:lang'] === 'en') {
            this.label = x['object']['value'];
          }
          else if (x['predicate']['value'] === 'http://www.w3.org/2004/02/skos/core#altLabel' &&
            x['object'].hasOwnProperty('xml:lang') &&
            x['object']['xml:lang'] === 'en') {

            this.aliases.push(x['object']['value']);
          }
          else if (x['subject']['value'] === `http://www.wikidata.org/entity/${this.qid}` &&
            x['predicate']['value'].startsWith('http://www.wikidata.org/prop/direct/P')) {
            let p: string = x['predicate']['value'].split('/').pop();
            // let v = x['object']['value'].split('/').pop;
            // console.log(p, this.prop_name_map[p] );

            if (tmp.hasOwnProperty(p)) {
              tmp[p].add(x['object']['value']);
            }
            else {
              tmp[p] = new Set([x['object']['value']]);
            }
          }
        }

        for (let y of this.propsToDisplay) {

          if (tmp.hasOwnProperty(y)) {
            let value = Array.from(tmp[y]).length > 1 ? Array.from(tmp[y]).join(', ') : Array.from(tmp[y]);
            this.table_data.push({'property': this.prop_name_map[y], 'value': value});
          }

        }

        if (!tmp.hasOwnProperty('P2175')) {
          this.retrieveLabels([]);
        }
        else {
          this.retrieveLabels(Array.from(tmp['P2175']).map((x: string) => x.split('/').pop()));
        }
        // Concatenate aliases so they can be rendered as one block
        this.concat_aliases = this.aliases.join(', ');

      });
  }

  retrieveLabels(disease_qids: Array<string>): void {
    let tmp_str: string = disease_qids.join(' wd:');
    let query: string = `
    https://query.wikidata.org/sparql?query=SELECT ?qid ?qidLabel WHERE {
    	VALUES ?qid {wd:${tmp_str}}
    	SERVICE wikibase:label { bd:serviceParam wikibase:language "en" .}  
    }&format=json
    `;
    console.log(query);
    this.http.request(query)
      .subscribe((res: Response) => {
        let tt = res.json();
        console.log(tt);

        if (disease_qids.length !== 0) {

          for (let x of tt['results']['bindings']) {
            this.tableData.push({
              'compound_name': this.label,
              'compound_qid': this.qid,
              'disease_name': x['qidLabel']['value'],
              'disease_qid': x['qid']['value'],
              'reference': 'FDA',
              'reference_qid': ''
            })
          }
        }

        for(let x of gottlieb){
          if(x['drug_qid'] === `http://www.wikidata.org/entity/${this.qid}`){
            this.tableData.push({
              'compound_name': this.label,
              'compound_qid': this.qid,
              'disease_name': x['Disease name'],
              'disease_qid': x['disease_qid'],
              'reference': 'PMID:' + gottlieb_pub.pmid,
              'reference_qid': gottlieb_pub.qid
            })
          }
        }
        console.log(this.tableData);

        this.graphData = this.prepareGraphData();
        this.interactionTableDataService.announceNewCompoundData(this.tableData);
      });
  }

  prepareGraphData(): any {
    // console.log(data, 'hoo');
    let nodes = [{data: {id: this.qid, name: this.label, faveColor: '#7a94fc', faveShape: 'rectangle'}}];
    let edges = [];
    let edge_color_pred: string = '#a84435';


    for (let x of this.tableData) {
      nodes.push({
        data: {
          id: x['disease_qid']  ,
          name: x['disease_name'],
          faveColor: '#fc4e2b',
          faveShape: 'ellipse'
        }
      });
      let edge_color = x['reference'].startsWith('PMID') ? edge_color_pred : '#06a809';
      edges.push({data: {source: this.qid, target: x['disease_qid'], faveColor: edge_color}})
    }

    return {nodes, edges};
  }
}
