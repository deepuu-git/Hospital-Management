import React, { useState, useEffect } from "react";
import {
  servicePageStyles,
  serviceCardStyles,
  doctorsPageStyles,
} from "../assets/dummyStyles";
import { Link } from "react-router-dom";
import { ChevronsRight, MousePointer2Off, X } from "lucide-react";
import { Search } from "lucide-react";
import { SpeedSharp } from "@mui/icons-material";

const PlaceholderImg = "/placeholder-service.jpg";

const ServiceCard = ({ service }) => {
  const hasSrcSet =
    !!service.imageSrcSet ||
    (!!service.imageSmall && !!service.imageMedium && !!service.imageLarge);

  const src = service.imageUrl || service.image || service.imageSmall || "";
  const srcSet =
    service.imageSrcSet ||
    (service.imageSmall || service.image
      ? `${service.imageSmall || src} 480w, ${
          service.imageMedium || src
        } 768w, ${service.imageLarge || src} 1200w`
      : null);

  const name = service.name || "Service";
  const shortDescription = service.shortDescription || service.about || "";

  return (
    <div className={serviceCardStyles.card}>
      <div className={serviceCardStyles.imageContainer} aria-hidden="true">
        {hasSrcSet ? (
          <picture className={serviceCardStyles.picture}>
            {service.imageWebp && (
              <source srcSet={service.imageWebp} type="image/webp" />
            )}
            {service.imageSrcSet ? (
              <img
                src={src || PlaceholderImg}
                srcSet={service.imageSrcSet}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                alt={name}
                loading="lazy"
                decoding="async"
                className={serviceCardStyles.responsiveImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PlaceholderImg;
                }}
              />
            ) : (
              <img
                src={src || PlaceholderImg}
                srcSet={srcSet || undefined}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                alt={name}
                loading="lazy"
                decoding="async"
                className={serviceCardStyles.responsiveImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PlaceholderImg;
                }}
              />
            )}
          </picture>
        ) : (
          <img
            src={src || PlaceholderImg}
            alt={name}
            loading="lazy"
            decoding="async"
            className={serviceCardStyles.fallbackImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PlaceholderImg;
            }}
          />
        )}
      </div>

      <div className={serviceCardStyles.content}>
        <h3 className={serviceCardStyles.serviceName}>{name}</h3>

        {/* Adding display */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {shortDescription || "No description available"}
        </p>

        <div className={serviceCardStyles.buttonContainer}>
          {service.available ? (
            <Link
              to={`/services/${service.id}`}
              state={{ service: service.raw || service }}
              className={serviceCardStyles.buttonAvailable}
              aria-label={`Book ${name}`}
            >
              <ChevronsRight className="w-5 h-5" aria-hidden="true" />
              Book Now
            </Link>
          ) : (
            <button
              disabled
              className={serviceCardStyles.buttonUnavailable}
              aria-label={`${name} not available`}
            >
              <MousePointer2Off className="w-5 h-5" aria-hidden="true" />
              Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ServicePage = ({ previewCount = 999 }) => {
  const API_BASE = "http://localhost:4000";
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // to load services coming from the server
  async function loadServices() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (json && json.message) || `Failed to load services (${res.status})`;
        setError(msg);
        setServices([]);
        setLoading(false);
        return;
      }

      const items = (json && (json.data || json)) || [];
      const normalized = (Array.isArray(items) ? items : []).map((s) => {
        const id = s._id || s.id;
        const image = s.imageUrl || s.image || s.imageSmall || "";
        const available =
          typeof s.available === "boolean"
            ? s.available
            : typeof s.availability === "string"
              ? s.availability.toLowerCase() === "available"
              : s.availability === "Available" || s.available === true;

        return {
          id,
          name: s.name || "Service",
          shortDescription: s.shortDescription || s.about || "",
          image,
          imageSmall: s.imageSmall || null,
          imageMedium: s.imageMedium || null,
          imageLarge: s.imageLarge || null,
          imageSrcSet: s.imageSrcSet || null,
          imageWebp: s.imageWebp || null,
          price: s.price ?? s.fee ?? 0,
          available,
          raw: s,
        };
      });

      setServices(normalized);
    } catch (err) {
      console.error("load services error:", err);
      setError("Network error while loading services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, [API_BASE]);

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const shown = filteredServices.slice(0, previewCount);
  return (
    <div className={servicePageStyles.pageContainer}>
      <div className={servicePageStyles.maxWidthContainer}>
        <header className={servicePageStyles.header}>
          <h1 className={servicePageStyles.title}>
            Explore Our Healthcare services
          </h1>
          <p className={servicePageStyles.subtitle}>
            Book trusted medical services with ease — from diagnostics to
            specialist care, all in one place.
          </p>
        </header>

        {/* 🔍 SEARCH BAR */}
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
          <div className={servicePageStyles.errorContainer}>
            <div className={servicePageStyles.errorText}>{error}</div>
            <button
              onClick={loadServices}
              className={servicePageStyles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <section className={servicePageStyles.skeletonGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={servicePageStyles.skeletonCard}>
                <div className={servicePageStyles.skeletonImage}></div>
                <div className={servicePageStyles.skeletonText1}></div>
                <div className={servicePageStyles.skeletonText2}></div>
                <div className={servicePageStyles.skeletonButton}></div>
              </div>
            ))}
          </section>
        ) : (
          <div className="overflow-x-auto no-scrollbar scroll-smooth mt-8 cursor-grab active:cursor-grabbing">
            <div className="flex gap-6 px-4">
              {shown.length > 0 ? (
                shown.map((s, index) => (
                  <div
                    key={s.id || `${s.name}-${index}`}
                    className="min-w-[260px] max-w-[260px] flex-shrink-0"
                  >
                    <ServiceCard service={s} />
                  </div>
                ))
              ) : (
                <div className="text-center w-full py-10 text-gray-500">
                  No Service available.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
