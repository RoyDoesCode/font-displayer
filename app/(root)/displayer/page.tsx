"use client";

import { LogOut, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { clearIntervalAsync, setIntervalAsync } from "set-interval-async";

import Displayer, { DisplayerAttributes } from "@/components/displayer";
import { Button } from "@/components/ui/button";
import useFonts from "@/hooks/useFonts";
import { getRandomAttributes } from "@/lib/utils";

const TICK_DURATION = 1000;
const IMAGES_PER_FONT = 5;

export default function DisplayerPage() {
    const router = useRouter();
    const { fetchFonts, nextFont, currentFont } = useFonts();

    const [attributes, setAttributes] = useState<DisplayerAttributes>();
    const [tick, setTick] = useState(0);
    const [playing, setPlaying] = useState(false);

    const PlayIcon = useMemo(() => (playing ? Pause : Play), [playing]);

    useEffect(() => {
        if (!playing) return;

        const update = async () => {
            const attributes = await getRandomAttributes();
            setAttributes(attributes);
            setTick((prevTick) => prevTick + 1);

            if (tick !== 0 && tick % IMAGES_PER_FONT === 0) {
                nextFont();
            }
        };

        const interval = setIntervalAsync(update, TICK_DURATION);

        return () => {
            clearIntervalAsync(interval);
        };
    }, [playing, tick]);

    useEffect(() => {
        fetchFonts();
    }, []);

    return (
        <div className="h-screen">
            <div className="absolute flex justify-between w-full p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setPlaying((prev) => !prev)}>
                        <PlayIcon className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-light text-neutral-300">Iteration: {tick}</span>
                </div>
                <span>{currentFont?.name}</span>
                <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex h-full items-center justify-center">
                {attributes && (
                    <div className="border border-white border-dashed p-1">
                        <Displayer {...attributes} />
                    </div>
                )}
            </div>
        </div>
    );
}
