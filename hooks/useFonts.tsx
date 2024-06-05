import FileSaver from "file-saver";
import * as htmlToImage from "html-to-image";
import JSZip from "jszip";
import { create } from "zustand";

import { DisplayerAttributes } from "@/components/displayer";
import { changeDynamicFont, getRandomAttributes } from "@/lib/utils";

const API_KEY = "AIzaSyDAkj8hcupmG7ZKl83rz-Z0gqHiCf8vcbk";
const IMAGES_PER_FONT = 500;

type FontStyle = "regular" | "italic";
type FontWeight = 100 | 200 | 300 | 500 | 600 | 700 | 800 | 900;
type FontVariant = `${FontWeight | ""}${FontStyle}`;

export type FontApi = {
    family: string;
    variants: FontVariant[];
    files: Record<FontVariant, string>;
    category: string;
};

export type Font = {
    name: string;
    family: string;
    variant: FontVariant;
    file: string;
    category: string;
};

interface useFontsStore {
    playing: boolean;
    fontIteration: number;
    currentFont: Font | undefined;
    fonts: Font[];
    quotes: string[];
    attributes: DisplayerAttributes | undefined;
    zip: Record<string, Record<string, string>>;
    fetchFonts: () => Promise<void>;
    nextFont: () => void;
    play: () => void;
    pause: () => void;
    addToZip: () => Promise<void>;
}

const useFonts = create<useFontsStore>((set) => ({
    playing: false,
    fontIteration: 0,
    currentFont: undefined,
    fonts: [],
    quotes: [],
    attributes: undefined,
    zip: {},
    fetchFonts: async () => {
        const fonts: Font[] = [];
        const res = await fetch(
            `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`
        );
        const data = (await res.json()).items as FontApi[];

        for (const font of data) {
            for (const variant of font.variants) {
                fonts.push({
                    name: `${font.family} ${variant}`,
                    family: font.family,
                    variant,
                    file: font.files[variant],
                    category: font.category,
                });
            }
        }
        console.log(fonts);

        const quotesRes = await fetch(
            "https://api.quotable.io/quotes?limit=150"
        );
        const quotes = (await quotesRes.json()).results.map(
            (item: any) => item.content
        );
        const content = quotes[Math.floor(Math.random() * quotes.length)];

        const lsFont = localStorage.getItem("currentFont");
        const currentFont =
            fonts.find((item) => item.family === lsFont) ?? fonts[0];
        const attributes = getRandomAttributes(content);
        changeDynamicFont(currentFont.file);

        localStorage.setItem("currentFont", currentFont.family);
        set({ fonts, quotes, currentFont, attributes });
    },
    nextFont: () => {
        set((state) => {
            if (Object.keys(state.zip).length > 10) {
                downloadZip(set, true);
                return {};
            }

            const content =
                state.quotes[Math.floor(Math.random() * state.quotes.length)];
            const attributes = getRandomAttributes(content);

            let iteration = state.fontIteration + 1;
            if (iteration >= IMAGES_PER_FONT) {
                iteration = 0;

                const currIndex = state.fonts.findIndex(
                    (item) => state.currentFont?.name === item.name
                );
                const newFont = state.fonts[currIndex + 1];
                if (!newFont) {
                    downloadZip(set);
                    return {};
                }

                changeDynamicFont(newFont.file);
                localStorage.setItem("currentFont", newFont.family);

                return {
                    fontIteration: iteration,
                    currentFont: newFont,
                    attributes,
                };
            }
            return { fontIteration: iteration, attributes };
        });
    },
    play: () => set({ playing: true }),
    pause: () => downloadZip(set),
    addToZip: async () => {
        const displayer = document.getElementById("font-displayer");
        const image = await htmlToImage.toJpeg(displayer!);
        set(({ zip, currentFont, fontIteration }) => {
            if (!currentFont) return {};
            return {
                zip: {
                    ...zip,
                    [currentFont.family]: {
                        ...zip[currentFont.family],
                        [`${currentFont.name}${fontIteration}.jpg`]: image,
                    },
                },
            };
        });
    },
}));

export default useFonts;

const downloadZip = (
    set: (
        partial:
            | useFontsStore
            | Partial<useFontsStore>
            | ((
                  state: useFontsStore
              ) => useFontsStore | Partial<useFontsStore>),
        replace?: boolean | undefined
    ) => void,
    play?: boolean
) => {
    const zip = new JSZip();

    set((state) => {
        if (state.currentFont) delete state.zip[state.currentFont.family];
        for (const [family, data] of Object.entries(state.zip)) {
            for (const fileName in data) {
                const image = data[fileName].split(",")[1]; // Remove the data URL prefix
                zip.folder(family)?.file(fileName, image, { base64: true });
            }
        }
        return { playing: false, zip: {} };
    });

    zip.generateAsync({ type: "blob" })
        .then((content) => {
            FileSaver.saveAs(content, "images.zip");
            console.log("images.zip written successfully");
            if (play) set({ playing: true });
        })
        .catch((err) => console.error("Error generating zip file:", err));
};
