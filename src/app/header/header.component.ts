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
      })
  }

  ngOnInit(): void {
    this.commService.getMovies("/movies/");
  }

  ngOnDestroy() {
    this.moviesSub.unsubscribe();
  }


}
