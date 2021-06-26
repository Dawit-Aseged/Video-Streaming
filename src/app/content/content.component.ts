import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '../service/communication.service';
import { Subscription } from 'rxjs';
import { MoviesAndFolders } from "../movies.model";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {

  public currentDirectory = "";
  public moviesAndFolders: MoviesAndFolders = {
    movies: [],
    folders: []
  };
  private moviesSub: Subscription;
  constructor(private commService: CommunicationService) {
    this.moviesSub = this.commService.getMoviesUpdated()
      .subscribe((movies) => {
        this.moviesAndFolders = movies;
      })
    }

    ngOnInit(): void {
    this.commService.getMovies("");
  }

  ngOnDestroy() {
    this.moviesSub.unsubscribe();
  }

  public folderPicked(folder: string) {
    this.commService.getMovies(this.currentDirectory+"/"+folder);
    this.currentDirectory += folder;
  }



}
