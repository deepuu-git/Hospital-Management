import React, { useEffect, useMemo, useState } from "react";
import { doctorsPageStyles } from "../assets/dummyStyles";
import { Link } from "react-router-dom";
import { CircleChevronDown, Star } from "lucide-react";

import {
  ChevronRight,
  DotSquare,
  Medal,
  MousePointer2Off,
  Search,
  X,
} from "lucide-react";

const DoctorsPage = () => {
  const API_BASE = "https://backend-wy5h.onrender.com";

  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

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
          if (mounted) {
            setError(msg);
            setAllDoctors([]);
            setLoading(false);
          }
          return;
        }

        const items = (json && (json.data || json)) || [];
        const normalized = (Array.isArray(items) ? items : []).map((d) => {
          const id = d._id || d.id;
          const image =
            d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";
          let available = true;
          if (typeof d.availability === "string") {
            available = d.availability.toLowerCase() === "available";
          } else if (typeof d.available === "boolean") {
            available = d.available;
          } else if (typeof d.availability === "boolean") {
            available = d.availability;
          } else {
            available = d.availability === "Available" || d.available === true;
          }
          return {
            id,
            name: d.name || "Unknown",
            specialization: d.specialization || "",
            image,
            experience:
              (d.experience ?? d.experience === 0) ? String(d.experience) : "—",
            fee: d.fee ?? d.price ?? 0,
            available,
            raw: d,
          };
        });

        if (mounted) {
          setAllDoctors(normalized);
          setError("");
        }
      } catch (err) {
        console.error("load doctors error:", err);
        if (mounted) {
          setError("Network error while loading doctors.");
          setAllDoctors([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  // Derived filtered list
  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allDoctors;
    return allDoctors.filter(
      (doctor) =>
        (doctor.name || "").toLowerCase().includes(q) ||
        (doctor.specialization || "").toLowerCase().includes(q),
    );
  }, [allDoctors, searchTerm]);

  const displayedDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, 8);

  const retry = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/doctors`);
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError((json && json.message) || `Failed to load (${res.status})`);
        setAllDoctors([]);
        return;
      }
      const items = (json && (json.data || json)) || [];
      const normalized = (Array.isArray(items) ? items : []).map((d) => {
        const id = d._id || d.id;
        const image = d.imageUrl || d.image || "";
        let available = true;
        if (typeof d.availability === "string") {
          available = d.availability.toLowerCase() === "available";
        } else if (typeof d.available === "boolean") {
          available = d.available;
        } else {
          available = d.availability === "Available" || d.available === true;
        }
        return {
          id,
          name: d.name || "Unknown",
          specialization: d.specialization || "",
          image,
          experience: d.experience ?? "—",
          fee: d.fee ?? d.price ?? 0,
          available,
          raw: d,
        };
      });
      setAllDoctors(normalized);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Network error while loading doctors.");
      setAllDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={doctorsPageStyles.mainContainer}>
      <div className={doctorsPageStyles.backgroundShape1}></div>
      <div className={doctorsPageStyles.backgroundShape2}></div>

      <div className={doctorsPageStyles.wrapper}>
        <div className={doctorsPageStyles.headerContainer}>
          <h1 className={doctorsPageStyles.headerTitle}>
            {" "}
            Find the Right Doctor for Your Care
          </h1>
          <p className={doctorsPageStyles.headerSubtitle}>
            Browse verified specialists, check availability, and book
            appointments instantly with LifeCare+
          </p>
        </div>

        <div className={doctorsPageStyles.searchContainer}>
          <div className={doctorsPageStyles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={doctorsPageStyles.searchInput}
            />

            <Search className={doctorsPageStyles.searchIcon} />
            {searchTerm.length > 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className={doctorsPageStyles.clearButton}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className={doctorsPageStyles.errorContainer}>
            <div className={doctorsPageStyles.errorText}>{error}</div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={retry} className={doctorsPageStyles.retryButton}>
                Retry
              </button>
            </div>
          </div>
        )}

        {/* loading section */}
        {loading ? (
          <div className="overflow-x-auto scroll-smooth mt-8">
            <div className="flex gap-6 w-max px-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="min-w-[260px]">
                  <div className={doctorsPageStyles.skeletonCard}>
                    <div className={doctorsPageStyles.skeletonImage}></div>
                    <div className={doctorsPageStyles.skeletonName}></div>
                    <div
                      className={doctorsPageStyles.skeletonSpecialization}
                    ></div>
                    <div className={doctorsPageStyles.skeletonButton}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative mt-8">
            <div className="overflow-x-auto no-scrollbar scroll-smooth px-2 ">
              <div className="flex gap-6 px-4">
                {displayedDoctors.length > 0 ? (
                  displayedDoctors.map((doctor, index) => (
                    <div
                      key={doctor.id || `${doctor.name}-${index}`}
                      className="min-w-[260px] max-w-[260px] flex-shrink-0"
                    >
                      <div
                        className={`${doctorsPageStyles.doctorCard} ${
                          !doctor.available
                            ? doctorsPageStyles.doctorCardUnavailable
                            : ""
                        }`}
                        style={{
                          animationDelay: `${index * 90}ms`,
                        }}
                      >
                        {/* Image */}
                        {doctor.available ? (
                          <Link
                            to={`/doctors/${doctor.id}`}
                            state={{ doctor: doctor.raw || doctor }}
                            className={doctorsPageStyles.focusRing}
                          >
                            <div className={doctorsPageStyles.imageContainer}>
                              <img
                                src={doctor.image || "/placeholder-doctor.jpg"}
                                alt={doctor.name}
                                className={doctorsPageStyles.doctorImage}
                              />
                            </div>
                          </Link>
                        ) : (
                          <div
                            className={`${doctorsPageStyles.imageContainer} ${doctorsPageStyles.imageContainerUnavailable}`}
                          >
                            <img
                              src={doctor.image || "/placeholder-doctor.jpg"}
                              alt={doctor.name}
                              className={
                                doctorsPageStyles.doctorImageUnavailable
                              }
                            />
                          </div>
                        )}

                        {/* Info */}
                        <h3 className={doctorsPageStyles.doctorName}>
                          {doctor.name}
                        </h3>

                        {/* specialization*/}
                        <p className={doctorsPageStyles.doctorSpecialization}>
                          {doctor.specialization}
                        </p>

                        <div className={doctorsPageStyles.experienceBadge}>
                          <Medal className={doctorsPageStyles.experienceIcon} />
                          <span>{doctor.experience} Years Experience</span>
                        </div>

                        {/* Button */}
                        {doctor.available ? (
                          <Link
                            to={`/doctors/${doctor.id}`}
                            state={{ doctor: doctor.raw || doctor }}
                            className={doctorsPageStyles.bookButton}
                          >
                            <ChevronRight
                              className={doctorsPageStyles.bookButtonIcon}
                            />
                            Book Now
                          </Link>
                        ) : (
                          <button
                            disabled
                            className={doctorsPageStyles.notAvailableButton}
                          >
                            <MousePointer2Off
                              className={doctorsPageStyles.notAvailableIcon}
                            />
                            Not Available
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={doctorsPageStyles.noResults}>
                    No doctors found matching your search criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {filteredDoctors.length > 8 && (
          <div className={doctorsPageStyles.showMoreContainer}>
            <button
              onClick={() => setShowAll(!showAll)}
              className={doctorsPageStyles.showMoreButton}
            >
              {" "}
              {showAll ? (
                <>
                  <CircleChevronUp className={doctorsPageStyles.showMoreIcon} />
                  Hide
                </>
              ) : (
                <>
                  <CircleChevronDown
                    className={doctorsPageStyles.showMoreIcon}
                  />
                  Show More
                </>
              )}
            </button>
          </div>
        )}
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.9s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.9s ease-out both; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }

        @media (max-width: 420px) {
          .max-w-7xl { padding-left: 10px; padding-right: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default DoctorsPage;
