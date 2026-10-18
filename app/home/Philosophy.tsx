"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger);

// Edit the copy here — the animation splits it into words automatically.
const KICKER = "OUR PHILOSOPHY";
const STATEMENT = "SCENT IS THE MEMORY YOU WEAR";
const STATS = ["150+ BRANDS", "1K+ SCENTS", "WORLDWIDE SHIPPING"];

export default function Philosophy() {
    const rootRef = useRef<HTMLElement>(null);
    const statementRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!rootRef.current || !statementRef.current) return;

            const split = SplitText.create(statementRef.current, { type: "words" });

            // Pinned scrub (seconds are proportions of the pinned distance):
            // words light up one by one, then the stat counters rise.
            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: "top top",
                    end: "+=120%",          // one screen + a fifth of scrolling, pinned
                    pin: true,
                    scrub: 0.6,
                    anticipatePin: 1,
                },
            });
            tl
                .fromTo(
                    split.words,
                    { opacity: 0.14 },
                    { opacity: 1, stagger: 0.08, duration: 0.6 }
                )
                .from(".phil-stat", { y: 34, opacity: 0, stagger: 0.1, duration: 0.35, ease: "power2.out" }, ">0.15");
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={rootRef}
            className="relative flex min-h-svh w-full flex-col items-center justify-center bg-[#0c0c0e] px-6 text-white"
            aria-label="Our philosophy"
        >
            <p className="mb-8 font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-white/50">
                {KICKER}
            </p>

            <h3
                ref={statementRef}
                className="max-w-[1300px] text-center text-[clamp(2.8rem,8vw,8rem)] font-black uppercase leading-[0.95] tracking-tight"
            >
                {STATEMENT}
            </h3>

            {/* Stats — explicit, edit freely */}
            <ul className="mt-14 flex flex-wrap items-start justify-center gap-x-12 gap-y-6">
                {STATS.map((stat) => (
                    <li key={stat} className="phil-stat flex flex-col items-center gap-1">
                        <span className="text-2xl font-black tracking-tight text-[#ff5ca8] sm:text-3xl">{stat}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
