"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Edit the copy here.
const TITLE = "GET THE FIRST SPRAY";
const SUB = "New drops, restocks, and rare finds — straight to your inbox.";
const SOCIALS = [
    { label: "INSTAGRAM", href: "#" },
    { label: "TIKTOK", href: "#" },
    { label: "X", href: "#" },
];

export default function Newsletter() {
    const rootRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!rootRef.current || !titleRef.current) return;

            // Reveal on scroll (numbered timeline, seconds from start)
            //
            //  0.0 — title rises out of its mask
            //  0.3 — subline
            //  0.5 — form bar + socials
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
            });
            tl
                .from(titleRef.current, { yPercent: 120, duration: 1.0 }, 0)
                .from(".nl-sub, .nl-form", { opacity: 0, y: 20, duration: 0.6, stagger: 0.2 }, 0.3)
                .from(".nl-social", { opacity: 0, y: 12, stagger: 0.08, duration: 0.4 }, 0.5);

            // The underline under the email input draws in.
            // (handled by the border scale-x on .nl-input via CSS below —
            // kept GSAP-free so typing stays buttery)
        }, rootRef);

        return () => ctx.revert();
    }, []);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!email || done) return;
        setDone(true);
        gsap.fromTo(
            ".nl-success",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
    };

    return (
        <section
            ref={rootRef}
            className="relative w-full bg-[#0c0c0e] px-6 pt-28 pb-24 text-white"
            aria-label="Newsletter"
        >
            <div className="mx-auto max-w-[1100px] text-center">
                <h3 className="overflow-hidden">
                    <span
                        ref={titleRef}
                        className="block text-[clamp(2.4rem,6vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight"
                    >
                        {TITLE}
                    </span>
                </h3>

                <p className="nl-sub mx-auto mt-6 max-w-md text-sm uppercase tracking-widest text-white/60">
                    {SUB}
                </p>

                {done ? (
                    <p className="nl-success mt-10 text-lg font-semibold text-[#ff5ca8]">
                        You're on the list — first spray coming. ✳
                    </p>
                ) : (
                    <form onSubmit={onSubmit} className="nl-form mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            aria-label="Email address"
                            className="h-14 flex-1 rounded-full border border-white/15 bg-white/5 px-6 text-sm text-white placeholder:text-white/30 focus:border-[#ff5ca8] focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="h-14 rounded-full bg-[#ff5ca8] px-8 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
                        >
                            Subscribe
                        </button>
                    </form>
                )}

                {/* Socials */}
                <ul className="mt-16 flex items-center justify-center gap-x-8 gap-y-3">
                    {SOCIALS.map((s) => (
                        <li key={s.label}>
                            <a
                                href={s.href}
                                className="nl-social font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/60 underline-offset-4 hover:text-[#ff5ca8] hover:underline"
                            >
                                {s.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
