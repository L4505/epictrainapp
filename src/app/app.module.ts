import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { GraphQLModule } from './graphql.module';
import { SearchComponent } from './search/search.component';
import { NavComponent } from './nav/nav.component';
import { AboutComponent } from './about/about.component';
import { ResultTableComponent } from './result-table/result-table.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    NavComponent,
    AboutComponent,
    ResultTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    [BrowserAnimationsModule],
    CustomMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GraphQLModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
