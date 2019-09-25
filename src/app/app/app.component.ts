import {Component, OnInit} from "@angular/core";
import {HomeService} from "../../api-interface/services/home.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  welcomeMessage: string;

  constructor(protected homeService: HomeService) {
    this.welcomeMessage = "";
  }

  /**
   *
   */
  ngOnInit(): void {
    this.homeService.homeControllerGetWelcomeMessage()
      .subscribe((response: string) => {
        this.welcomeMessage = response;
      })
  }

}
