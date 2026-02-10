import React from "react";

// Adjust import paths if your folder names differ
import HeroSection from "../sections/hero-section";
import TrustedCompanies from "../sections/trusted-companies";
import OurLatestCreation from "../sections/our-latest-creation";
import AboutOurApps from "../sections/about-our-apps";
import OurTestimonials from "../sections/our-testimonials";
import PricingSection from "../sections/PricingSection";
import GetInTouch from "../sections/get-in-touch";
import SubscribeNewsletter from "../sections/subscribe-newsletter";
import Footer from "../components/footer";

const Homepage = () => {
  return (
    <main className="min-h-screen px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Top / Hero */}
      <HeroSection />
      <TrustedCompanies />

      {/* Navbar: #creations */}
      <section id="creations">
        <OurLatestCreation />
      </section>

      {/* Navbar: #about */}
      <section id="about">
        <AboutOurApps />
      </section>

      {/* Navbar: #testimonials */}
      <section id="testimonials">
        <OurTestimonials />
      </section>

      <PricingSection />

      {/* Navbar: #contact */}
      <section id="contact">
        <GetInTouch />
      </section>

      <SubscribeNewsletter />

      {/**Footer */}
      <Footer/>
    </main>
  );
};

export default Homepage;
