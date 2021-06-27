import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '../service/communication.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

import { MoviesAndFolders } from "../movies.model";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {

  public currentDirectory = "/movies";
  public moviesAndFolders: MoviesAndFolders = {
    movies: [],
    folders: []
  };
  private moviesSub: Subscription;
  constructor(private commService: CommunicationService, private router: Router) {
    this.moviesSub = this.commService.getMoviesUpdated()
      .subscribe((movies) => {
        this.moviesAndFolders = movies;
      })

    router.events.pipe().subscribe((routeInfo) => {
      if (routeInfo instanceof NavigationEnd) {
        if(routeInfo.url != "/"){
          console.log(decodeURIComponent(routeInfo.url))
          this.currentDirectory = decodeURIComponent(routeInfo.url)
          this.commService.getMovies(this.currentDirectory + "/");
        }
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.currentDirectory = this.router.url + "/";
      this.commService.getMovies(this.currentDirectory);
    }, 0);
  }

  ngOnDestroy() {
    this.moviesSub.unsubscribe();
  }

  public folderPicked(folder: string) {
    const newDir = this.currentDirectory +"/"+ folder ;
    this.commService.getMovies(newDir);
    this.currentDirectory = newDir;

    this.router.navigate([newDir]);
   // console.log(newDir)
  }



}
