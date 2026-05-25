import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  Send,
  Headphones,
  ShieldCheck,
  CalendarCheck,
  Users,
  MessageCircle,
  HelpCircle,
  PenLine,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
  });

  const [question, setQuestion] = React.useState("");

  const suggestedQuestions = [
    "How can I book an appointment?",
    "Do you provide emergency support?",
    "Can I cancel my appointment?",
    "Do doctors provide online consultation?",
    "How can I contact support?",
  ];

  const faqAnswers = {
    "How can I book an appointment?":
      "You can book appointments from the doctors or services page.",

    "Do you provide emergency support?":
      "Yes, emergency healthcare support is available 24/7.",

    "Can I cancel my appointment?":
      "Yes, appointments can be cancelled from your appointments page.",

    "Do doctors provide online consultation?":
      "Yes, selected doctors provide online consultations.",

    "How can I contact support?":
      "You can contact support through phone, email, or contact form.",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully");

        setFormData({
          name: "",
          email: "",
          phone: "",
          department: "",
          service: "",
          message: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-100 via-white to-emerald-50 pt-12 pb-6 px-4 sm:px-6 md:px-8 lg:px-20 font-serif relative overflow-hidden">
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          We're Here to{" "}
          <span className="text-emerald-600">Support Your Care</span>
        </h1>

        <p className="text-gray-600 mt-4 text-base md:text-lg leading-relaxed">
          Connect with our healthcare support team for appointments,
          consultations, and medical assistance anytime you need.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* LEFT - FORM */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/40 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Send Us a Message
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-gray-200 rounded-xl pl-10 py-3 bg-white/80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border border-gray-200 rounded-xl pl-10 py-3 bg-white/80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4" />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-xl pl-10 py-3 bg-white/80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Department */}
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl py-3 px-4 bg-white/80 focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-200"
            >
              <option value="">Select Department</option>
              <option>Cardiology</option>
              <option>Orthopedics</option>
              <option>Dermatology</option>
              <option>General Physician</option>
              <option>Gynecology</option>
              <option>Pediatrics</option>
              <option>Neurology</option>
              <option>Endocrinology</option>
              <option>Gastroenterology</option>
            </select>

            {/* Service */}
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl py-3 px-4 bg-white/80 focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-200"
            >
              <option value="">Select Service</option>
              <option>Consultation</option>
              <option>ECG</option>
              <option>Child Checkup</option>
              <option>Vaccination (Child)</option>
              <option>Growth Monitoring</option>
              <option>Full Body Checkup</option>
            </select>

            {/* Message */}
            <div className="relative md:col-span-2">
              <PenLine className="absolute left-4 top-3 text-emerald-500 w-5 h-5 pointer-events-none" />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="4"
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              ></textarea>
            </div>

            {/* Button */}
            <div className="md:col-span-2 flex flex-col items-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-7 py-3 rounded-xl flex items-center gap-2 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>

              <p className="text-xs text-gray-500 mt-2">
                We usually respond within 24 hours
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT - CONTACT INFO */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/40 p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Contact Information
          </h2>

          <div className="space-y-5">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl flex-shrink-0">
                <Phone className="text-emerald-500 w-5 h-5" />
              </div>

              <div>
                <p className="font-medium text-gray-800">+91 82520884XX</p>

                <p className="text-sm text-gray-500">Mon - Sun, 9AM - 8PM</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl flex-shrink-0">
                <Mail className="text-emerald-500 w-5 h-5" />
              </div>

              <div>
                <p className="font-medium text-gray-800">
                  support@lifecare.com
                </p>

                <p className="text-sm text-gray-500">
                  We reply within 24 hours
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl flex-shrink-0">
                <MapPin className="text-emerald-500 w-5 h-5" />
              </div>

              <div>
                <p className="font-medium text-gray-800">Ranchi, Jharkhand</p>

                <p className="text-sm text-gray-500">India - 835103</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl flex-shrink-0">
                <Clock className="text-emerald-500 w-5 h-5" />
              </div>

              <div>
                <p className="font-medium text-gray-800">Working Hours</p>

                <p className="text-sm text-gray-500">
                  Mon - Fri: 9:00AM - 11:00PM
                </p>

                <p className="text-sm text-gray-500">
                  Saturday: 10:00AM - 8:00PM
                </p>

                <p className="text-sm text-red-500">Sunday: Emergency Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Feature
          icon={<ShieldCheck className="w-6 h-6" />}
          title="Secure Data"
          desc="Your medical information is protected with advanced security."
        />

        <Feature
          icon={<Headphones className="w-6 h-6" />}
          title="24/7 Support"
          desc="Get quick assistance from our healthcare support team anytime."
        />

        <Feature
          icon={<CalendarCheck className="w-6 h-6" />}
          title="Easy Scheduling"
          desc="Book and manage appointments with a smooth experience."
        />

        <Feature
          icon={<Users className="w-6 h-6" />}
          title="Expert Doctors"
          desc="Connect with experienced healthcare professionals easily."
        />
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Frequently Asked Questions
        </h2>

        <div className="bg-white rounded-3xl shadow-md p-6 mt-8 border">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="text-emerald-600 w-6 h-6" />

            <h3 className="text-xl font-semibold text-gray-800">
              Ask Your Question
            </h3>
          </div>

          <input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Suggested Questions */}
          <div className="flex flex-wrap gap-3 mt-5">
            {suggestedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => setQuestion(q)}
                className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm hover:bg-emerald-100 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Answer */}
          {faqAnswers[question] && (
            <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="text-emerald-600 mt-1" />

                <div>
                  <h4 className="font-semibold text-gray-800">Answer</h4>

                  <p className="text-gray-600 mt-1">{faqAnswers[question]}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition duration-300 text-center">
    <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
      {icon}
    </div>

    <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>

    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{desc}</p>
  </div>
);

export default ContactPage;
