"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import BeforeAfterSlider from "./BeforeAfterSlider";

const projects = [
  {
    title: "Modern Office Complex", category: "Commercial",
    description: "Complete electrical infrastructure for 50,000 sq ft office building with smart lighting and security systems.",
    image: "https://images.unsplash.com/photo-1497366216548-37fd22990539?q=80&w=1000&auto=format&fit=crop",
    beforeImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Residential Solar Installation", category: "Residential",
    description: "Solar panel system installation reducing energy costs by 60% for luxury residential property.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop",
    beforeImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1508515053963-70c7cc3c21a2?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Industrial Factory Upgrade", category: "Industrial",
    description: "Complete electrical panel replacement and system upgrade for manufacturing facility.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
    beforeImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Smart Home Installation", category: "Residential",
    description: "Complete smart home automation system with IoT integration and voice control.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop",
    beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1585503418537-88331351ad99?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Hospital Electrical System", category: "Commercial",
    description: "Critical power systems and backup generators for medical facility.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000&auto=format&fit=crop",
    beforeImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Retail Store Lighting", category: "Commercial",
    description: "LED lighting retrofit with energy-efficient systems for retail chain.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
    beforeImage: "https://images.unsplash.com/photo-1525904097878-94fb1ba2fc1f?q=80&w=1000&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function Projects() {
  const { t, language, isLoaded } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  if (!isLoaded) return null;

  const isRTL = language === "ar";
  const categories = ["All", "Residential", "Commercial", "Industrial"];
  const filteredProjects = selectedCategory && selectedCategory !== "All" ? projects.filter((p) => p.category === selectedCategory) : projects;

  const lbl = {
    all: language === "fr" ? "Tous" : language === "ar" ? "الكل" : "All",
    before: language === "fr" ? "Avant" : language === "ar" ? "قبل" : "Before",
    after: language === "fr" ? "Après" : language === "ar" ? "بعد" : "After",
    beforeAfter: language === "fr" ? "Avant & Après" : language === "ar" ? "قبل وبعد" : "Before & After",
    close: language === "fr" ? "Fermer" : language === "ar" ? "إغلاق" : "Close",
  };

  return (
    <section id="projects" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.projects.title}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{t.projects.subtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                (selectedCategory === null && cat === "All") || selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground/70 hover:text-foreground"
              }`}
            >
              {cat === "All" ? lbl.all : cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {filteredProjects.map((project, index) => (
            <div key={index} className="group cursor-pointer animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }} onClick={() => setSelectedProject(project)}>
              <div className="relative overflow-hidden rounded-xl mb-4 h-64">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors"></div>
                <span className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">{project.category}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-foreground/70 mb-4">{project.description}</p>
              <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                {t.projects.viewMore}
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>

        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProject(null)}>
            <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{selectedProject.title}</h3>
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">{selectedProject.category}</span>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="text-2xl text-foreground/50 hover:text-foreground">×</button>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">{lbl.beforeAfter}</h4>
                  <BeforeAfterSlider beforeImage={selectedProject.beforeImage} afterImage={selectedProject.afterImage} beforeLabel={lbl.before} afterLabel={lbl.after} />
                </div>

                <p className="text-foreground/70 text-lg leading-relaxed mb-6">{selectedProject.description}</p>
                <button onClick={() => setSelectedProject(null)} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold">{lbl.close}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}