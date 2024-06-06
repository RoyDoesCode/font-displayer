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
    return (
        <div id="font-displayer" className="relative" style={{ ...container }}>
            <span
                className="absolute"
                style={{
                    ...text,
                    fontFamily: "DynamicFont",
                    filter: "saturate(0)",
                }}
            >
                {text.content}
            </span>
        </div>
    );
};

export default Displayer;
