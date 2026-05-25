import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import {
  cancelAppointment,
  confirmPayment,
  createAppointment,
  getAappointments,
  getAappointmentsByDoctor,
  getAappointmentsByPatient,
  getRegisteredUserCount,
  getStats,
  updateAppointment,
} from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAappointments);
appointmentRouter.get("/confirm", confirmPayment);
appointmentRouter.get("/stats/summary", getStats);

// authenic routes
appointmentRouter.post(
  "/",
  clerkMiddleware(),
  requireAuth(),
  createAppointment,
);
appointmentRouter.get(
  "/me",
  clerkMiddleware(),
  requireAuth(),
  getAappointmentsByPatient,
);

appointmentRouter.get("/doctor/:doctorId", getAappointmentsByDoctor);

appointmentRouter.post(
  "/:id/cancel",
  clerkMiddleware(),
  requireAuth(),
  cancelAppointment,
);
appointmentRouter.get("/patients/count", getRegisteredUserCount);
appointmentRouter.put(
  "/:id",
  clerkMiddleware(),
  requireAuth(),
  updateAppointment,
);

export default appointmentRouter;
