import "reflect-metadata";
import {useExpressServer} from "routing-controllers";
import {HomeController} from "./home/home.controller";
import * as express from "express";

const app = express();
useExpressServer(app, {
  routePrefix: "/api",
  controllers: [
    HomeController
  ],
  cors: false
});

app.listen(8080, function() {
  console.log("Example app listening on port 8080!");
});
