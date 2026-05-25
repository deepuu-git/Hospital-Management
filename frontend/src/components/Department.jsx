import React, { useEffect, useState } from "react";
import { departmentStyles, iconSize } from "../assets/dummyStyles";
import { Link } from "react-router-dom";
import { Medal, ChevronRight, MousePointer2Off } from "lucide-react";

const Department = ({ previewCount = 8 }) => {
  const API_BASE = "http://localhost:4000";
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // to fetch doctors from the server side
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/doctors`);
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            (json && json.message) || `Failed to load doctors (${res.status})`;
          if (!mounted) return;
          setError(msg);
          setDoctors([]);
          setLoading(false);
          return;
        }
        const items = (json && (json.data || json)) || [];
        const normalized = (Array.isArray(items) ? items : []).map((d) => {
          const id = d._id || d.id;
          const image =
            d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";
          const available =
            (typeof d.availability === "string"
              ? d.availability.toLowerCase() === "available"
              : typeof d.available === "boolean"
                ? d.available
                : d.availability === true) || d.availability === "Available";
          return {
            id,
            name: d.name || "Unknown",
            specialization: d.specialization || "",
            image,
            experience:
              d.experience || d.experience === 0 ? String(d.experience) : "",
            fee: d.fee ?? d.price ?? 0,
            available,
            raw: d,
          };
        });

        if (!mounted) return;
        setDoctors(normalized);
      } catch (err) {
        if (!mounted) return;
        console.error("load doctors error:", err);
        setError("Network error while loading doctors.");
        setDoctors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  const preview = doctors.slice(0, previewCount);

  return (
    <section className={departmentStyles.section}>
      <div className={departmentStyles.container}>
        <div className={departmentStyles.header}>
          <h1 className={departmentStyles.title}>
            <span className={departmentStyles.titleSpan}>
              Medical Specialties
            </span>
          </h1>
          <p className={departmentStyles.subtitle}>
            {" "}
            Find the right specialist for your needs and book appointments in
            seconds.
          </p>
        </div>
        {/* error / retry */}
        {error ? (
          <div className={departmentStyles.errorContainer}>
            <div className={departmentStyles.errorText}>{error}</div>
            <button
              onClick={() => {
                setLoading(true);
                setError("");
                (async () => {
                  try {
                    const res = await fetch(`${API_BASE}/api/doctors`);
                    const json = await res.json().catch(() => null);
                    const items = (json && (json.data || json)) || [];
                    const normalized = (Array.isArray(items) ? items : []).map(
                      (d) => {
                        const id = d._id || d.id;
                        const image = d.imageUrl || d.image || "";
                        const available =
                          (typeof d.availability === "string"
                            ? d.availability.toLowerCase() === "available"
                            : typeof d.available === "boolean"
                              ? d.available
                              : d.availability === true) ||
                          d.availability === "Available";
                        return {
                          id,
                          name: d.name || "Unknown",
                          specialization: d.specialization || "",
                          image,
                          experience: d.experience || "",
                          fee: d.fee ?? d.price ?? 0,
                          available,
                          raw: d,
                        };
                      },
                    );
                    setDoctors(normalized);
                    setError("");
                  } catch (err) {
                    console.error(err);
                    setError("Network error while loading doctors.");
                    setDoctors([]);
                  } finally {
                    setLoading(false);
                  }
                })();
              }}
              className={departmentStyles.retryButton}
            >
              Retry
            </button>
          </div>
        ) : null}{" "}
        {/* SO HERE IT WILL RE FETCH THE API TO GET RESPONSE */}
        {loading ? (
          <div className={departmentStyles.skeletonGrid}>
            {Array.from({ length: previewCount }).map((_, i) => (
              <div key={i} className={departmentStyles.skeletonCard}>
                <div className={departmentStyles.skeletonImage}></div>
                <div className={departmentStyles.skeletonText1}></div>
                <div className={departmentStyles.skeletonText2}></div>
                <div className=" flex gap-2 mt-auto">
                  <div className={departmentStyles.skeletonButton}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 px-4 py-4 scrollbar-hide scroll-smooth">
            {preview.map((doctor) => (
              <article
                key={doctor.id || doctor.name}
                className={`${departmentStyles.article} min-w-[260px]`}
              >
                {doctor.available ? (
                  <Link
                    to={`/doctors/${doctor.id}`}
                    state={{
                      doctor: doctor.raw || doctor,
                    }}
                  >
                    <div className={departmentStyles.imageContainerAvailable}>
                      <img
                        src={doctor.image || "/placeholder-doctor.jpg"}
                        alt={doctor.name}
                        loading="lazy"
                        className={departmentStyles.image}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-doctor.jpg";
                        }}
                      />
                    </div>
                  </Link>
                ) : (
                  <div className={departmentStyles.imageContainerUnavailable}>
                    <img
                      src={doctor.image || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      loading="lazy"
                      className={departmentStyles.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder-doctor.jpg";
                      }}
                    />

                    <div className={departmentStyles.unavailableBadge}>
                      Not Available
                    </div>
                  </div>
                )}

                {/* body section */}
                <div className={departmentStyles.cardBody}>
                  <h3
                    className={departmentStyles.doctorName}
                    id={`doctor-${doctor.id}-name`}
                  >
                    {doctor.name}
                  </h3>

                  <p className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full w-fit mx-auto mt-2">
                    {doctor.specialization}
                  </p>

                  <div className="mt-3 flex justify-center">
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs">
                      <Medal className="w-4 h-4" />
                      <span>{doctor.experience} Years Experience</span>
                    </div>
                  </div>

                  <div className={departmentStyles.buttonContainer}>
                    <div className=" w-full">
                      {doctor.available ? (
                        <Link
                          to={`/doctors/${doctor.id}`}
                          state={{ doctor: doctor.raw || doctor }}
                          className={departmentStyles.buttonAvailable}
                        >
                          <ChevronRight className=" w-5 h-5" /> Book Now
                        </Link>
                      ) : (
                        <button
                          disabled
                          className={departmentStyles.buttonUnavailable}
                        >
                          <MousePointer2Off className=" w-5 h-5" /> Not
                          Available
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{departmentStyles.customCSS}</style>
    </section>
  );
};

export default Department;
