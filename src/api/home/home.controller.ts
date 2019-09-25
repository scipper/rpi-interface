import {Get, JsonController} from "routing-controllers";

@JsonController("home")
export class HomeController {

  @Get("")
  getWelcomeMessage() {
    return "Raspberry Pi interface";
  }

}
