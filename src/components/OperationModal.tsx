import { motion } from "@/lib/motion";
import type { ExpandedContent, Location } from "@shared/data";
import { useGSAP } from "@gsap/react";
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
  sourceRect: DOMRect | null;
}

export function OperationModal({
  location,
  content,
  isOpen,
  onClose,
  sourceRect,
}: OperationModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const documentsRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) onClose();
    },
    [onClose]
  );

  // Main entrance/exit animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimationComplete(false);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline({
        onComplete: () => setAnimationComplete(true),
      });

      // Dramatic backdrop entrance with blur ramp
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );

      // Modal morphs from source with elastic feel
      if (sourceRect && modalRef.current) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const startScaleX = sourceRect.width / viewportWidth;
        const startScaleY = sourceRect.height / viewportHeight;
        const startScale = Math.max(startScaleX, startScaleY);
        const startX = sourceRect.left + sourceRect.width / 2 - viewportWidth / 2;
        const startY = sourceRect.top + sourceRect.height / 2 - viewportHeight / 2;

        tl.fromTo(
          modalRef.current,
          {
            x: startX,
            y: startY,
            scale: startScale,
            opacity: 0,
            borderRadius: "24px",
            rotateX: 15,
            transformPerspective: 1200,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            borderRadius: "0px",
            rotateX: 0,
            duration: 0.9,
            ease: "expo.out",
          },
          0.1
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { scale: 0.8, opacity: 0, rotateX: 20, transformPerspective: 1200 },
          {
            scale: 1,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            ease: "expo.out",
          },
          0.1
        );
      }

      // Header slides down with bounce
      tl.fromTo(
        headerRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)" },
        0.4
      );

      // Hero section dramatic reveal
      tl.fromTo(
        heroRef.current,
        { scale: 1.1, opacity: 0, y: 60 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        0.5
      );

      // Hero image Ken Burns zoom
      tl.fromTo(
        heroImageRef.current,
        { scale: 1.3 },
        { scale: 1, duration: 2, ease: "power1.out" },
        0.5
      );

      // Hero content stagger in from left
      if (heroContentRef.current) {
        tl.fromTo(
          heroContentRef.current.children,
          { x: -80, opacity: 0, rotateY: -10 },
          {
            x: 0,
            opacity: 1,
            rotateY: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
          },
          0.7
        );
      }

      // Play button pop in
      tl.fromTo(
        ".hero-play-btn",
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" },
        0.9
      );

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    } else if (isVisible) {
      // Exit animation
      const tl = gsap.timeline({
        onComplete: () => {
          setIsVisible(false);
          setAnimationComplete(false);
          document.body.style.overflow = "";
          // Kill all ScrollTriggers for this modal
          ScrollTrigger.getAll().forEach((st) => st.kill());
        },
      });

      // Quick content fade
      tl.to(contentRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.3,
        ease: "power2.in",
      });

      // Modal shrinks back
      if (sourceRect && modalRef.current) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const startScaleX = sourceRect.width / viewportWidth;
        const startScaleY = sourceRect.height / viewportHeight;
        const startScale = Math.max(startScaleX, startScaleY);
        const startX = sourceRect.left + sourceRect.width / 2 - viewportWidth / 2;
        const startY = sourceRect.top + sourceRect.height / 2 - viewportHeight / 2;

        tl.to(
          modalRef.current,
          {
            x: startX,
            y: startY,
            scale: startScale,
            opacity: 0,
            borderRadius: "24px",
            rotateX: 10,
            duration: 0.5,
            ease: "power3.in",
          },
          0.15
        );
      } else {
        tl.to(
          modalRef.current,
          {
            scale: 0.9,
            opacity: 0,
            rotateX: 10,
            duration: 0.5,
            ease: "power3.in",
          },
          0.15
        );
      }

      tl.to(
        backdropRef.current,
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        0.2
      );
    }
  }, [isOpen, isVisible, handleEscape, sourceRect]);

  // Scroll-triggered animations
  useGSAP(
    () => {
      if (!animationComplete || !scrollContainerRef.current) return;

      const scroller = scrollContainerRef.current;

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
              toggleActions: "play none none reverse",
            },
          }
        );

        // Animate each word in the overview text
        const text = overviewRef.current.querySelector("p");
        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0.3 },
            {
              opacity: 1,
              duration: 1,
              ease: "power1.out",
              scrollTrigger: {
                trigger: text,
                scroller,
                start: "top 80%",
                end: "bottom 60%",
                scrub: 1,
              },
            }
          );
        }
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
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Timeline - draw in effect
      if (timelineRef.current) {
        const timelineItems = timelineRef.current.querySelectorAll(".timeline-item");
        const timelineDots = timelineRef.current.querySelectorAll(".timeline-dot");
        const timelineLines = timelineRef.current.querySelectorAll(".timeline-line");

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
              toggleActions: "play none none reverse",
            },
          }
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
              toggleActions: "play none none reverse",
            },
          }
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
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Team - slide in from right
      if (teamRef.current) {
        const teamCards = teamRef.current.querySelectorAll(".team-card");
        gsap.fromTo(
          teamCards,
          { opacity: 0, x: 60, rotateY: -15 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: teamRef.current,
              scroller,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Gallery - masonry-style reveal
      if (galleryRef.current) {
        const galleryItems = galleryRef.current.querySelectorAll(".gallery-item");
        gsap.fromTo(
          galleryItems,
          {
            opacity: 0,
            scale: 0.7,
            y: (i) => (i % 2 === 0 ? 60 : 100),
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: {
              each: 0.08,
              from: "random",
            },
            ease: "power3.out",
            scrollTrigger: {
              trigger: galleryRef.current,
              scroller,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
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
              toggleActions: "play none none reverse",
            },
          }
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
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Parallax effect on hero while scrolling
      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            scroller,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { dependencies: [animationComplete], revertOnUpdate: true }
  );

  if (!isVisible && !isOpen) return null;

  const modalContent = (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100]"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: "rgba(10, 18, 30, 0.6)",
        backdropFilter: "blur(12px)",
        opacity: 0,
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full h-full bg-gradient-to-br from-[#141e2d]/95 via-[#111a28]/95 to-[#0e1621]/95 overflow-hidden"
        style={{ transformStyle: "preserve-3d", opacity: 0 }}
      >
        {/* Decorative gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-80 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0e1621] to-transparent pointer-events-none z-10" />

        {/* Header */}
        <div
          ref={headerRef}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 lg:px-16 py-6 bg-gradient-to-b from-[#0e1621]/90 via-[#0e1621]/50 to-transparent"
          style={{ opacity: 0, transform: "translateY(-60px)" }}
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
            onClick={onClose}
            aria-label="Close modal"
            className="p-3 rounded-full bg-white/10 hover:bg-accent/20 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-accent/40 backdrop-blur-sm hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollContainerRef}
          className="relative z-10 h-full overflow-y-auto pt-24 pb-16 px-6 md:px-10 lg:px-16"
        >
          <div ref={contentRef} className="max-w-7xl mx-auto space-y-16">
            {/* Hero Section */}
            <section
              ref={heroRef}
              className="relative h-[40vh] md:h-[50vh] lg:h-[55vh] rounded-2xl overflow-hidden border border-primary/20"
              style={{ opacity: 0, transform: "scale(1.1) translateY(60px)" }}
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
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-4" style={{ opacity: 0, transform: "translateX(-80px)" }}>
                  {location.name}
                </h1>
                <p className="text-white/70 text-lg md:text-xl max-w-3xl leading-relaxed" style={{ opacity: 0, transform: "translateX(-80px)" }}>
                  {location.description}
                </p>
              </div>
              {/* Play button overlay */}
              <button className="hero-play-btn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent/90 hover:bg-accent hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-lg shadow-accent/30" style={{ transform: "translate(-50%, -50%) scale(0) rotate(-180deg)" }}>
                <Play size={36} className="text-white ml-1" fill="white" />
              </button>
            </section>

            {/* Overview */}
            <section ref={overviewRef} className="max-w-4xl" style={{ opacity: 0, transform: "translateY(60px)" }}>
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
                    style={{ transformStyle: "preserve-3d", opacity: 0, transform: "translateY(80px) scale(0.8) rotateX(20deg)" }}
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

            {/* Two Column: Timeline + Team */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Timeline */}
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
                      style={{ opacity: 0, transform: "translateX(-40px)" }}
                    >
                      {/* Timeline line */}
                      {i < content.timeline.length - 1 && (
                        <div className="timeline-line absolute left-[7px] top-3 bottom-0 w-px bg-primary/30" style={{ transform: "scaleY(0)", transformOrigin: "top" }} />
                      )}
                      {/* Timeline dot */}
                      <div className="timeline-dot absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-primary bg-[#141e2d]" style={{ opacity: 0, transform: "scale(0)" }} />
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

              {/* Team */}
              <section ref={teamRef}>
                <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6 flex items-center gap-2">
                  <Users size={14} />
                  Field Team
                </h2>
                <div className="space-y-3">
                  {content.team.map((member, i) => (
                    <div
                      key={i}
                      className="team-card flex items-center gap-4 p-3 rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors"
                      style={{ transformStyle: "preserve-3d", opacity: 0, transform: "translateX(60px) rotateY(-15deg)" }}
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
              </section>
            </div>

            {/* Gallery */}
            <section ref={galleryRef}>
              <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                Intelligence Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {content.gallery.map((item, i) => (
                  <div
                    key={i}
                    className="gallery-item relative aspect-[4/3] rounded-xl overflow-hidden border border-primary/20 group cursor-pointer"
                    style={{ opacity: 0, transform: `scale(0.7) translateY(${i % 2 === 0 ? 60 : 100}px)` }}
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

            {/* Documents */}
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
                    style={{ opacity: 0, transform: "translateY(40px) translateX(-20px)" }}
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

            {/* Coordinates footer */}
            <section ref={footerRef} className="pt-8 mt-4 border-t border-primary/20" style={{ opacity: 0, transform: "translateY(30px)" }}>
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
                  <span className="ml-2 text-green-400 font-medium">
                    Active
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
