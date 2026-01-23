import express from "express";
import { generateSignature } from "../controllers/cloudinaryController.js";
import { authorize } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/signature", authorize, generateSignature);

export default router;
