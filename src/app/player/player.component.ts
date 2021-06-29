import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { CommunicationService } from '../service/communication.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';



@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  public moviePath = "";
  constructor(private router: Router, private commService: CommunicationService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    var routeArr = this.router.url.split("/");
    routeArr.splice(0, 2);

    this.moviePath = "http://192.168.1.5:8000/video/" + routeArr.join("/");
  }

}
