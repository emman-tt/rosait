"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { PRODUCTS } from "../home/product-data";

// One line in the bag: the product name + how many.
export type CartItem = { name: string; qty: number };

const fmt = (n: number) => `GH₵${n.toLocaleString()}`;

export function BagDrawer({
    open,
    onClose,
    items,
    onQty,
    onRemove,
}: {
    open: boolean;
    onClose: () => void;
    items: CartItem[];
    onQty: (name: string, delta: number) => void;
    onRemove: (name: string) => void;
}) {
    const scrimRef = useRef<HTMLDivElement>(null);
    const drawerRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const prevLen = useRef(0);

    const priceOf = (name: string) => PRODUCTS.find((p) => p.name === name)?.price ?? 0;
    const imgOf = (name: string) => PRODUCTS.find((p) => p.name === name)?.image ?? "";
    const subtotal = items.reduce((sum, item) => sum + priceOf(item.name) * item.qty, 0);

    // Slide in / out.
    useEffect(() => {
        const scrim = scrimRef.current;
        const drawer = drawerRef.current;
        if (!scrim || !drawer) return;

        if (open) {
            gsap.set([scrim, drawer], { display: "block" });
            gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
            gsap.fromTo(
                drawer,
                { xPercent: 105 },
                { xPercent: 0, duration: 0.6, ease: "power3.out" }
            );
            // Bag opens on an empty state: no rows yet — skip the row stagger.
            const rows = drawer.querySelectorAll(".bag-row");
            if (rows.length > 0) {
                gsap.fromTo(
                    rows,
                    { opacity: 0, y: 18 },
                    { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.06, delay: 0.2 }
                );
            }
            document.body.style.overflow = "hidden"; // lock the page behind the bag
        } else {
            gsap.to(scrim, { opacity: 0, duration: 0.35, ease: "power2.in" });
            gsap.to(drawer, {
                xPercent: 105,
                duration: 0.5,
                ease: "power3.in",
                onComplete: () => {
                    gsap.set([scrim, drawer], { display: "none" });
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

    // When something is added while the bag is open, pop the new row in.
    useEffect(() => {
        if (!open) {
            prevLen.current = items.length;
            return;
        }
        if (items.length > prevLen.current) {
            const name = items[items.length - 1]?.name ?? "";
            const row = listRef.current?.querySelector(`[data-bag-row="${CSS.escape(name)}"]`);
            if (row) {
                gsap.fromTo(row, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
            }
        }
        prevLen.current = items.length;
    }, [items, open]);

    return (
        <>
            {/* Scrim */}
            <div
                ref={scrimRef}
                onClick={onClose}
                className="fixed inset-0 z-[70] hidden bg-black/50 backdrop-blur-[2px]"
                aria-hidden
            />

            {/* Drawer */}
            <aside
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping bag"
                className="fixed inset-y-0 right-0 z-[80] hidden w-full max-w-[420px] flex-col bg-[#f6f3f0] text-black shadow-2xl"
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <p className="text-2xl font-black uppercase tracking-tight">
                        Your bag{" "}
                        <span className="align-middle text-xs font-bold tracking-widest text-black/40">
                            ({items.reduce((n, i) => n + i.qty, 0)})
                        </span>
                    </p>
                    <button
                        aria-label="Close bag"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 transition-colors hover:border-[#ff5ca8] hover:bg-[#ff5ca8] hover:text-black"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden>
                            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Rows / empty state */}
                <div ref={listRef} className="flex-1 overflow-y-auto px-6">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                            <svg viewBox="0 0 48 48" className="h-12 w-12 text-black/25" aria-hidden>
                                <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                        <ellipse key={deg} cx="24" cy="12" rx="4" ry="8" transform={`rotate(${deg} 24 24)`} />
                                    ))}
                                </g>
                            </svg>
                            <p className="text-sm font-black uppercase tracking-widest">Your bag is empty</p>
                            <p className="max-w-[240px] text-xs uppercase tracking-widest text-black/40">
                                Fill it with something that smells like a campaign
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-2 rounded-full bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#ff5ca8] hover:text-black"
                            >
                                Browse the shop
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.name}
                                data-bag-row={item.name}
                                className="bag-row relative flex gap-4 border-b border-black/10 py-5 pr-6"
                            >
                                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#e9e2dd]">
                                    <Image src={imgOf(item.name)} alt={item.name} fill unoptimized sizes="80px" className="object-cover" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
                                        {PRODUCTS.find((p) => p.name === item.name)?.brand}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs font-semibold uppercase tracking-wide">
                                        {item.name}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between">
                                        {/* Stepper */}
                                        <div className="flex items-center rounded-full border border-black/15">
                                            <button
                                                aria-label={`Decrease quantity of ${item.name}`}
                                                onClick={() => onQty(item.name, -1)}
                                                className="h-7 w-7 rounded-full text-sm font-bold transition-colors hover:bg-black hover:text-white"
                                            >
                                                −
                                            </button>
                                            <span className="w-7 text-center text-xs font-bold">{item.qty}</span>
                                            <button
                                                aria-label={`Increase quantity of ${item.name}`}
                                                onClick={() => onQty(item.name, 1)}
                                                className="h-7 w-7 rounded-full text-sm font-bold transition-colors hover:bg-black hover:text-white"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-sm font-bold">{fmt(priceOf(item.name) * item.qty)}</span>
                                    </div>
                                </div>

                                {/* Remove */}
                                <button
                                    aria-label={`Remove ${item.name} from bag`}
                                    onClick={() => onRemove(item.name)}
                                    className="absolute right-0 top-5 text-black/30 transition-colors hover:text-[#ff5ca8]"
                                >
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden>
                                        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Totals */}
                {items.length > 0 && (
                    <div className="border-t border-black/10 px-6 py-5">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span>{fmt(subtotal)}</span>
                        </div>
                        <button className="mt-4 w-full rounded-lg bg-black py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-colors hover:bg-[#ff5ca8] hover:text-black">
                            Checkout — {fmt(subtotal)}
                        </button>
                        <p className="mt-2 text-center text-[9px] uppercase tracking-[0.25em] text-black/40">
                            Shipping &amp; duties calculated at checkout
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
}
