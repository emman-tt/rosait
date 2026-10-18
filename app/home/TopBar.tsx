"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Burger, MenuOverlay } from "./MenuOverlay";

// Shared dark-band top row: back pill, logo, optional right slot, burger.
// Owns its own menu state, so pages just drop it in at the top of the band.
export function TopBar({ right }: { right?: ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/home"
                        className="rounded-full bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-[#ff5ca8] hover:text-black"
                    >
                        ← Back
                    </Link>
                    <Link href="/home" className="text-2xl font-black italic">
                        ROS<span className="text-white/70">Æ</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    {right}
                    <Burger open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
                </div>
            </header>

            <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
}
