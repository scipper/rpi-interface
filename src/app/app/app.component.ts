import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  welcomeMessage: string;

  constructor(protected httpClient: HttpClient) {
    this.welcomeMessage = "";
  }

  /**
   *
   */
  ngOnInit(): void {
    this.httpClient.get<string>("api/")
      .subscribe((response) => {
        this.welcomeMessage = response;
      })
  }

}
