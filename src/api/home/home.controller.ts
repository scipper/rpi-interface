import {Get, JsonController} from "routing-controllers";

@JsonController()
export class HomeController {

  @Get("/")
  getWelcomeMessage() {
    return "Raspberry Pi interface";
  }

}
