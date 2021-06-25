import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '../service/communication.service';
import { Subscription } from 'rxjs';
import { MoviesAndFolders } from "../movies.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private moviesAndFolders!: MoviesAndFolders;
  private moviesSub: Subscription;
  constructor(private commService: CommunicationService) {
    this.moviesSub = this.commService.getMoviesUpdated()
      .subscribe((movies) => {
        this.moviesAndFolders = movies;
        console.log(this.moviesAndFolders);
      })
  }

  ngOnInit(): void {
    this.commService.getMovies();
  }

  ngOnDestroy() {
    this.moviesSub.unsubscribe();
  }


}
