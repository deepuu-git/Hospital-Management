import React, { useState } from "react";
import {
  Mail,
  PenLine,
  Phone,
  Send,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);

  const [responseMessage, setResponseMessage] = useState({
    type: "",
    text: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: "",
  });

  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResponseMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage({
          type: "success",
          text: data.message || "Message sent successfully",
        });

        // reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          message: "",
        });
      } else {
        setResponseMessage({
          type: "error",
          text: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.log(error);

      setResponseMessage({
        type: "error",
        text: "Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative max-w-5xl mx-auto mt-20 mb-20 px-4">
      {/* background glow */}
      <div className="absolute -z-10 top-0 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-70"></div>

      <div
        className="
        bg-white/90
        backdrop-blur-md
        rounded-3xl
        shadow-xl
        hover:shadow-2xl
        transition-all
        duration-300
        border
        border-emerald-100
        p-6
        md:p-10
      "
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="text-emerald-600">Need Help?</span>
          </h2>

          <p className="text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
            Have questions or need assistance? Our healthcare team is here to
            support you anytime.
          </p>
        </div>

        {/* success/error message */}
        {responseMessage.text && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-medium ${
              responseMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {responseMessage.text}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* First Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                pl-12
                pr-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-emerald-500
                transition
              "
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                pl-12
                pr-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-emerald-500
                transition
              "
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                pl-12
                pr-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-emerald-500
                transition
              "
            />
          </div>

          {/* Mobile */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              required
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                pl-12
                pr-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-emerald-500
                transition
              "
            />
          </div>

          {/* Message */}
          <div className="relative md:col-span-2">
            <PenLine className="absolute left-4 top-4 text-emerald-500 w-5 h-5" />

            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                pl-12
                pr-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:border-emerald-500
                transition
                resize-none
              "
            ></textarea>
          </div>

          {/* Button */}
          <div className="md:col-span-2 flex flex-col items-center mt-3">
            <button
              type="submit"
              disabled={loading}
              className="
                px-8
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
                disabled:opacity-70
                disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              We usually respond within 24 hours
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
