import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '../service/communication.service';
import { Subscription } from 'rxjs';
import { MoviesAndFolders } from "../movies.model";
import { Router, NavigationEnd, RouterLink} from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {


  public backButtonVisible = true;
  constructor(private commService: CommunicationService, private router: Router) {
    router.events.pipe().subscribe((routeInfo) => {
      if (routeInfo instanceof NavigationEnd) {
          if(routeInfo.urlAfterRedirects == "/")
            this.backButtonVisible = false;
          else
            this.backButtonVisible = true;
        }
      }
    );
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
  }

  backClicked() {

    console.log(this.backButtonVisible)
    var prevRoute = this.commService.getPreviousDirectory(this.commService.getCurrentDirectory());

    if(prevRoute.split("/")[1] != "movies"){
      // This is to handle if the back button is pressed inside the player component
      var routeArr = prevRoute.split("/");
      routeArr.splice(0, 2);
      prevRoute = "/" + routeArr.join("/")
    }
    this.router.navigate([prevRoute])
  }

}
