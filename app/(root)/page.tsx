"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function IntroPage() {
    const router = useRouter();

    const onStart = () => {
        router.push("/displayer");
    };

    return (
        <main className="flex flex-col h-screen items-center justify-center gap-4 pb-20">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Google Font Displayer</h1>
            <span className="text-neutral-400">By Roy Barzilay</span>
            <Button className="font-bold w-96 mt-6" size="lg" variant="outline" onClick={onStart}>
                START
            </Button>
        </main>
    );
}
