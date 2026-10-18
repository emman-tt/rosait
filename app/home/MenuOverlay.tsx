"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

// Shared full-screen overlay menu — open it from any page with its own
// burger button. The circle unfurls from the burger corner (top-center).
const LINKS = [
    { label: "HOME", href: "/home" },
    { label: "THE SHOP", href: "/shop" },
    { label: "OUR HERITAGE", href: "/heritage" },
    { label: "CONTACT", href: "/contact" },
];

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;

        if (open) {
            gsap.set(menu, { display: "block" });
            gsap.fromTo(
                menu,
                { clipPath: "circle(0% at 50% 0%)" },
                { clipPath: "circle(140% at 50% 0%)", duration: 0.8, ease: "power3.inOut" }
            );
            gsap.fromTo(
                menu.querySelectorAll(".menu-link"),
                { yPercent: 120, opacity: 0 },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: "power3.out",
                    stagger: 0.07,
                    delay: 0.3,
                }
            );
            document.body.style.overflow = "hidden"; // lock the page behind the menu
        } else {
            gsap.to(menu, {
                clipPath: "circle(0% at 50% 0%)",
                duration: 0.6,
                ease: "power3.inOut",
                onComplete: () => {
                    menu.style.display = "none";
                },
            });
            document.body.style.overflow = "";
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed inset-0 z-50 hidden bg-black/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
        >
            <nav className="flex h-full flex-col items-center justify-center gap-2">
                <span className="menu-mask mb-6 block overflow-hidden">
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">
                        MENU
                    </span>
                </span>
                {LINKS.map((item) => (
                    <span key={item.label} className="menu-mask block overflow-hidden">
                        <Link
                            href={item.href}
                            onClick={onClose}
                            className="menu-link block px-8 py-2 text-[clamp(2.2rem,6vw,4.5rem)] font-black uppercase leading-[1.05] tracking-tight text-white transition-colors hover:text-[#ff5ca8]"
                        >
                            {item.label}
                        </Link>
                    </span>
                ))}

                <p className="mt-14 font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
                    ROSÆ — PERFUMES CRAFTED LIKE CAMPAIGNS
                </p>
            </nav>
        </div>
    );
}

// The burger button itself (animates between two bars and an X).
export function Burger({
    open,
    onClick,
    className = "",
}: {
    open: boolean;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={onClick}
            className={`relative z-[60] flex h-9 w-7 flex-col items-center justify-center gap-1.5 p-1 ${className}`}
        >
            <span
                className={`block h-0.5 w-7 bg-white transition-transform duration-300 ${
                    open ? "translate-y-[3.5px] rotate-45" : ""
                }`}
            />
            <span
                className={`block h-0.5 w-7 bg-white transition-transform duration-300 ${
                    open ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
            />
        </button>
    );
}
