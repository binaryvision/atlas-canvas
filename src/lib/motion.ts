export const motion = {
  ease: {
    inOut: "power2.inOut",
    out: "power3.out",
    in: "power3.in",
    softOut: "power2.out",
    softIn: "power2.in",
    elasticOut: "back.out(1.7)",
    pulse: "sine.inOut",
  },
  duration: {
    fast: 0.25,
    base: 0.5,
    slow: 0.8,
    zoom: 0.9,
    pulse: 1,
    kenBurns: 10,
  },
} as const;

