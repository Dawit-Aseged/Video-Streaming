import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { CommunicationService } from '../service/communication.service';
import {DomSanitizer, SafeHtml, SafeResourceUrl} from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout'
import { Observable } from 'rxjs';



@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  public moviePath!: SafeResourceUrl;
  public movieTitle = "";
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  constructor(private router: Router, private commService: CommunicationService, private sanitizer: DomSanitizer, private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    var routeArr = this.router.url.split("/");
    routeArr.splice(0, 2);
    this.movieTitle =decodeURIComponent(routeArr[routeArr.length - 1]);
    this.moviePath = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.1.5:8000/video/" + routeArr.join("/"));

  }

}
