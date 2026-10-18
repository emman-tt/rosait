"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { TopBar } from "../home/TopBar";
import { BagDrawer, type CartItem } from "./Bag";
import { BRANDS, PRODUCTS, type Product } from "../home/product-data";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

// Filter options — edit labels here.
const CATEGORY_TABS = [
    { id: "all", label: "ALL" },
    { id: "men", label: "MEN" },
    { id: "women", label: "WOMEN" },
    { id: "unisex", label: "UNISEX" },
] as const;

const SORTS: Record<SortKey, string> = {
    featured: "Featured",
    "price-asc": "Price: low to high",
    "price-desc": "Price: high to low",
    name: "Name: A to Z",
};

export default function Shop() {
    const gridRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLSpanElement>(null);

    const [category, setCategory] = useState<(typeof CATEGORY_TABS)[number]["id"]>("all");
    const [brand, setBrand] = useState("all");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<SortKey>("featured");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [bagOpen, setBagOpen] = useState(false);
    const bagCount = cart.reduce((n, item) => n + item.qty, 0);

    // Restore the bag from localStorage on load, persist on every change.
    useEffect(() => {
        try {
            const saved = window.localStorage.getItem("rosae-bag");
            if (saved) setCart(JSON.parse(saved));
        } catch {
            // corrupted storage — start with an empty bag
        }
    }, []);
    useEffect(() => {
        try {
            window.localStorage.setItem("rosae-bag", JSON.stringify(cart));
        } catch {
            // storage unavailable — bag just lives in memory
        }
    }, [cart]);

    const changeQty = (name: string, delta: number) =>
        setCart((b) =>
            b
                .map((item) => (item.name === name ? { ...item, qty: item.qty + delta } : item))
                .filter((item) => item.qty > 0)
        );
    const removeItem = (name: string) => setCart((b) => b.filter((item) => item.name !== name));

    const filtered = useMemo(() => {
        const list = PRODUCTS.filter((p) => {
            if (category !== "all" && p.category !== category) return false;
            if (brand !== "all" && p.brand !== brand) return false;
            if (query && !p.name.toLowerCase().includes(query.toLowerCase().trim())) return false;
            return true;
        });
        switch (sort) {
            case "price-asc":
                return [...list].sort((a, b) => a.price - b.price);
            case "price-desc":
                return [...list].sort((a, b) => b.price - a.price);
            case "name":
                return [...list].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return list;
        }
    }, [category, brand, query, sort]);

    const countFor = (id: string) =>
        id === "all"
            ? PRODUCTS.length
            : PRODUCTS.filter((p) => p.category === id).length;

    const resultCount =
        category !== "all" || brand !== "all" || query
            ? ` — ${filtered.length} result${filtered.length === 1 ? "" : "s"}`
            : "";

    // Grid re-animates whenever the filtered set changes; also covers first load.
    useEffect(() => {
        gsap.fromTo(
            ".shop-card",
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.05 }
        );
    }, [filtered]);

    // Header band intro.
    useEffect(() => {
        gsap.from(".shop-band-in", {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
        });
    }, []);

    const addToBag = (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCart((b) =>
            b.some((item) => item.name === product.name)
                ? b.map((item) => (item.name === product.name ? { ...item, qty: item.qty + 1 } : item))
                : [...b, { name: product.name, qty: 1 }]
        );
        gsap.fromTo(
            e.currentTarget,
            { scale: 0.85 },
            { scale: 1, duration: 0.4, ease: "back.out(3)" }
        );
        if (badgeRef.current) {
            gsap.fromTo(badgeRef.current, { scale: 1.5 }, { scale: 1, duration: 0.35, ease: "power2.out" });
        }
    };

    return (
        <main className="min-h-svh bg-[#f6f3f0] text-black">
            {/* Header band — just the logo row, the title and the count line */}
            <section className="relative bg-black px-6 pt-4 pb-8 text-white">
                <div className="mx-auto max-w-[1500px]">
                    <TopBar
                        right={
                            <button
                                onClick={() => setBagOpen(true)}
                                className="relative rounded-lg bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/20"
                            >
                                Bag
                                <span
                                    ref={badgeRef}
                                    className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff5ca8] px-1 text-[10px] text-black"
                                >
                                    {bagCount}
                                </span>
                            </button>
                        }
                    />
                </div>

                <div className="mx-auto mt-4 max-w-[1500px]">
                    <h1 className="overflow-hidden">
                        <span className="shop-band-in block text-[clamp(3rem,9vw,8.5rem)] font-black uppercase leading-[0.9] tracking-tight">
                            THE SHOP
                        </span>
                    </h1>
                    <p className="shop-band-in mt-2 max-w-md text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                        {PRODUCTS.length} scents in the cabinet{resultCount || ""}
                    </p>
                </div>
            </section>

            {/* Sticky filter bar */}
            <div className="sticky top-0 z-20 border-b border-black/10 bg-[#f6f3f0]/95 py-3 backdrop-blur">
                <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 sm:px-6 lg:px-10">
                    {/* Category chips */}
                    <div className="flex flex-wrap gap-1.5">
                        {CATEGORY_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setCategory(tab.id)}
                                className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${category === tab.id
                                    ? "bg-black text-white"
                                    : "bg-black/5 text-black/70 hover:bg-black/10"
                                    }`}
                            >
                                {tab.label} <span className="opacity-50">{countFor(tab.id)}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search + brand + sort */}
                    <div className="ml-auto flex flex-wrap items-center gap-3">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search scents…"
                            aria-label="Search products"
                            className="h-10 w-44 rounded-full border border-black/15 bg-white px-4 text-sm placeholder:text-black/35 focus:border-[#ff5ca8] focus:outline-none"
                        />
                        <select
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            aria-label="Filter by brand"
                            className="h-10 rounded-full border border-black/15 bg-white px-4 text-xs font-bold uppercase tracking-wide focus:border-[#ff5ca8] focus:outline-none"
                        >
                            <option value="all">All brands</option>
                            {BRANDS.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortKey)}
                            aria-label="Sort products"
                            className="h-10 rounded-full border border-black/15 bg-white px-4 text-xs font-bold uppercase tracking-wide focus:border-[#ff5ca8] focus:outline-none"
                        >
                            {Object.entries(SORTS).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Product grid */}
            <div ref={gridRef} className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-10">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-24 text-center">
                        <p className="text-lg font-bold uppercase tracking-wide">No scents match those filters</p>
                        <button
                            onClick={() => {
                                setCategory("all");
                                setBrand("all");
                                setQuery("");
                            }}
                            className="rounded-full bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                        {filtered.map((product) => (
                            <div key={product.name} className="shop-card group">
                                <Link
                                    href="/shop"
                                    className="relative block aspect-square overflow-hidden rounded-2xl bg-[#e9e2dd]"
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        unoptimized
                                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                    />
                                </Link>
                                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                                    {product.brand}
                                </p>
                                <p className="mt-0.5 text-sm font-semibold uppercase leading-snug tracking-wide">
                                    {product.name}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm font-bold">GH₵{product.price.toLocaleString()}</span>
                                    <button
                                        onClick={(e) => addToBag(product, e)}
                                        className="rounded-full bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#ff5ca8] hover:text-black"
                                    >
                                        + Bag
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BagDrawer
                open={bagOpen}
                onClose={() => setBagOpen(false)}
                items={cart}
                onQty={changeQty}
                onRemove={removeItem}
            />
        </main>
    );
}
