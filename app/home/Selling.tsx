"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
// import perfumeVid from "../assets/perfume.mp4"

gsap.registerPlugin(ScrollTrigger);

import { PRODUCTS } from "./product-data";

// Products pulled from perfumegh.com Men's collection — now shared in
// ./product-data.ts so every section shows the same list.

// Rows shown in the brand list (edit here or point them back at PRODUCTS).
const ROWS = [
    { label: "DIOR", href: "/shop" },
    { label: "CHANEL", href: "/shop" },
    { label: "TOM FORD", href: "/shop" },
    { label: "CREED", href: "/shop" },
    { label: "GIORGIO ARMANI", href: "/shop" },
    { label: "YVES SAINT LAURENT", href: "/shop" },
];

export default function Selling() {
    const rootRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLSpanElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const imagePanelRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const mainImageRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    // SVG filter prims for the pixelate load effect.
    const floodRef = useRef<SVGFEFloodElement>(null);
    const compositeRef = useRef<SVGFECompositeElement>(null);
    const morphRef = useRef<SVGFEMorphologyElement>(null);

    const [active, setActive] = useState(0);

    // Soft crossfade whenever the highlighted product changes.
    useEffect(() => {
        if (!mainImageRef.current) return;
        gsap.fromTo(
            mainImageRef.current,
            { opacity: 0.35, scale: 1.03 },
            { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
        );
    }, [active]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (
                !rootRef.current ||
                !logoRef.current ||
                !panelRef.current ||
                !imagePanelRef.current ||
                !imageRef.current
            ) {
                return;
            }

            // --- Reveal on scroll (numbered timeline, seconds from start) -----------
            //
            //  0.0  — card slides into place
            //  0.15 — image panel wipes open
            //  0.2  — logo rises out of its mask
            //  0.45 — description text
            //  0.6  — brand rows stagger up
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
            });
            tl
                .from(panelRef.current, { yPercent: 6, opacity: 0, duration: 0.9 }, 0)
                .from(imagePanelRef.current, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.0, ease: "power3.inOut" }, 0.15)
                .from(logoRef.current, { yPercent: 100, duration: 1.0 }, 0.2)
                .from(".sell-desc", { opacity: 0, y: 14, duration: 0.6 }, 0.45)
                .from(".sell-row", { opacity: 0, y: 28, duration: 0.5, stagger: 0.08 }, 0.6);

            // --- Parallax on the product image while the section scrolls -----------
            gsap.fromTo(
                imageRef.current,
                { yPercent: -8 },
                {
                    yPercent: 8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: imagePanelRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                }
            );

            // --- Pixel + blur load effect on the video ------------------------------
            // A proxy object tweens the SVG filter's pixel block size from chunky
            // (50px) down to nothing while an extra blur fades away, so the video
            // "resolves into focus" the first time it enters the viewport.
            const video = videoRef.current;
            const flood = floodRef.current;
            const composite = compositeRef.current;
            const morph = morphRef.current;

            const runPixelLoad = () => {
                if (!video || !flood || !composite || !morph) return;
                const proxy = { b: 40, blur: 8 };
                const paint = () => {
                    const { b, blur } = proxy;
                    const s = Math.max(b, 0.01);
                    flood.setAttribute("x", `${s * 0.2}`);
                    flood.setAttribute("y", `${s * 0.2}`);
                    flood.setAttribute("width", `${s * 0.4}`);
                    flood.setAttribute("height", `${s * 0.4}`);
                    composite.setAttribute("width", `${s}`);
                    composite.setAttribute("height", `${s}`);
                    morph.setAttribute("radius", `${s * 0.5}`);
                    video.style.filter = `url(#pixelate-load) blur(${blur}px)`;
                };
                paint();
                gsap.to(proxy, {
                    b: 0.01,
                    blur: 0,
                    duration: 1.2,
                    ease: "power2.inOut",
                    onUpdate: paint,
                    onComplete: () => {
                        video.style.filter = "none"; // fully crisp once resolved
                    },
                });
            };

            ScrollTrigger.create({
                trigger: imagePanelRef.current,
                start: "top 45%",   // fires after the clip wipe has opened the panel
                once: true,
                onEnter: runPixelLoad,
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    // Thumbnails: first four products.
    const thumbs = PRODUCTS.slice(0, 4);

    return (
        <section
            ref={rootRef}
            className="relative flex min-h-svh w-full mt-50 items-center justify-center
              p-2 sm:p-4 lg:p-6"
            aria-label="Our brands"
        >
            {/* Pixelate filter used by the video's load animation (block pixel size is
                tweened by GSAP from chunky to tiny, then the filter is removed). */}
            <svg className="pointer-events-none absolute h-0 w-0" aria-hidden focusable="false">
                <defs>
                    <filter id="pixelate-load">
                        <feFlood ref={floodRef} x="10" y="10" width="20" height="20" />
                        <feComposite ref={compositeRef} width="50" height="50" />
                        <feTile result="grid" />
                        <feComposite in="SourceGraphic" in2="grid" operator="in" />
                        <feMorphology ref={morphRef} operator="dilate" radius="25" />
                    </filter>
                </defs>
            </svg>

            <div className="flex w-full max-w-375 flex-col overflow-hidden md:flex-row">
                {/* Left panel */}
                <div
                    ref={panelRef}
                    className="relative z-10 flex w-full flex-col px-6 pt-8 pb-6 sm:px-10 lg:px-14 lg:pt-12 lg:pb-8 md:w-[44%]"
                >
                    <h2 className="overflow-hidden">
                        <span
                            ref={logoRef}
                            className="sell-logo block text-[clamp(3.5rem,9vw,9rem)] font-black leading-[0.95] tracking-tight text-black"
                        >
                            ROSÆ
                        </span>
                    </h2>

                    <p className="sell-desc mx-auto mt-8 max-w-60 text-center text-[10px] font-semibold uppercase leading-relaxed tracking-widest text-black sm:text-[11px]">
                        Is a premium cosmetics and perfumes distribution company
                        headquartered in America
                    </p>

                    {/* Brand rows — explicit, edit freely */}
                    <ul className="mt-auto pt-16">
                        {ROWS.map((row, i) => (
                            <li
                                key={row.label}
                                className="sell-row flex items-center justify-between border-b border-black/10 py-3 text-sm font-semibold uppercase tracking-wide text-black"
                            >
                                <Link href={row.href} className="transition-opacity hover:opacity-60">
                                    {row.label}
                                </Link>
                                <span className="text-[10px] font-normal">{String(i + 1).padStart(2, "0")}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <Link
                        href="/shop"
                        className="mt-10 flex items-center gap-3 text-black transition-opacity hover:opacity-70"
                    >
                        <span className="text-[clamp(2rem,4.5vw,4.5rem)] font-black leading-none tracking-tight">MORE</span>
                        <span className="text-[9px] font-medium uppercase tracking-widest">
                            [ GO TO CATALOGUE ]
                        </span>
                        <span className="text-[clamp(2rem,4.5vw,4.5rem)] font-black leading-none tracking-tight">BRANDS</span>
                    </Link>
                </div>

                {/* Right panel — highlighted product + thumbnails */}
                <div
                    ref={imagePanelRef}
                    className="relative min-h-[70svh] flex-1 overflow-hidden rounded-2xl bg-[#e4c2b0] md:m-3 md:min-h-[92svh]"
                >
                    <div ref={imageRef} className="absolute inset-[-12%]">
                        <div ref={mainImageRef} className="absolute inset-0" key={active}>
                            <video
                                ref={videoRef}
                                src="videos/perfume.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="h-full w-full object-cover"
                                aria-label="Perfume product video"
                            />
                        </div>
                    </div>
            
                  

                    {/* Active product name */}
                    <p className="absolute inset-x-0 bottom-24 z-10 px-6 text-center text-xs font-semibold uppercase tracking-widest text-black/80 sm:bottom-28">
                        {PRODUCTS[active].name}
                    </p>
                </div>
            </div>
        </section>
    );
}
