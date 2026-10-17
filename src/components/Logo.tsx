import Image from "next/image";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
    return (
        <Link href="#acasa" className={`flex flex-col leading-none ${className ?? ""}`}>
            <span className="font-serif text-3xl italic text-gold">GJ</span>
            <span className="text-[0.6rem] uppercase tracking-[0.35em] text-primary-foreground/70">
                Nail Studio
            </span>
        </Link>

    )
}