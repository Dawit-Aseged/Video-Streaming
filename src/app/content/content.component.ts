import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '../service/communication.service';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout'


import { MoviesAndFolders } from "../movies.model";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {

  public currentDirectory = "";
  public previousDirectory = "";
  public moviesAndFolders: MoviesAndFolders = {
    movies: [],
    folders: []
  };

  private moviesSub: Subscription;

  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  constructor(private commService: CommunicationService, private router: Router, private breakpointObserver: BreakpointObserver) {
    this.moviesSub = this.commService.getMoviesUpdated()
      .subscribe((movies) => {
        this.moviesAndFolders = movies;
      }) // Subscribes to changes in the movie directory

    // This router event fires when the route of the page is changed. It is changed when the user clicks on a folder
    router.events.pipe().subscribe((routeInfo) => {
      if (routeInfo instanceof NavigationEnd) {
        var firstPart = decodeURIComponent(routeInfo.url).split("/").splice(1,1)[0]; // To ensure that the bottom if statement is executed only if the route starts with '/movies'
        if (routeInfo.url != "/" && firstPart == "movies") {
          this.currentDirectory = decodeURIComponent(routeInfo.url); // Gets the current directory from the url
          this.previousDirectory = this.commService.getPreviousDirectory(this.currentDirectory); // Gets the previous directory from the current directory
          this.commService.getMovies(this.currentDirectory + "/"); // Fetches a list of movies
        }
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.moviesSub.unsubscribe();
  }

  // When a folder is clicked then, this event fires
  public folderPicked(folder: string) {
    const newDir = this.currentDirectory + "/" + folder; // New Directory
    this.commService.getMovies(newDir); // Gets the new movies
    this.router.navigate([newDir]); // The router navigates to the new directory

    this.commService.getCurrentDirectory();
  }

  public moviePicked(movie: string) {
    const movieDir = this.currentDirectory + "/" + movie;
    this.router.navigate(['/player'+ movieDir])
  }

  public getArrayLength(array: any[]) {
      return array.length;
  }
}
