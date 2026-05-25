import React from "react";
import logo from "../assets/logo.png";

import { Mail, MapPin, Phone, Clock3, ChevronRight } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/doctors" },
    { name: "Services", href: "/services" },
    { name: "Appointments", href: "/appointments" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <div className="w-full h-[1px] bg-blue-200"></div>
      <footer className="bg-gradient-to-br from-emerald-100 via-white to-emerald-50 pt-12 pb-2 px-4 sm:px-6 md:px-8 lg:px-20 font-serif relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          {/* MAIN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* COMPANY */}
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="LifeCare Logo"
                  className="w-14 h-14 object-contain"
                />

                <div>
                  <h2 className="text-2xl font-bold text-emerald-700">
                    LifeCare
                  </h2>

                  <p className="text-xs text-gray-500">Healthcare Management</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 leading-6 max-w-xs">
                Your trusted healthcare partner for doctor appointments,
                healthcare services, and seamless patient care.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Links
              </h3>

              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-all duration-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* WORKING HOURS */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Working Hours
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock3 className="w-4 h-4 text-emerald-600 mt-1" />

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Monday - Friday
                    </p>

                    <p className="text-sm text-gray-500">9:00 AM – 11:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="w-4 h-4 text-emerald-600 mt-1" />

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Saturday
                    </p>

                    <p className="text-sm text-gray-500">10:00 AM – 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="w-4 h-4 text-red-500 mt-1" />

                  <div>
                    <p className="text-sm font-medium text-red-600">Sunday</p>

                    <p className="text-sm text-red-500">Emergency Only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Us
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Phone</p>

                    <p className="text-sm font-medium text-gray-700">
                      +91 82520884XX
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Email</p>

                    <p className="text-sm font-medium text-gray-700 break-all">
                      deepusah@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Location</p>

                    <p className="text-sm font-medium text-gray-700">
                      Ranchi, Jharkhand
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t border-emerald-100 mt-10 pt-5 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-500 text-center">
              © 2026 LifeCare. All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-sm text-gray-500">
              <span className="hover:text-emerald-600 cursor-pointer transition">
                Privacy Policy
              </span>

              <span className="hover:text-emerald-600 cursor-pointer transition">
                Terms & Conditions
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
