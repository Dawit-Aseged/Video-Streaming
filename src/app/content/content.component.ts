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

  public currentDirectory = "";
  public previousDirectory = "";
  public moviesAndFolders: MoviesAndFolders = {
    movies: [],
    folders: []
  };

  private moviesSub: Subscription;

  constructor(private commService: CommunicationService, private router: Router) {
    this.moviesSub = this.commService.getMoviesUpdated()
      .subscribe((movies) => {
        this.moviesAndFolders = movies;
      }) // Subscribes to changes in the movie directory

    // This router event fires when the route of the page is changed. It is changed when the user clicks on a folder
    router.events.pipe().subscribe((routeInfo) => {
      if (routeInfo instanceof NavigationEnd) {
        if (routeInfo.url != "/") {
          this.currentDirectory = decodeURIComponent(routeInfo.url); // Gets the current directory from the url
          this.previousDirectory = this.getPreviousDirectory(this.currentDirectory); // Gets the previous directory from the current directory
          this.commService.getMovies(this.currentDirectory + "/"); // Fetches a list of movies
        }
      }
    });
  }

  // The following function gets the previous directory of the path it is given
  getPreviousDirectory(currentDir: string) {
    /**
     * If the current directory is '/movies' (soon '/series', '/tutorials' and '/documentaries' will be added)
     * then it returns that directory
     */
    if (currentDir == "/movies")
      return currentDir;
    // Splits the directory based on the separator
    // TODO - The separator is not platform-specific. Change it to work on any platform (linux or mac)
    var arrayOfDirs = currentDir.split("/");

    /**
     * If the last element of hte array is an empty string (this happens if the parameter passed
     * has an extra '/' at the end), then it is popped until there is none left
     */
    if (arrayOfDirs[arrayOfDirs.length - 1] == "")
      arrayOfDirs.pop();

    // This pops the current directory, and the rest point to the last directory
    arrayOfDirs.pop();

    //Joins the array of directories to make it a path
    // TODO - This is also not platform-specific
    return arrayOfDirs.join("/");
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
  }



}
