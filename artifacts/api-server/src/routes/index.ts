import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analysesRouter from "./analyses";
import imageLabRouter from "./image-lab";
import directorLabRouter from "./director-lab";
import dramaSeriesRouter from "./drama-series";
import dramaEngineRouter from "./drama-engine";

const router: IRouter = Router();

router.use(healthRouter);
router.use(analysesRouter);
router.use(imageLabRouter);
router.use(directorLabRouter);
router.use(dramaSeriesRouter);
router.use(dramaEngineRouter);

export default router;
