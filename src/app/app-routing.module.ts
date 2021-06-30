import { HomeComponent } from './home/home.component';
import { PlayerComponent } from './player/player.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContentComponent } from './content/content.component';
const routes: Routes = [
  {
    path: 'movies', children: [
      {
        path: "**",
        component: ContentComponent
      }
    ]
  },
  { path: '', component: HomeComponent },
  {
    path: 'player', children: [{
      path: "**",
      component: PlayerComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
