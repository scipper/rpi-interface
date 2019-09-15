import {Get, JsonController} from "routing-controllers";

@JsonController()
export class HomeController {

  @Get("/")
  getWelcomeMessage() {
    return "Welcome Ya'll!!!!111";
  }

}
