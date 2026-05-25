import React from "react";
import { bannerStyles } from "../assets/dummyStyles";

import {
  BadgeCheck,
  CalendarCheck,
  Clock3,
  PhoneCall,
  ShieldCheck,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import banner from "../assets/BannerImgg.png";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-10">
      {/* background glow */}
      <div className="absolute -z-10 top-10 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-70"></div>

      <div
        className="
      bg-white/90
      backdrop-blur-md
      rounded-[32px]
      shadow-xl
      hover:shadow-2xl
      transition-all
      duration-300
      border
      border-emerald-100
      overflow-hidden
      px-6
      md:px-10
      py-10
    "
      >
        <div className="grid md:grid-cols-2 items-center gap-10">
          {/* LEFT CONTENT */}
          <div className="relative max-w-xl flex flex-col justify-center">
            {/* badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full w-fit shadow-sm">
              <BadgeCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Trusted Healthcare Platform
              </span>
            </div>

            {/* heading */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-gray-900 mt-5">
              Life<span className="text-emerald-600">Care+</span>
            </h1>

            {/* tagline */}
            <p className="text-lg text-gray-600 mt-5 leading-relaxed">
              Smart healthcare made simple with seamless doctor booking, instant
              appointments, and secure patient care.
            </p>

            <p className="text-emerald-600 font-semibold text-lg mt-2">
              Book. Manage. Heal.
            </p>

            {/* features */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-3">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                Expert Doctors
              </div>

              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-3">
                <Clock3 className="w-4 h-4 text-emerald-500" />
                24/7 Availability
              </div>

              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Safe & Secure
              </div>

              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-3">
                <Users className="w-4 h-4 text-emerald-500" />
                500+ Doctors
              </div>
            </div>

            {/* buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate("/doctors")}
                className="
              px-7
              py-3
              bg-gradient-to-r
              from-emerald-500
              to-emerald-700
              text-white
              rounded-xl
              hover:scale-105
              transition-all
              duration-300
              shadow-md
              hover:shadow-xl
              flex
              items-center
              gap-2
              font-medium
            "
              >
                <CalendarCheck className="w-5 h-5" />
                Book Appointment
              </button>

              <button
                onClick={() => (window.location.href = "tel:8299431275")}
                className="
             px-7
              py-3
              bg-white
              border
              border-emerald-200
              text-emerald-700
              rounded-xl
              hover:bg-emerald-50
              transition-all
              duration-300
              shadow-sm
              hover:shadow-md
              flex
              items-center
              gap-2
              font-medium
            "
              >
                <PhoneCall className="w-5 h-5" />
                Emergency Call
              </button>
            </div>

            {/* stats */}
            <div className="flex items-center gap-3 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="font-semibold text-gray-700">4.9 Rating</span>
              </div>

              <span>•</span>

              <span>10,000+ Patients</span>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              No waiting • Instant booking • Secure data
            </p>

            <div className="w-20 h-1 bg-emerald-500 rounded-full mt-4"></div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">
            {/* glow */}
            <div className="absolute w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>

            <div
              className="
            relative
            bg-white/70
            backdrop-blur-md
            border
            border-white/50
            rounded-[30px]
            shadow-2xl
            p-4
            hover:scale-[1.02]
            transition-all
            duration-500
          "
            >
              <img
                src={banner}
                alt="banner"
                className="
              w-full
              max-w-lg
              rounded-2xl
              object-cover
            "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
