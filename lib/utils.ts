import { DisplayerAttributes } from "@/components/displayer";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as colorDiff from "color-diff";

const WIDTH_SIZE = [50, 800];
const HEIGHT_SIZE = [25, 400];
const FONT_SIZE = [14, 36];

function getRandomColor(): colorDiff.RGBColor {
    const base = Math.floor(Math.random() * 256); // Base value for gray level
    const variation = 0; // Maximum variation from the base value

    // Ensure each RGB component is within the range [base - variation, base + variation]
    const r = Math.min(
        255,
        Math.max(0, base + Math.floor((Math.random() - 0.5) * variation * 2))
    );
    const g = Math.min(
        255,
        Math.max(0, base + Math.floor((Math.random() - 0.5) * variation * 2))
    );
    const b = Math.min(
        255,
        Math.max(0, base + Math.floor((Math.random() - 0.5) * variation * 2))
    );

    return { R: r, G: g, B: b };
}

function colorDistance(
    color1: colorDiff.RGBColor,
    color2: colorDiff.RGBColor
): number {
    const lab1 = colorDiff.rgb_to_lab(color1);
    const lab2 = colorDiff.rgb_to_lab(color2);
    return colorDiff.diff(lab1, lab2);
}

function getDistinctRandomColors(
    threshold: number = 30
): [colorDiff.RGBColor, colorDiff.RGBColor] {
    let color1 = getRandomColor();
    let color2 = getRandomColor();

    while (colorDistance(color1, color2) < threshold) {
        color2 = getRandomColor();
    }

    return [color1, color2];
}

export function getRandomAttributes(content: string): DisplayerAttributes {
    const containerWidth = Math.floor(
        Math.random() * (WIDTH_SIZE[1] - WIDTH_SIZE[0] + 1) + WIDTH_SIZE[0]
    );
    const containerHeight = Math.floor(
        Math.random() * (HEIGHT_SIZE[1] - HEIGHT_SIZE[0] + 1) + HEIGHT_SIZE[0]
    );
    const textTop = Math.floor(
        (Math.random() - 0.2) * (containerHeight * 0.4 + 1)
    );
    const textLeft = Math.floor(
        (Math.random() - 0.2) * (containerWidth * 0.4 + 1)
    );
    const fontSize = Math.floor(
        Math.random() * (FONT_SIZE[1] - FONT_SIZE[0] + 1) + FONT_SIZE[0]
    );
    const [backgroundColor, textColor] = getDistinctRandomColors();

    return {
        container: {
            width: containerWidth,
            height: containerHeight,
            background: `rgba(${Object.values(backgroundColor).join(",")})`,
        },
        text: {
            content,
            top: textTop,
            left: textLeft,
            fontSize: `${fontSize}pt`,
            color: `rgba(${Object.values(textColor).join(",")})`,
        },
    };
}

export function changeDynamicFont(fontUrl: string) {
    const styleId = "dynamic-font-face";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }

    const fontFace = `
        @font-face {
            font-family: 'DynamicFont';
            src: url('${fontUrl}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
    `;
    styleElement.innerHTML = fontFace;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
