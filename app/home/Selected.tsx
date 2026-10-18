"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "./product-data";

gsap.registerPlugin(ScrollTrigger);

export default function Selected() {
    const rootRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);
    const swirlRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!rootRef.current || !titleRef.current) return;

            // Reveal on scroll (numbered timeline, seconds from start)
            //
            //  0.0  — title rises out of its mask
            //  0.3  — cards stagger in (rows of four)
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
            });
            tl
                .from(titleRef.current, { yPercent: 110, duration: 1.0 }, 0)
                .from(".selected-card", { opacity: 0, y: 40, duration: 0.7, stagger: 0.07 }, 0.3);

            // Pink swirl draws itself as you scroll through the header zone.
            if (swirlRef.current) {
                const len = swirlRef.current.getTotalLength();
                gsap.set(swirlRef.current, { strokeDasharray: len, strokeDashoffset: len });
                gsap.to(swirlRef.current, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: rootRef.current,
                        start: "top 85%",
                        end: "top 35%",
                        scrub: true,
                    },
                });
            }
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={rootRef}
            className="relative w-full bg-[#f6f3f0] px-4 pt-24 pb-20 sm:px-6 lg:px-10"
            aria-label="Our selected products"
        >
            {/* Header */}
            <div className="relative mx-auto mb-16 max-w-[1500px]">
                {/* Pink swirl running through the title */}
                <svg
                    className="pointer-events-none absolute inset-x-0 top-1/2 h-[clamp(3rem,8vw,7rem)] w-full -translate-y-1/2"
                    viewBox="0 0 1200 100"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden
                >
                    <path
                        ref={swirlRef}
                        d="M0 60 C 120 100, 200 0, 340 50 S 520 110, 660 55 S 840 -5, 980 60 S 1120 95, 1200 45"
                        stroke="#ff5ca8"
                        strokeWidth="7"
                        strokeLinecap="round"
                    />
                </svg>

                <h2 className="relative z-10 overflow-hidden">
                    <span
                        ref={titleRef}
                        className="block text-center text-[clamp(2.6rem,7vw,6.5rem)] font-black uppercase leading-[0.95] tracking-tight text-black"
                    >
                        OUR SELECTED
                    </span>
                </h2>
            </div>

            {/* Rows of four */}
            <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
                {PRODUCTS.map((product, i) => (
                    <Link
                        key={product.name}
                        href="/shop"
                        className="selected-card group block"
                        aria-label={product.name}
                    >
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#e9e2dd]">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                unoptimized
                                sizes="(min-width: 768px) 25vw, 50vw"
                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                            <span className="num-by-image absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-black">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold uppercase leading-snug tracking-wide text-black transition-opacity group-hover:opacity-60">
                            {product.name}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
