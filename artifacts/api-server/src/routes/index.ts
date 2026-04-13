import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analysesRouter from "./analyses";
import imageLabRouter from "./image-lab";

const router: IRouter = Router();

router.use(healthRouter);
router.use(analysesRouter);
router.use(imageLabRouter);

export default router;
