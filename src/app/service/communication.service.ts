import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MoviesAndFolders, MoviesAndFoldersJSON } from '../movies.model';
import { map } from "rxjs/operators";
import { Router, NavigationEnd } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private moviesAndFolders = new Subject<MoviesAndFolders>();
  constructor(private httpClient: HttpClient, private router: Router) { }

  public getMovies(url: string) {
    this.httpClient
      .get<MoviesAndFoldersJSON>(`http://192.168.1.5:8000${url}`)
      .subscribe((information) => {
        var info = {
          movies: JSON.parse(information.movies),
          folders: JSON.parse(information.folders)
        }
        // information.movies.map((movie) => JSON.parse(movie));
        // information.folders.map((folder) => JSON.parse(folder));
        this.moviesAndFolders.next(info);
      })
  }

  public getMoviesUpdated() {
    return this.moviesAndFolders.asObservable();
  }

  public getCurrentDirectory() {
    return decodeURIComponent(this.router.url);
  }

  // The following function gets the previous directory of the path it is given
  public getPreviousDirectory(currentDir: string) {
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
}
