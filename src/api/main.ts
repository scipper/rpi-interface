import "reflect-metadata";
import {RoutingControllersOptions, useExpressServer} from "routing-controllers";
import {HomeController} from "./home/home.controller";
import * as express from "express";
import {getMetadataArgsStorage} from "routing-controllers"
import {routingControllersToSpec} from "routing-controllers-openapi"
import {writeFile} from "fs";

const app = express();

const routingControllersOptions: RoutingControllersOptions = {
  routePrefix: "/api/",
  controllers: [
    HomeController
  ],
  cors: false
};

useExpressServer(app, routingControllersOptions);

app.listen(8080, () => {
  console.log("Example app listening on port 8080!");
});

const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, routingControllersOptions);
writeFile("./src/openapi/openapi.json", JSON.stringify(spec), (error: NodeJS.ErrnoException | null) => {
  if(error) {
    console.log(error);
  }
});
