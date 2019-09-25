import {HttpClientModule} from "@angular/common/http";
import {ApplicationRef, DoBootstrap, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ApiModule} from "../../api-interface/api.module";
import {AppComponent} from "./app.component";

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ApiModule.forRoot({rootUrl: ""})
  ],
  declarations: [
    AppComponent
  ],
  entryComponents: [
    AppComponent
  ]
})
export class AppModule implements DoBootstrap {

  /**
   *
   * @param appRef
   */
  ngDoBootstrap(appRef: ApplicationRef): void {
    appRef.bootstrap(AppComponent);
  }

}
