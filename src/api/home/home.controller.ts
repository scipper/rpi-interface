import {Get, JsonController} from "routing-controllers";

@JsonController()
export class HomeController {

  @Get("/")
  getWelcomeMessage() {
    return "  ____  ____ ___  ____  _   _ ____  _  _   \n" +
      " |  _ \\|  _ \\_ _|/ __ \\| | | | __ )| || |  \n" +
      " | |_) | |_) | |/ / _` | |_| |  _ \\| || |_ \n" +
      " |  _ <|  __/| | | (_| |  _  | |_) |__   _|\n" +
      " |_| \\_\\_|  |___\\ \\__,_|_| |_|____/   |_|  \n" +
      "                 \\____/                    ";
  }

}
