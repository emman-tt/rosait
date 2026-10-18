"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Edit the brands here — the track renders them and animates its own
// seamlessness (content duplicated once, xPercent -50 loops perfectly).
const BRANDS = [
    "DIOR",
    "CHANEL",
    "TOM FORD",
    "CREED",
    "GIORGIO ARMANI",
    "YVES SAINT LAURENT",
    "PACO RABANNE",
    "VERSACE",
];

export default function BrandsMarquee() {
    const rootRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!rootRef.current || !trackRef.current) return;

            // Endless loop of the track.
            const loop = gsap.to(trackRef.current, {
                xPercent: -50,   // track holds 2 copies, so -50% = one seamless copy
                duration: 22,
                ease: "none",
                repeat: -1,
            });

            // Scroll velocity reacts: scrolling fast spins it faster,
            // scrolling up reverses the direction.
            ScrollTrigger.create({
                trigger: rootRef.current,
                start: "top bottom",
                end: "bottom top",
                onUpdate: (self) => {
                    const v = self.getVelocity();
                    const speed = gsap.utils.clamp(0.5, 5, 1 + Math.abs(v) / 2500);
                    gsap.to(loop, {
                        timeScale: (v < 0 ? -1 : 1) * speed,
                        duration: 0.4,
                        overwrite: true,
                    });
                    gsap.to(loop, { timeScale: 1, duration: 1.5, delay: 0.5, overwrite: false });
                },
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    // Two copies = one seamless track.
    const track = [...BRANDS, ...BRANDS];

    return (
        <section
            ref={rootRef}
            className="w-full overflow-hidden bg-[#ff5ca8] py-5"
            aria-label="Brands we stock"
        >
            <div ref={trackRef} className="flex w-max items-center gap-10 pr-10 will-change-transform">
                {track.map((brand, i) => (
                    <span key={`${brand}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
                        <span className="text-[clamp(1.4rem,3vw,3rem)] font-black uppercase leading-none tracking-tight text-black">
                            {brand}
                        </span>
                        <span className="text-[clamp(0.9rem,2vw,1.6rem)] font-bold text-black/70" aria-hidden>
                            ✳
                        </span>
                    </span>
                ))}
            </div>
        </section>
    );
}
