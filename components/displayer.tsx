"use client";

import React from "react";

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
        <div className="relative" style={{ ...container }}>
            <span className="absolute" style={{ ...text, fontFamily: "DynamicFont" }}>
                {text.content}
            </span>
        </div>
    );
};

export default Displayer;
