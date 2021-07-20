import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'mpost', pathMatch: 'full'}, 
  { path: 'mpost', loadChildren: ()=>import('./post/post.module').then(m=>m.PostModule) },
  { path: '**', redirectTo: 'mpost' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
