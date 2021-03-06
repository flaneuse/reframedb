import { Component, Inject, Injectable, OnInit, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subscription } from 'rxjs/subscription';

import { CompoundSearchComponent } from '../compound-search/compound-search.component'
import { CompoundDataComponent } from "../compound-data/compound-data.component";
import { AboutComponent } from "../about/about.component";
import { AssaysComponent } from "../assays/assays.component";
import { AssayDataComponent } from "../assay-data/assay-data.component";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { isDefined } from "@angular/compiler/src/util";
import { environment } from "../../environments/environment";
import { LoginStateService } from '../_services/index';
import { LoginState, RouteDef } from '../_models/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  routeDef: RouteDef[];
  loginBox: boolean = false;
  loggedIn: boolean = false;
  expanded: boolean = false;
  isMobile: boolean;
  current_year: number;
  private loginSubscription: Subscription;

  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient, private loginStateService: LoginStateService) {
    this.checkMobile();
  }

  ngOnInit(): void {
    // subscribe to the login state
    this.loginSubscription = this.loginStateService.loginState
      .subscribe((state: LoginState) => {
        this.loggedIn = state.loggedIn;
      });
  }

  showLogin() {
    this.loginBox = !this.loginBox;
  }

  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  toggleNav() {
    this.expanded = !this.expanded;
    if (!this.expanded) {
      this.loginBox = false;
    }
  }

  collapseNav() {
    this.expanded = false;
  }

  checkMobile() {
    if (window.matchMedia('(max-width: 760px)').matches) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  @HostListener('document:click', ['$event']) clickedOutside($event){
    if (this.loginBox)
      this.loginBox = false;
  }
}
