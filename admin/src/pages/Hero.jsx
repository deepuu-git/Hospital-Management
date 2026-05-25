import React from 'react'
import Navbar from '../components/Navbar';
import { heroStyles } from '../assets/dummyStyles';
import logoImg from "../assets/logo.png";



const Hero = ({ role = "admin", userName = "Doctor" }) => {
  const isDoctor = role === "doctor";

  return (
    <div className={heroStyles.container}>
      <Navbar />

      <main className={heroStyles.mainContainer}>
        <section className={heroStyles.section}>
          <div className={heroStyles.decorativeBg.container}>
            
            <div className={heroStyles.decorativeBg.blurBackground}>
              <div className={heroStyles.decorativeBg.blurShape}></div>
            </div>

            <div className={heroStyles.contentBox}>
              
              <div className={heroStyles.logoContainer}>
                <img src={logoImg} alt="logo" className={heroStyles.logo}/>
              </div>

              <h1 className={heroStyles.heading}>
                {isDoctor
                  ? `Welcome, Dr. ${userName}`
                  : "LifeCare Admin Dashboard"}
              </h1>

              <p className={heroStyles.description}>
                {isDoctor
                  ? "Manage patient care efficiently with a secure dashboard. Access records, update diagnoses, and handle appointments in one place."
                  : "A powerful hospital management system  to streamline daily operations.  Manage doctors, patients, appointments, and medical records through a secure, centralized platform."
                 }
              </p>

              {/* info cards */}
              <div className={heroStyles.infoCards.container}>
                <div className={heroStyles.infoCards.card}>           
                  <h3 className={heroStyles.infoCards.cardTitle}>
                    Authorized Access
                  </h3>
                  <p className={heroStyles.infoCards.cardText}>
                   Ensure controlled access for Admin, Doctors, and Staff with secure authentication.
                  </p>
                </div>

                <div className={heroStyles.infoCards.card}>
                  <h3 className={heroStyles.infoCards.cardTitle}>
                     Appointment Management
                  </h3>
                  <p className={heroStyles.infoCards.cardText}>
                     Efficiently schedule, update, and manage patient appointments with ease.
                  </p>
                </div>

                 <div className={heroStyles.infoCards.card}>
                  <h3 className={heroStyles.infoCards.cardTitle}>
                    Centralized Dashboard
                  </h3>
                  <p className={heroStyles.infoCards.cardText}>
                    Maintain patient history, medical records, and reports in a centralized system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Hero;