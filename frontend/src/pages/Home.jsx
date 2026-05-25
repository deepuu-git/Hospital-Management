import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Department from "../components/Department";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <Department />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
