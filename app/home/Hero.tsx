"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MenuOverlay, Burger } from "./MenuOverlay";


gsap.registerPlugin(ScrollTrigger)
function FlowerMark({
    className,
    ref,
}: {
    className?: string;
    ref?: Ref<SVGSVGElement>;
}) {
    return (
        <svg ref={ref} viewBox="0 0 48 48" className={className} aria-hidden>
            <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <ellipse
                        key={deg}
                        cx="24"
                        cy="12"
                        rx="4.5"
                        ry="9"
                        transform={`rotate(${deg} 24 24)`}
                    />
                ))}
            </g>
            <circle cx="24" cy="24" r="4.5" fill="currentColor" />
        </svg>
    );
}

export default function Hero() {
    // Single elements get their own ref; groups of elements (letters, footer
    // items) are animated through scoped class selectors inside gsap.context.
    const rootRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const scrollCueRef = useRef<SVGSVGElement>(null);
    const markRef = useRef<SVGSVGElement>(null);
    // Overlay menu.
    const [menuOpen, setMenuOpen] = useState(false);

    // The three hero words.
    const yourRef = useRef<HTMLParagraphElement>(null);
    const perfumeRef = useRef<HTMLParagraphElement>(null);
    const agencyRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (
                reduce ||
                !bgRef.current ||
                !navRef.current ||
                !stripRef.current ||
                !yourRef.current ||
                !perfumeRef.current ||
                !agencyRef.current
            ) {
                return;
            }

            // Split each hero word into masked letters (each char gets an
            // overflow-hidden wrapper, so letters can "rise" into view).
            const your = SplitText.create(yourRef.current, { type: "chars", mask: "chars" });
            const perfume = SplitText.create(perfumeRef.current, { type: "chars", mask: "chars" });
            const agency = SplitText.create(agencyRef.current, { type: "chars", mask: "chars" });

            // --- Intro ------------------------------------------------------------
            gsap.set(bgRef.current, { scale: 1.25, filter: "brightness(0) grayscale(1)" });
            gsap.set(navRef.current, { yPercent: -140, opacity: 0 });
            gsap.set(stripRef.current, { clipPath: "inset(50% 0% 50% 0%)", opacity: 0 });
            gsap.set([...your.chars, ...perfume.chars, ...agency.chars], { yPercent: 120, rotate: 8, zIndex: 90 });
            gsap.set(".hero-footer-item", { y: 24, opacity: 0 });

            // Intro timeline. The last argument of each .to() is the START TIME
            // in seconds (absolute, from the very beginning of the timeline).
            // To retune the sequence: edit the number, and if you change a
            // duration remember later ones won't shift automatically.
            //
            //   0.0 — background video zooms out
            //   0.4 — nav slides down
            //   0.8 — YOUR rises
            //   1.6 — video strip opens out
            //   2.0 — PERFUME rises
            //   2.4 — AGENCY rises
            //   3.0 — footer items + scroll cue appear
            //
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
            tl
                // background video: fades in from black while slowly zooming out
                //  .to(bgRef.current, { scale: 1.08, filter: "brightness(0.38) grayscale(0.55)", duration: 1.6 }, 0)
                // nav slides down
                .to(navRef.current, { yPercent: 0, opacity: 1, duration: 0.9 }, 0.4)
                // YOUR
                .to(your.chars, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.045 }, 0.8)
                // video strip reveals + PERFUME
                .to(stripRef.current, { opacity: 1, duration: 0.01 }, 1.6)
                .to(stripRef.current, { clipPath: "inset(-10% -2% -10% -2%)", duration: 0.8, ease: "power3.inOut" }, 1.6)
                .to(perfume.chars, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.05 }, 2.0)
                // AGENCY
                .to(agency.chars, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.045 }, 2.4)
                // footer / scroll cue
                .to(".hero-footer-item", { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, 3.0);

            // --- Idle loops ---------------------------------------------------------
            if (scrollCueRef.current) {
                gsap.to(scrollCueRef.current, {
                    yPercent: 45,
                    opacity: 0.2,
                    duration: 1.1,
                    ease: "power1.inOut",
                    repeat: -1,
                    yoyo: true,
                });
            }

            if (markRef.current) {
                gsap.to(markRef.current, {
                    rotate: 45,
                    duration: 2.4,
                    ease: "none",
                    repeat: -1,
                });
            }

            // --- Scroll: hero pins in place while the strip expands, then releases ---
            gsap.to(stripRef.current, {

                width: "100vw",
                height: "100vh",
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: rootRef.current,   // pin the whole hero section
                    start: "top top",           // progress begins the moment you start scrolling
                    end: "+=100%",              // unlock after one viewport-height of scrolling
                    pin: true,                  // hero locked while this plays
                    scrub: 0.3,                 // animation follows the scrollbar (0.3s catch-up)
                    anticipatePin: 1,           // pre-pin one frame early so there's no jump

                },
            });

            // --- Mouse parallax -----------------------------------------------------
            const xTo = gsap.quickTo(bgRef.current, "xPercent", { duration: 1.2, ease: "power3" });
            const yTo = gsap.quickTo(bgRef.current, "yPercent", { duration: 1.2, ease: "power3" });
            const onMove = (e: MouseEvent) => {
                xTo((e.clientX / window.innerWidth - 0.5) * 2.4);
                yTo((e.clientY / window.innerHeight - 0.5) * 1.6);
            };
            window.addEventListener("mousemove", onMove);

            return () => {
                window.removeEventListener("mousemove", onMove);
            };
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-black text-white">
            {/* Background video (placeholder — swap in public/videos) */}
            <div
                ref={bgRef}
                className="absolute inset-0 h-full w-full object-cover will-change-transform"
                // src="/videos/hero-bg.webm"
                // autoPlay
                // muted
                // loop
                // playsInline
                aria-hidden
            ></div>
            {/* vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7)_100%)]" />

            {/* Nav */}
            <header ref={navRef} className="absolute inset-x-0 top-6 z-30 flex justify-center">
                <div className="relative">
                    <FlowerMark ref={markRef} className="absolute -left-9 -top-6 h-14 w-14 text-accent" />
                    <nav className="flex h-14 w-[min(78vw,380px)] items-center justify-between rounded-lg bg-black/90 px-8 backdrop-blur">
                        <Link href="/" className="text-2xl font-black italic tracking-wide">
                            ROS<span className="text-white/70">Æ</span>
                        </Link>
                        <Burger open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
                    </nav>
                </div>
            </header>

            {/* Center block */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1">
                <h1 className="sr-only">Your Perfume Agency</h1>

                {/* Word 1 — YOUR */}
                <p
                    ref={yourRef}
                    className="m-0  text-[clamp(4rem,13vw,11rem)] font-extralight 
                    leading-none tracking-wider"
                >
                    YOUR
                </p>

                {/* Video strip with word 2 on top */}
                <div className="relative my-1 flex items-center justify-center">
                    <div ref={stripRef} className="h-[clamp(6rem,15vw,10rem)] w-[min(88vw,660px)] overflow-hidden">
                        <video
                        
                            className="h-full w-full object-cover"
                            src="https://media.emmanverse.uk/hero.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            aria-hidden
                        />
                    </div>

                    {/* Word 2 — PERFUME */}
                    <p
                        ref={perfumeRef}
                        className="pointer-events-none w-max absolute m-0 font-black italic leading-none text-accent [text-shadow:0_6px_18px_rgba(0,0,0,0.55)] text-[clamp(3.6rem,10.5vw,9rem)]"
                    >
                        PERFUME
                    </p>
                </div>

                {/* Word 3 — AGENCY */}
                <p
                    ref={agencyRef}
                    className="-mt-3 m-0 text-[clamp(4rem,13vw,11rem)] font-extralight leading-none tracking-[0.05em]"
                >
                    SHOP
                </p>
            </div>

            {/* Bottom row */}
            <footer className="absolute inset-x-0 bottom-5 z-30 flex items-end justify-between px-6 text-sm md:px-10">
                <div className="hero-footer-item flex flex-wrap items-center gap-x-4 gap-y-1">
                    <a href="/shop" className="font-medium tracking-wide text-accent hover:opacity-80">
                        LOS ANGELES <span className="text-white/50">|</span> NEW YORK
                    </a>
                    <span className="text-accent">ROSÆ PROJECTS © All Rights Reserved</span>
                </div>

                <a
                    href="/contact"
                    className="hero-footer-item rounded-lg bg-white px-5 py-2.5 font-semibold italic text-black transition-transform hover:scale-105"
                >
                    Get in Touch
                </a>
            </footer>

            {/* Scroll cue */}
            <div className="hero-footer-item absolute inset-x-0 bottom-6 z-20 flex justify-center">
                <svg
                    ref={scrollCueRef}
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Overlay menu — shared, opens from the burger at top-center */}
            <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
        </section>
    );
}
