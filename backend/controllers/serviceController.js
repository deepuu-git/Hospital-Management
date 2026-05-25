import Service from "../models/service.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// helper Function
const parseJsonArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;

  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
      return typeof parsed === "string" ? [parsed] : [];
    } catch {
      return field
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// normalize slots
function normalizeSlotsToMap(slotStrings = []) {
  const map = {};
  const dates = [];

  slotStrings.forEach((raw) => {
    console.log("RAW SLOT:", raw);

    // expected format:
    // 2026-05-14 10:30 AM

    const m = raw.match(
      /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
    );

    if (!m) {
      console.log("REGEX FAILED");
      return;
    }

    console.log("REGEX MATCHED");

    const [, year, month, day, hour, minute, ampm] = m;

    const dateKey = `${year}-${month}-${day}`;

    const timeStr = `${String(Number(hour)).padStart(2, "0")}:${minute} ${ampm.toUpperCase()}`;

    if (!map[dateKey]) {
      map[dateKey] = [];
      dates.push(dateKey);
    }

    map[dateKey].push(timeStr);
  });

  console.log("FINAL MAP:", map);
  console.log("FINAL DATES:", dates);

  return {
    slots: map,
    dates,
  };
}

// safely convert into number
const sanitizePrice = (v) =>
  Number(String(v ?? "0").replace(/[^\d.-]/g, "")) || 0; //  FIXED REGEX

const parseAvailability = (v) => {
  const s = String(v ?? "available").toLowerCase();
  return s === "available" || s === "true";
};

// ================= CREATE =================
export async function createService(req, res) {
  try {
    const b = req.body || {};

    const instructions = parseJsonArrayField(b.instructions);
    const rawSlots = parseJsonArrayField(b.slots);
    const { slots, dates } = normalizeSlotsToMap(rawSlots);
    const numericPrice = sanitizePrice(b.price);
    const available = parseAvailability(b.availability);

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");
        imageUrl = up?.secure_url || null;
        imagePublicId = up?.public_id || null;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
      }
    }

    const service = new Service({
      name: b.name,
      about: b.about || "",
      shortDescription: b.shortDescription || "",
      price: numericPrice,
      available,
      instructions,
      slots,
      dates,
      imageUrl,
      imagePublicId,
    });

    const saved = await service.save();

    return res.status(201).json({
      success: true,
      data: saved,
      message: "Service Created",
    });
  } catch (err) {
    console.error("createService Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// ================= GET ALL =================
export async function getServices(req, res) {
  try {
    const list = await Service.find().sort({ createdAt: -1 }).lean(); // ✅ FIXED (.sort instead of toSorted)

    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (err) {
    console.error("GetService error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// ================= GET BY ID =================
export async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service, // ✅ FIXED (data instead of message)
    });
  } catch (err) {
    console.error("GetServiceById error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// ================= UPDATE =================
export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const existing = await Service.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const b = req.body || {};
    const updateData = {};

    if (b.name !== undefined) updateData.name = b.name;
    if (b.about !== undefined) updateData.about = b.about;

    if (b.shortDescription !== undefined)
      updateData.shortDescription = b.shortDescription;
    if (b.price !== undefined) updateData.price = sanitizePrice(b.price);
    if (b.availability !== undefined)
      updateData.available = parseAvailability(b.availability);
    if (b.instructions !== undefined)
      updateData.instructions = parseJsonArrayField(b.instructions);

    if (b.slots !== undefined) {
      const parsed = normalizeSlotsToMap(parseJsonArrayField(b.slots));

      updateData.slots = parsed.slots;
      updateData.dates = parsed.dates;
    }

    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");

        if (up?.secure_url) {
          updateData.imageUrl = up.secure_url;
          updateData.imagePublicId = up.public_id || null;

          if (existing.imagePublicId) {
            try {
              await deleteFromCloudinary(existing.imagePublicId);
            } catch (err) {
              console.warn("Cloudinary delete failed:", err?.message || err);
            }
          }
        }
      } catch (err) {
        console.error("Cloudinary upload failed:", err?.message || err);
      }
    }

    const updated = await Service.findByIdAndUpdate(
      // ✅ FIXED SPELLING
      id,
      updateData,
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      data: updated,
      message: "Service Updated",
    });
  } catch (err) {
    console.error("UpdateService error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// ================= DELETE =================
export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const existing = await Service.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (existing.imagePublicId) {
      try {
        await deleteFromCloudinary(existing.imagePublicId);
      } catch (err) {
        console.warn(
          "Failed to delete image from cloudinary:",
          err?.message || err,
        ); // ✅ FIXED
      }
    }

    await existing.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Service Deleted.",
    });
  } catch (err) {
    console.error("DeleteService error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
