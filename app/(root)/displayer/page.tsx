"use client";

import { LogOut, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { clearIntervalAsync, setIntervalAsync } from "set-interval-async";

import Displayer from "@/components/displayer";
import { Button } from "@/components/ui/button";
import useFonts from "@/hooks/useFonts";

const TICK_DURATION = 50;

export default function DisplayerPage() {
    const router = useRouter();
    const { playing, fetchFonts, nextFont, currentFont, fontIteration, play, pause, attributes } = useFonts();

    const PlayIcon = useMemo(() => (playing ? Pause : Play), [playing]);

    useEffect(() => {
        if (!playing) return;

        const interval = setIntervalAsync(nextFont, TICK_DURATION);

        return () => {
            clearIntervalAsync(interval);
        };
    }, [playing]);

    useEffect(() => {
        fetchFonts();
    }, []);

    return (
        <div className="h-screen">
            <div className="absolute flex justify-between items-center w-full p-4">
                <Button variant="outline" size="icon" onClick={playing ? pause : play}>
                    <PlayIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                    {currentFont?.name} : {fontIteration}
                </span>
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
