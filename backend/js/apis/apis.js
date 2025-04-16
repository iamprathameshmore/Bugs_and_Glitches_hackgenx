import { Router } from "express";
import healthcheck from "../controller/apiController";

const apiRouter = Router()


apiRouter.get('/', healthcheck)