"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopBar } from "../home/TopBar";

gsap.registerPlugin(ScrollTrigger);

// Edit the copy here.
const TITLE = "CONTACT";
const SUB = "TALK TO THE AGENCY";

const INFO = [
    { k: "EMAIL", v: "hello@rosae.gh", href: "mailto:hello@rosae.gh" },
    { k: "PHONE", v: "+233 55 000 0000", href: "tel:+233550000000" },
    { k: "SHOWROOM", v: "12 Ablade Lane, Osu — Accra", href: "#" },
    { k: "HOURS", v: "Mon – Sat, 10:00 – 19:00", href: "#" },
];

const SOCIALS = [
    { label: "INSTAGRAM", href: "#" },
    { label: "TIKTOK", href: "#" },
    { label: "X", href: "#" },
];

const TOPICS = ["General", "Wholesale", "Press", "Collab"];

export default function Contact() {
    const rootRef = useRef<HTMLElement>(null);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!rootRef.current) return;

            // Scroll running order (seconds from each trigger)
            //
            //  BAND   0.0 — title rises out of its mask
            //         0.3 — subline
            //  INFO   0.4 — info rows + socials
            //  FORM   0.6 — form fields stagger in

            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: { trigger: rootRef.current, start: "top 90%" },
            });
            tl
                .from(".ct-band-in", { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.15 }, 0)
                .from(".ct-info", { opacity: 0, y: 22, duration: 0.6, stagger: 0.09 }, 0.4)
                .from(".ct-field", { opacity: 0, y: 22, duration: 0.6, stagger: 0.09 }, 0.6);
        }, rootRef);

        return () => ctx.revert();
    }, []);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (sent) return;
        setSent(true);
        gsap.fromTo(
            ".ct-success",
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
    };

    return (
        <main ref={rootRef} className="min-h-svh bg-[#f6f3f0] text-black">
            {/* Header band */}
            <section className="relative bg-black px-6 pt-4 pb-8 text-white">
                <div className="mx-auto max-w-[1500px]">
                    <TopBar />
                </div>
                <div className="mx-auto mt-4 max-w-[1500px]">
                    <h1 className="overflow-hidden">
                        <span className="ct-band-in block text-[clamp(3rem,9vw,8.5rem)] font-black uppercase leading-[0.9] tracking-tight">
                            {TITLE}
                        </span>
                    </h1>
                    <p className="ct-band-in mt-2 max-w-md text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                        {SUB}
                    </p>
                </div>
            </section>

            {/* Info + form */}
            <section className="mx-auto grid max-w-[1500px] gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-24">
                {/* Info column */}
                <div>
                    {INFO.map((row) => (
                        <div
                            key={row.k}
                            className="ct-info grid grid-cols-[120px_1fr] items-baseline gap-4 border-t border-black/10 py-6"
                        >
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
                                {row.k}
                            </span>
                            {row.href === "#" ? (
                                <span className="text-sm font-semibold uppercase tracking-wide">{row.v}</span>
                            ) : (
                                <a
                                    href={row.href}
                                    className="text-sm font-semibold uppercase tracking-wide underline-offset-4 hover:text-[#ff5ca8] hover:underline"
                                >
                                    {row.v}
                                </a>
                            )}
                        </div>
                    ))}

                    <div className="ct-info mt-10 flex flex-wrap gap-x-8 gap-y-3">
                        {SOCIALS.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-black/50 underline-offset-4 hover:text-[#ff5ca8] hover:underline"
                            >
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Form column */}
                {sent ? (
                    <div className="ct-success flex flex-col items-start justify-center gap-4">
                        <p className="text-[clamp(1.6rem,3vw,2.4rem)] font-black uppercase leading-tight tracking-tight">
                            Message in the post ✳
                        </p>
                        <p className="max-w-sm text-sm uppercase tracking-widest text-black/50">
                            We reply within one working day — usually faster when the studio smells good.
                        </p>
                        <button
                            onClick={() => setSent(false)}
                            className="mt-4 rounded-full bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#ff5ca8] hover:text-black"
                        >
                            Write another
                        </button>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                        <div className="ct-field grid gap-6 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
                                    Name
                                </span>
                                <input
                                    required
                                    name="name"
                                    placeholder="Your name"
                                    className="h-14 w-full rounded-lg border border-black/15 bg-white px-5 text-sm placeholder:text-black/30 focus:border-[#ff5ca8] focus:outline-none"
                                />
                            </label>
                            <label className="block">
                                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
                                    Email
                                </span>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="you@email.com"
                                    className="h-14 w-full rounded-lg border border-black/15 bg-white px-5 text-sm placeholder:text-black/30 focus:border-[#ff5ca8] focus:outline-none"
                                />
                            </label>
                        </div>

                        <label className="ct-field block">
                            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
                                Topic
                            </span>
                            <select
                                name="topic"
                                className="h-14 w-full rounded-lg border border-black/15 bg-white px-5 text-sm focus:border-[#ff5ca8] focus:outline-none"
                            >
                                {TOPICS.map((topic) => (
                                    <option key={topic}>{topic}</option>
                                ))}
                            </select>
                        </label>

                        <label className="ct-field block">
                            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
                                Message
                            </span>
                            <textarea
                                required
                                name="message"
                                rows={6}
                                placeholder="Tell us what you're dreaming of…"
                                className="w-full resize-none rounded-lg border border-black/15 bg-white p-5 text-sm placeholder:text-black/30 focus:border-[#ff5ca8] focus:outline-none"
                            />
                        </label>

                        <button
                            type="submit"
                            className="ct-field rounded-lg bg-black py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-colors hover:bg-[#ff5ca8] hover:text-black"
                        >
                            Send it
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
}
