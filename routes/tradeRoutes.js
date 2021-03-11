import express from "express";
const router = express.Router();
import { initTrade } from "../controllers/tradeController.js";
router.post("/set", initTrade);
export default router;
