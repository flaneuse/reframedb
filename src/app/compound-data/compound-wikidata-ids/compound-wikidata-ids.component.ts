import { Component, OnInit, Input } from '@angular/core';

import { CompoundService } from '../../_services/index';
import { WikiData } from '../../_models/index';

@Component({
  selector: 'app-compound-wikidata-ids',
  templateUrl: './compound-wikidata-ids.component.html',
  styleUrls: ['./compound-wikidata-ids.component.scss']
})

export class CompoundWikidataIdsComponent implements OnInit {
  public qid: string;
  public chemData: WikiData[] = [];
  public idData: WikiData[] = [];
  public formula: string;
  public smiles: string;
  public chirality: string;
  public ikey: string;

  constructor(private cmpdSvc: CompoundService) {
    this.cmpdSvc.idStates.subscribe((ids: Object) => {
      this.qid = ids['qid'];
      this.ikey = ids['id'];
    })

    this.cmpdSvc.smilesSubject.subscribe((smiles: string) => {
      this.smiles = smiles;
    });

    this.cmpdSvc.chiralityState.subscribe((chirality: string) => {
      // console.log(smiles)
      this.chirality = chirality;
    });

    this.cmpdSvc.wikiIDsState.subscribe((ids: Object) => {
      this.chemData = ids['chem'].filter((d: Object) => d['property'] !== 'chemical formula');
      this.idData = ids['ids'];
      this.formula = ids['chem'].filter((d: Object) => d['property'] === 'chemical formula').map((d: Object) => d['values'])[0];
  })
  }

  ngOnInit() {
  }

}
