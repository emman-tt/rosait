"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopBar } from "../home/TopBar";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// Edit the copy here.
const TITLE = "OUR HERITAGE";
const SUB = "ACCRA — EST. 2019";
const STATEMENT =
    "ROSÆ started with a stubborn idea: a perfume should be marketed like a film — storyboarded, scored, and premiered, not just shelved.";

const TIMELINE = [
    {
        year: "2019",
        title: "First batch",
        text: "Forty bottles blended on a kitchen counter. Gone in one weekend at a pop-up in Osu.",
    },
    {
        year: "2021",
        title: "The cabinet",
        text: "Our first physical cabinet opened — a dark room, pink neon, nine brands on one shelf.",
    },
    {
        year: "2023",
        title: "The agency",
        text: "People stopped asking what we sold and started asking how we told it. The campaign became the product.",
    },
    {
        year: "2026",
        title: "Today",
        text: "Eleven scents in the cabinet, thousands of wrists kissed, one accent colour.",
    },
];

const PILLARS = [
    {
        n: "01",
        title: "Craft",
        text: "Small batches, blended and bottled in Accra. Nothing sits in a warehouse waiting for a season.",
    },
    {
        n: "02",
        title: "Sourcing",
        text: "We buy direct — from the big maisons and from independent noses nobody has heard of yet.",
    },
    {
        n: "03",
        title: "Staging",
        text: "Every bottle shoots like a campaign before it ships. The story sells the scent.",
    },
];

export default function Heritage() {
    const rootRef = useRef<HTMLElement>(null);
    const statementRef = useRef<HTMLParagraphElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const pillarsRef = useRef<HTMLElement>(null);
    const ctaRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!rootRef.current) return;

            // Scroll running order (seconds from each trigger)
            //
            //  BAND      0.0 — title rises out of its mask
            //            0.3 — subline
            //  STORY     scrub — statement reveals word by word
            //  TIMELINE  scrub — pink line draws down; rows stagger in at 75%
            //  PILLARS   scroll — pillar rows rise one by one
            //  CTA       scroll — closing link

            // Band intro
            const band = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: { trigger: rootRef.current, start: "top 90%" },
            });
            band
                .from(".her-band-in", { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.15 }, 0);

            // Statement — word by word, scrubbed like the homepage philosophy
            if (statementRef.current) {
                gsap.fromTo(
                    ".her-word",
                    { opacity: 0.12 },
                    {
                        opacity: 1,
                        ease: "none",
                        stagger: 0.04,
                        scrollTrigger: {
                            trigger: statementRef.current,
                            start: "top 80%",
                            end: "top 30%",
                            scrub: 0.4,
                        },
                    }
                );
            }

            // Timeline — the pink line draws as you scroll the block
            if (timelineRef.current) {
                gsap.fromTo(
                    ".her-line-fill",
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: timelineRef.current,
                            start: "top 65%",
                            end: "bottom 70%",
                            scrub: 0.3,
                        },
                    }
                );
            }
            gsap.from(".her-tl-row", {
                opacity: 0,
                y: 34,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: { trigger: timelineRef.current, start: "top 75%" },
            });

            // Pillars
            gsap.from(".her-pillar", {
                opacity: 0,
                y: 30,
                duration: 0.65,
                ease: "power3.out",
                stagger: 0.14,
                scrollTrigger: { trigger: pillarsRef.current, start: "top 78%" },
            });

            // Closing CTA
            gsap.from(".her-cta-in", {
                yPercent: 110,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: { trigger: ctaRef.current, start: "top 80%" },
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <main className="min-h-svh bg-[#f6f3f0] text-black">
            {/* Header band */}
            <section ref={rootRef} className="relative bg-black px-6 pt-4 pb-8 text-white">
                <div className="mx-auto max-w-[1500px]">
                    <TopBar />
                </div>
                <div className="mx-auto mt-4 max-w-[1500px]">
                    <h1 className="overflow-hidden">
                        <span className="her-band-in block text-[clamp(3rem,9vw,8.5rem)] font-black uppercase leading-[0.9] tracking-tight">
                            {TITLE}
                        </span>
                    </h1>
                    <p className="her-band-in mt-2 max-w-md text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                        {SUB}
                    </p>
                </div>
            </section>

            {/* Statement */}
            <section className="px-6 py-24 sm:py-32">
                <p
                    ref={statementRef}
                    className="mx-auto max-w-[1100px] text-[clamp(1.6rem,3.6vw,3.2rem)] font-black uppercase leading-[1.15] tracking-tight"
                >
                    {STATEMENT.split(" ").map((word, i) => (
                        <span key={i} className="her-word mr-[0.26em] inline-block">
                            {word}
                        </span>
                    ))}
                </p>
            </section>

            {/* Timeline */}
            <section className="px-6 pb-24">
                <div ref={timelineRef} className="relative mx-auto max-w-[1100px] pl-10">
                    {/* Rail */}
                    <div className="absolute bottom-2 left-0 top-2 w-px bg-black/10">
                        <div className="her-line-fill h-full w-full origin-top bg-[#ff5ca8]" />
                    </div>

                    {TIMELINE.map((entry) => (
                        <div key={entry.year} className="her-tl-row relative pb-16 last:pb-0">
                            {/* Marker dot on the rail */}
                            <span className="absolute -left-[46px] top-3 block h-3 w-3 rounded-full border-2 border-[#f6f3f0] bg-[#ff5ca8]" />

                            <p
                                className="text-[clamp(2.6rem,6vw,5.5rem)] font-black leading-none text-transparent"
                                style={{ WebkitTextStroke: "2px rgba(0,0,0,0.35)" }}
                            >
                                {entry.year}
                            </p>
                            <p className="mt-2 text-sm font-black uppercase tracking-[0.25em]">
                                {entry.title}
                            </p>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">
                                {entry.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pillars */}
            <section ref={pillarsRef} className="her-pillars px-6 pb-28">
                <div className="mx-auto max-w-[1100px]">
                    {PILLARS.map((pillar) => (
                        <div
                            key={pillar.n}
                            className="her-pillar group grid grid-cols-[auto_1fr] items-baseline gap-x-8 gap-y-2 border-t border-black/10 py-10 sm:grid-cols-[auto_auto_1fr]"
                        >
                            <span className="font-mono text-xs tracking-[0.3em] text-black/40">
                                {pillar.n}
                            </span>
                            <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-black uppercase tracking-tight transition-colors group-hover:text-[#ff5ca8]">
                                {pillar.title}
                            </h3>
                            <p className="col-span-2 max-w-xl text-sm leading-relaxed text-black/60 sm:col-span-1 sm:justify-self-end">
                                {pillar.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Closing CTA */}
            <section ref={ctaRef} className="her-cta bg-[#0c0c0e] px-6 py-24 text-center text-white">
                <div className="mx-auto max-w-[1100px] overflow-hidden">
                    <Link
                        href="/shop"
                        className="her-cta-in block text-[clamp(2rem,6.5vw,5.5rem)] font-black uppercase leading-[1.02] tracking-tight transition-colors hover:text-[#ff5ca8]"
                    >
                        Smell where it started ↗
                    </Link>
                </div>
                <p className="her-cta-in mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                    The cabinet is open — 11 scents, GH₵400 up
                </p>
            </section>
        </main>
    );
}
