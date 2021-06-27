import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MoviesAndFolders, MoviesAndFoldersJSON } from '../movies.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private moviesAndFolders = new Subject<MoviesAndFolders>();
  constructor(private httpClient: HttpClient) { }

  public getMovies(url: string) {
    this.httpClient
      .get<MoviesAndFoldersJSON>(`http://localhost:8000${url}`)
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
}
