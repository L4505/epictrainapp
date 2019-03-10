import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultTableComponent } from './result-table/result-table.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'results', component: ResultTableComponent },
  { path: 'about', component: AboutComponent },
  { path: '',   redirectTo: '/search', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
