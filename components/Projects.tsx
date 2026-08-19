"use client";
import { useLanguage } from "@/lib/i18n-context";
import { projects, projectsStrings } from "@/data/projects";
import { Zap, Camera } from "lucide-react";

export default function Projects() {
  const { language, isLoaded } = useLanguage();
  if (!isLoaded) return null;
  const lang = language as "fr" | "en" | "ar";
  const isRTL = lang === "ar";

  const isEmpty = projects.length === 0;

  return (
    <section id="projects" className={`py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{projectsStrings.title[lang]}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{projectsStrings.subtitle[lang]}</p>
        </div>

        {isEmpty ? (
          <div className="animate-fade-in-up rounded-2xl border-2 border-dashed border-primary/30 bg-card p-12 md:p-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{projectsStrings.emptyTitle[lang]}</h3>
            <p className="text-foreground/70 max-w-xl mx-auto mb-8 leading-relaxed">
              {projectsStrings.emptySubtitle[lang]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-accent"
              >
                <Zap size={18} />
                {projectsStrings.contactCta[lang]}
              </a>
              <p className="text-sm text-foreground/60">
                {projectsStrings.contactForProjects[lang]}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl mb-4 h-64">
                  <img
                    src={`https://res.cloudinary.com/du0frvxjo/image/upload/f_auto,q_auto,c_fill,w_1000/${project.imagePublicId}`}
                    alt={project.title[lang]}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title[lang]}
                </h3>
                <p className="text-foreground/70">{project.description[lang]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}