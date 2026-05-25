import express from "express";

import {
  createContactMessage,
  getAllMessages,
} from "../controllers/contactController.js";

const router = express.Router();

// USER SEND MESSAGE
router.post("/", createContactMessage);

// ADMIN GET ALL MESSAGES
router.get("/", getAllMessages);

export default router;
