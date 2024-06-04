"use client";

import React, { useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";
import useFonts from "@/hooks/useFonts";

export interface DisplayerAttributes {
    container: {
        width: number;
        height: number;
        background: string;
    };
    text: {
        content: string;
        top: number;
        left: number;
        fontSize: string;
        color: string;
    };
}

const Displayer: React.FC<DisplayerAttributes> = ({ container, text }) => {
    const { fontIteration, currentFont, addToZip, zip } = useFonts();
    const screenshotArea = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!screenshotArea.current || !currentFont) return;

        const image = await htmlToImage.toJpeg(screenshotArea.current);
        addToZip(currentFont.family, `${currentFont.name}${fontIteration}.jpg`, image);
    };

    useEffect(() => {
        handleDownload();
    }, [fontIteration]);

    return (
        <div ref={screenshotArea} className="relative" style={{ ...container }}>
            <span className="absolute" style={{ ...text, fontFamily: "DynamicFont" }}>
                {text.content}
            </span>
        </div>
    );
};

export default Displayer;
