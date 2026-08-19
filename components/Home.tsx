"use client";
import { LanguageProvider, Language } from "@/lib/i18n-context";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Services from "./Services";
import Projects from "./Projects";
import Stats from "./Stats";
import RenewableEnergy from "./RenewableEnergy";
import BookingSystem from "./BookingSystem";
import Bio from "./Bio";
import Reviews from "./Reviews";
import Contact from "./Contact";
import Footer from "./Footer";
import CallButtons from "./CallButtons";
import Process from "./Process";
import Catalogue from "./Catalogue";
import Faq from "./Faq";
import { Toaster } from "@/components/Toaster";

export default function Home({ lang }: { lang: Language }) {
  return (
    <LanguageProvider initialLanguage={lang}>

      <main className="min-h-screen bg-background">
        <Navigation />
        <Hero />
       <Services />
<Catalogue />
<Process />
<Projects />
<Stats />
<BookingSystem />
<Bio />
<Reviews />
<Faq />
<Contact />
        <Footer />
        <Toaster /> 
        <CallButtons />
      </main>

    </LanguageProvider>
  );
}