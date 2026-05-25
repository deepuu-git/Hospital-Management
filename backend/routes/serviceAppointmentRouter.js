import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import {
  cancelserviceAppointment,
  confirmServicePayment,
  createServiceAppointment,
  getServiceAppointmentById,
  getServiceAppointments,
  getServiceAppointmentsByPatient,
  getServiceAppointmentStats,
  updateServiceAppointment,
} from "../controllers/serviceAppointmentController.js";

const serviceAppointmentRouter = express.Router();

serviceAppointmentRouter.get("/", getServiceAppointments);
serviceAppointmentRouter.get("/confirm", confirmServicePayment);
serviceAppointmentRouter.get("/stats/summary", getServiceAppointmentStats);

serviceAppointmentRouter.post(
  "/",
  clerkMiddleware(),
  requireAuth(),
  createServiceAppointment,
);

serviceAppointmentRouter.get(
  "/me",
  clerkMiddleware(),
  requireAuth(),
  getServiceAppointmentsByPatient,
);

serviceAppointmentRouter.get("/:id", getServiceAppointmentById);

serviceAppointmentRouter.put(
  "/:id",
  clerkMiddleware(),
  requireAuth(),
  updateServiceAppointment,
);

serviceAppointmentRouter.post(
  "/:id/cancel",
  clerkMiddleware(),
  requireAuth(),
  cancelserviceAppointment,
);

export default serviceAppointmentRouter;
