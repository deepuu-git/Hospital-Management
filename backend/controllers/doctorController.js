import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


// ================= HELPER FUNCTIONS =================

// convert "10:30 AM" → minutes
const parseTimeToMinutes = (t = "") => {
  const [time = "0:00", ampm = ""] = (t || "").split(" ");
  const [hh = 0, mm = 0] = time.split(":").map(Number);
  let h = hh % 12;
  if ((ampm || "").toUpperCase() === "PM") h += 12;
  return h * 60 + (mm || 0);
};

function dedupeAndSortSchedule(schedule = {}) {
  const out = {};
  Object.entries(schedule).forEach(([date, slots]) => {
    if (!Array.isArray(slots)) return;
    const uniq = Array.from(new Set(slots));
    uniq.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
    out[date] = uniq;
  });
  return out;
}

function parserScheduleInput(s) {
  if (!s) return {};
  if (typeof s === "string") {
    try {
      s = JSON.parse(s);
    } catch {
      return {};
    }
  }
  return dedupeAndSortSchedule(s || {});
}

function normalizeDocForClient(raw = {}) {
  const doc = { ...raw };

  if (doc.schedule && typeof doc.schedule.forEach === "function") {
    const obj = {};
    doc.schedule.forEach((val, key) => {
      obj[key] = Array.isArray(val) ? val : [];
    });
    doc.schedule = obj;
  } else if (!doc.schedule || typeof doc.schedule !== "object") {
    doc.schedule = {};
  }

  doc.availability = doc.availability ?? "Available";
  doc.patients = doc.patients ?? "";
  doc.rating = doc.rating ?? 0;

  return doc;
}


// ================= CREATE DOCTOR =================

export async function createDoctor(req, res) {
  try {
    const body = req.body || {};

    if (!body.email || !body.password || !body.name) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Password are required.",
      });
    }

    const emailLC = body.email.toLowerCase();

    if (await Doctor.findOne({ email: emailLC })) {
      return res.status(409).json({
        success: false,
        message: "Email already in use.",
      });
    }

    let imageUrl = body.imageUrl || null;
    let imagePublicId = body.imagePublicId || null;

    if (req.file?.path) {
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      imageUrl = uploaded?.secure_url || uploaded?.url || imageUrl;
      imagePublicId = uploaded?.public_id || uploaded?.publicId || imagePublicId;
    }

    const schedule = parserScheduleInput(body.schedule);

    const doc = new Doctor({
      email: emailLC,
      password: body.password,
      name: body.name,
      specialization: body.specialization || "",
      imageUrl,
      imagePublicId,
      availability: body.availability || "Available",
      experience: body.experience || "",
      qualifications: body.qualifications || "",
      location: body.location || "",
      about: body.about || "",
      fee: body.fee !== undefined ? Number(body.fee) : 0,
      schedule,
      success: body.success || "",
      patients: body.patients || "",
      rating: body.rating !== undefined ? Number(body.rating) : 0,
    });

    await doc.save();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.warn("JWT Secret not defined");
      return res.status(500).json({
        success: false,
        message: "Server Misconfigured",
      });
    }

    const token = jwt.sign(
      { id: doc._id.toString(), email: doc.email, role: "doctor" },
      secret,
      { expiresIn: "7d" }
    );

    const out = normalizeDocForClient(doc.toObject());
    delete out.password;

    return res.status(201).json({
      success: true,
      data: out,
      token,
    });
  } catch (error) {
    console.error("createDoctor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}


// ================= GET ALL DOCTORS =================

export const getDoctors = async (req, res) => {
  try {
    const { q = "", limit: limitRaw = 200, page: pageRaw = 1 } = req.query;
    const limit = Math.min(500, Math.max(1, parseInt(limitRaw) || 200));
    const page = Math.max(1, parseInt(pageRaw) || 1);
    const skip = (page - 1) * limit;

    let match = {};
    if (q.trim()) {
      const re = new RegExp(q.trim(), "i");
      match.$or = [{ name: re }, { specialization: re }, { email: re }];
    }

    const docs = await Doctor.find(match).skip(skip).limit(limit).lean();

    const normalized = docs.map((d) => normalizeDocForClient(d));

    const total = await Doctor.countDocuments(match);

    return res.json({
      success: true,
      data: normalized,
      meta: { page, limit, total },
    });
  } catch (err) {
    console.error("getDoctors:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// ================= GET DOCTOR BY ID =================

export async function getDoctorById(req, res) {
  try {
    const { id } = req.params;
    const doc = await Doctor.findById(id).select("-password").lean();

    if (!doc)
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });

    return res.json({
      success: true,
      data: normalizeDocForClient(doc),
    });
  } catch (err) {
    console.error("getDoctorById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


// ================= UPDATE DOCTOR =================

export async function updateDoctor(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const existing = await Doctor.findById(id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    if (req.file?.path) {
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      if (uploaded) {
        const prev = existing.imagePublicId;
        existing.imageUrl = uploaded.secure_url || uploaded.url;
        existing.imagePublicId = uploaded.public_id;
        if (prev && prev !== existing.imagePublicId) {
          deleteFromCloudinary(prev).catch(console.warn);
        }
      }
    }

    if (body.schedule) existing.schedule = parserScheduleInput(body.schedule);

    const fields = [
      "name",
      "specialization",
      "experience",
      "qualifications",
      "location",
      "about",
      "fee",
      "availability",
      "patients",
      "rating",
    ];

    fields.forEach((k) => {
      if (body[k] !== undefined) existing[k] = body[k];
    });

    await existing.save();

    const out = normalizeDocForClient(existing.toObject());
    delete out.password;

    return res.json({ success: true, data: out });
  } catch (err) {
    console.error("updateDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


// ================= DELETE DOCTOR =================

export async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;

    const existing = await Doctor.findById(id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    if (existing.imagePublicId) {
      await deleteFromCloudinary(existing.imagePublicId).catch(console.warn);
    }

    await Doctor.findByIdAndDelete(id);

    return res.json({ success: true, message: "Doctor Removed" });
  } catch (error) {
    console.error("deleteDoctor error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// ================= TOGGLE AVAILABILITY =================

export async function toggleAvailability(req, res) {
  try {
    const { id } = req.params;

    const doc = await Doctor.findById(id);
    if (!doc)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    if (typeof doc.availability === "boolean") {
      doc.availability = !doc.availability;
    } else {
      doc.availability =
        doc.availability === "Available" ? "Unavailable" : "Available";
    }

    await doc.save();

    const out = normalizeDocForClient(doc.toObject());
    delete out.password;

    return res.json({ success: true, data: out });
  } catch (err) {
    console.error("toggleAvailability error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


// ================= LOGIN =================

export async function doctorLogin(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and Password required",
      });

    const doc = await Doctor.findOne({ email: email.toLowerCase() }).select("+password");

    if (!doc || doc.password !== password)
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });

    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res.status(500).json({
        success: false,
        message: "Server Misconfigured",
      });

    const token = jwt.sign(
      { id: doc._id.toString(), email: doc.email, role: "doctor" },
      secret,
      { expiresIn: "7d" }
    );

    const out = doc.toObject();
    delete out.password;

    return res.json({ success: true, token, data: out });
  } catch (err) {
    console.error("doctorLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}