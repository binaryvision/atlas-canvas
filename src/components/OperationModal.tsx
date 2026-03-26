import type { ExpandedContent, Location } from "@shared/data";
import { useGSAP } from "@gsap/react";
import { FocusTrap } from "focus-trap-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronRight,
  FileText,
  Minus,
  Play,
  Radar as RadarIcon,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

gsap.registerPlugin(ScrollTrigger);

interface OperationModalProps {
  location: Location;
  content: ExpandedContent;
  isOpen: boolean;
  onClose: () => void;
}

export function OperationModal({
  location,
  content,
  isOpen,
  onClose,
}: OperationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const aircraftRef = useRef<HTMLElement>(null);
  const rolesRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const documentsRef = useRef<HTMLElement>(null);
  const newsRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimationComplete(true);
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      setIsVisible(false);
      setAnimationComplete(false);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  // Scroll-triggered animations
  useGSAP(
    () => {
      if (!animationComplete || !modalRef.current) return;

      const scroller = modalRef.current;

      // Overview section - fade up with text reveal
      if (overviewRef.current) {
        gsap.fromTo(
          overviewRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: overviewRef.current,
              scroller,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );

      }

      // Stats - stagger in from bottom with counter animation feel
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll(".stat-card");
        gsap.fromTo(
          statCards,
          { opacity: 0, y: 80, scale: 0.8, rotateX: 20 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: statsRef.current,
              scroller,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Aircraft cards - reveal up
      if (aircraftRef.current) {
        const aircraftCards =
          aircraftRef.current.querySelectorAll(".aircraft-card");
        gsap.fromTo(
          aircraftCards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: aircraftRef.current,
              scroller,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Timeline - draw in effect
      if (timelineRef.current) {
        const timelineItems =
          timelineRef.current.querySelectorAll(".timeline-item");
        const timelineDots =
          timelineRef.current.querySelectorAll(".timeline-dot");
        const timelineLines =
          timelineRef.current.querySelectorAll(".timeline-line");

        // Animate dots
        gsap.fromTo(
          timelineDots,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.15,
            ease: "back.out(3)",
            scrollTrigger: {
              trigger: timelineRef.current,
              scroller,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );

        // Animate lines
        gsap.fromTo(
          timelineLines,
          { scaleY: 0, transformOrigin: "top" },
          {
            scaleY: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              scroller,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );

        // Animate content
        gsap.fromTo(
          timelineItems,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              scroller,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Team - slide in from right
      if (teamRef.current) {
        const teamCards = teamRef.current.querySelectorAll(".deployed-card");
        gsap.fromTo(
          teamCards,
          { opacity: 0, x: 24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: teamRef.current,
              scroller,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Roles - grid reveal
      if (rolesRef.current) {
        const roleCards = rolesRef.current.querySelectorAll(".role-card");
        gsap.fromTo(
          roleCards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: rolesRef.current,
              scroller,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Gallery - masonry-style reveal
      if (galleryRef.current) {
        const galleryItems =
          galleryRef.current.querySelectorAll(".gallery-item");
        gsap.fromTo(
          galleryItems,
          {
            opacity: 0,
            scale: 0.92,
            y: 24,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: galleryRef.current,
              scroller,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Documents - slide up
      if (documentsRef.current) {
        const docCards = documentsRef.current.querySelectorAll(".doc-card");
        gsap.fromTo(
          docCards,
          { opacity: 0, y: 40, x: -20 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: documentsRef.current,
              scroller,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // News cards - slide up
      if (newsRef.current) {
        const newsCards = newsRef.current.querySelectorAll(".news-card");
        gsap.fromTo(
          newsCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: newsRef.current,
              scroller,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Footer - fade in
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              scroller,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      return;
    },
    { dependencies: [animationComplete], revertOnUpdate: true },
  );

  if (!isVisible && !isOpen) return null;
  const hasTimeline = content.timeline.length > 0;
  const hasTeam = content.team.length > 0;
  const hasDocuments = content.documents.length > 0;
  const hasNews = Boolean(content.news?.length);
  const hasAircraft = Boolean(content.aircraft?.length);
  const hasRoles = Boolean(content.roles?.length);
  const hasMixedMedia =
    content.gallery.some((item) => item.type === "video") &&
    content.gallery.some((item) => item.type === "image");

  const modalContent = (
    <FocusTrap
      active={isVisible}
      focusTrapOptions={{
        initialFocus: () => closeButtonRef.current,
        escapeDeactivates: true,
        clickOutsideDeactivates: true,
        allowOutsideClick: true,
        returnFocusOnDeactivate: true,
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Operation details for ${location.name}`}
        className="fixed inset-0 z-[100] bg-gradient-to-br from-[#141e2d]/95 via-[#111a28]/95 to-[#0e1621]/95 overflow-y-auto"
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 lg:px-16 py-6 bg-gradient-to-b from-[#0e1621]/90 via-[#0e1621]/50 to-transparent"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary font-medium">
              <RadarIcon size={14} className="animate-pulse" />
              Operation Intel
            </div>
            <div className="w-px h-4 bg-primary/30" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
              {location.category}
            </span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close modal"
            className="p-3 rounded-full bg-white/10 hover:bg-accent/20 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-accent/40 backdrop-blur-sm hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="max-w-7xl mx-auto space-y-16 px-6 md:px-10 lg:px-16 pb-16"
        >
          {/* Hero Section */}
          <section
            ref={heroRef}
            className="relative h-[40vh] md:h-[50vh] lg:h-[55vh] rounded-2xl overflow-hidden border border-primary/20"
          >
            <img
              ref={heroImageRef}
              src={content.heroImage}
              alt={location.name}
              className="w-full h-[120%] object-cover"
              style={{ transform: "scale(1.3)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1621] via-[#0e1621]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e1621]/60 via-transparent to-transparent" />
            <div
              ref={heroContentRef}
              className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16"
            >
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-4"
              >
                {location.name}
              </h1>
              <p
                className="text-white/70 text-lg md:text-xl max-w-3xl leading-relaxed"
              >
                {location.description}
              </p>
            </div>
            {/* Play button overlay */}
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent/90 hover:bg-accent hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-lg shadow-accent/30">
              <Play size={36} className="text-white ml-1" fill="white" />
            </button>
          </section>

          {/* Overview */}
            <section ref={overviewRef} className="max-w-4xl">
            <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6">
              Mission Overview
            </h2>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed">
              {content.overview}
            </p>
          </section>

          {/* Stats Grid */}
          <section ref={statsRef}>
            <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6">
              Key Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {content.stats.map((stat, i) => (
                <div
                  key={i}
                  className="stat-card relative rounded-xl border border-primary/25 bg-primary/5 p-5 md:p-6 overflow-hidden group hover:border-primary/40 hover:bg-primary/10 transition-colors"
                >
                  <div className="absolute top-3 right-3">
                    {stat.trend === "up" && (
                      <ArrowUp size={16} className="text-green-400" />
                    )}
                    {stat.trend === "down" && (
                      <ArrowDown size={16} className="text-accent" />
                    )}
                    {stat.trend === "neutral" && (
                      <Minus size={16} className="text-white/40" />
                    )}
                  </div>
                  <div className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Aircraft */}
          {hasAircraft && (
            <section ref={aircraftRef}>
              <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                Aircraft
              </h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {content.aircraft?.map((aircraft, i) => (
                  <a
                    key={i}
                    href={aircraft.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aircraft-card rounded-xl border border-primary/20 bg-primary/5 p-5 hover:border-primary/40 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="relative h-32 rounded-lg overflow-hidden border border-primary/20 mb-4">
                      <img
                        src={aircraft.imageUrl}
                        alt={aircraft.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1621]/80 via-transparent to-transparent" />
                    </div>
                    <div className="text-white text-xl font-display font-semibold mb-2">
                      {aircraft.name}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                      {aircraft.role}
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                      {aircraft.summary}
                    </p>
                    <div className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-[0.2em] font-semibold">
                      Find Out More
                      <ChevronRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Related News Carousel */}
          {hasNews && (
            <section ref={newsRef}>
              <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6 flex items-center gap-2">
                <FileText size={14} />
                Related News
              </h2>
              <div
                className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
              >
                {content.news?.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-card snap-start min-w-[280px] md:min-w-[340px] rounded-xl border border-primary/20 bg-primary/5 p-5 hover:border-primary/40 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-primary/70 mb-2">
                      {item.source}
                    </div>
                    <div className="text-white font-medium leading-relaxed mb-4">
                      {item.title}
                    </div>
                    <div className="inline-flex items-center gap-2 text-accent text-xs uppercase tracking-[0.2em] font-semibold">
                      Open Article
                      <ChevronRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          <section ref={galleryRef}>
            <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6">
              {hasMixedMedia ? "Other Media" : "Gallery"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {content.gallery.map((item, i) => (
                <div
                  key={i}
                  className="gallery-item relative aspect-[4/3] rounded-xl overflow-hidden border border-primary/20 group cursor-pointer"
                >
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1621] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.type === "video" && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center">
                      <Play
                        size={20}
                        className="text-white ml-0.5"
                        fill="white"
                      />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <div className="text-xs text-white/90">{item.caption}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Roles */}
          {hasRoles && (
            <section ref={rolesRef}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">
                  Roles
                </h2>
                <a
                  href="https://recruitment.raf.mod.uk/roles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-semibold hover:text-white transition-colors"
                >
                  Explore RAF Careers
                  <ChevronRight size={14} />
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {content.roles?.map((role, i) => (
                  <a
                    key={i}
                    href={role.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="role-card rounded-xl border border-primary/20 bg-primary/5 p-4 md:p-5 hover:border-primary/40 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-primary/30 mx-auto mb-4">
                      <img
                        src={role.imageUrl}
                        alt={role.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center text-white/90 text-sm md:text-base font-medium leading-snug">
                      {role.name}
                    </div>
                    <div className="mt-3 inline-flex w-full items-center justify-center gap-1 text-[10px] uppercase tracking-[0.2em] text-primary/80 group-hover:text-primary transition-colors">
                      Find out more
                      <ChevronRight
                        size={12}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Timeline and Deployment */}
          {(hasTimeline || hasTeam) && (
            <div
              className={
                hasTimeline && hasTeam
                  ? "grid lg:grid-cols-2 gap-8 lg:gap-12"
                  : "space-y-8"
              }
            >
              {/* Timeline */}
              {hasTimeline && (
                <section ref={timelineRef}>
                  <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6 flex items-center gap-2">
                    <Calendar size={14} />
                    Operation Timeline
                  </h2>
                  <div className="space-y-4">
                    {content.timeline.map((event, i) => (
                      <div
                        key={i}
                        className="timeline-item relative pl-6 pb-4 last:pb-0"
                      >
                        {/* Timeline line */}
                        {i < content.timeline.length - 1 && (
                          <div
                            className="timeline-line absolute left-[7px] top-3 bottom-0 w-px bg-primary/30"
                            style={{
                              transform: "scaleY(0)",
                              transformOrigin: "top",
                            }}
                          />
                        )}
                        {/* Timeline dot */}
                        <div
                          className="timeline-dot absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-primary bg-[#141e2d]"
                        />
                        <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-1">
                          {event.date}
                        </div>
                        <div className="text-white font-medium mb-1">
                          {event.title}
                        </div>
                        <div className="text-white/60 text-sm leading-relaxed">
                          {event.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Team and Roles */}
              {hasTeam && (
                <section ref={teamRef}>
                  <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6 flex items-center gap-2">
                    <Users size={14} />
                    Deployment Details
                  </h2>
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.25em] text-primary/70 mb-3">
                      Who's Deployed
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {content.team.map((member, i) => (
                        <div
                          key={i}
                          className="deployed-card flex items-center gap-4 p-3 rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors"
                        >
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border border-primary/30"
                          />
                          <div>
                            <div className="text-white font-medium">
                              {member.name}
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-primary/70">
                              {member.role}
                            </div>
                          </div>
                          <ChevronRight
                            size={16}
                            className="ml-auto text-white/30"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Documents */}
          {hasDocuments && (
            <section ref={documentsRef}>
              <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6 flex items-center gap-2">
                <FileText size={14} />
                Documents
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {content.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="doc-card flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <FileText size={20} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">
                        {doc.title}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                        {doc.type} • {doc.size}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-white/30 group-hover:text-white/60 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Coordinates footer */}
            <section ref={footerRef} className="pt-8 mt-4 border-t border-primary/20">
            <div className="flex flex-wrap gap-8 text-sm">
              <div>
                <span className="uppercase tracking-[0.2em] text-primary/60">
                  Latitude
                </span>
                <span className="ml-2 font-mono text-white">
                  {location.latitude.toFixed(4)}° S
                </span>
              </div>
              <div>
                <span className="uppercase tracking-[0.2em] text-primary/60">
                  Longitude
                </span>
                <span className="ml-2 font-mono text-white">
                  {location.longitude.toFixed(4)}° E
                </span>
              </div>
              <div>
                <span className="uppercase tracking-[0.2em] text-primary/60">
                  Status
                </span>
                <span className="ml-2 text-green-400 font-medium">Active</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </FocusTrap>
  );

  return createPortal(modalContent, document.body);
}
