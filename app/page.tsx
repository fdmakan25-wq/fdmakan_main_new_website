'use client';

import { useEffect } from 'react';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import TopSellingProjects from "@/components/TopSellingProjects";
import HousingTopPicks from "@/components/HousingTopPicks";
import PremiumProjects from "@/components/PremiumProjects";
import NewlyLaunchedProjects from "@/components/NewlyLaunchedProjects";
import PropertyListings from "@/components/PropertyListings";
import RecentBlogs from "@/components/RecentBlogs";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";
import Footer from "@/components/Footer";
import PageNavigation from "@/components/PageNavigation";

export default function Home() {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <PageNavigation />
      <div id="hero">
        <Hero />
      </div>
      <div className="lg:pl-[200px]">
        <div id="top-selling">
          <TopSellingProjects />
        </div>
        <div id="newly-launched">
          <NewlyLaunchedProjects />
        </div>
        <div id="premium-projects">
          <PremiumProjects />
        </div>
        <div id="top-picks">
          <HousingTopPicks />
        </div>
        <div id="recent-blogs">
          <RecentBlogs />
        </div>
        <div id="featured-developers">
          <FeaturedDevelopers />
        </div>
        <div id="stats">
          <StatsSection />
        </div>
        <div id="about">
          <AboutSection />
        </div>
      </div>
      <Footer />
    </main>
  );
}

