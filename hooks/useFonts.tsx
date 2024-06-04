import { changeDynamicFont } from "@/lib/utils";
import { create } from "zustand";

const API_KEY = "AIzaSyDAkj8hcupmG7ZKl83rz-Z0gqHiCf8vcbk";

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
    fontIndex: number;
    currentFont: Font | undefined;
    fonts: Font[];
    fetchFonts: () => Promise<void>;
    nextFont: () => void;
}

const useFonts = create<useFontsStore>((set) => ({
    fontIndex: 0,
    currentFont: undefined,
    fonts: [],
    fetchFonts: async () => {
        const fonts: Font[] = [];
        const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`);
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

        const currentFont = fonts[0];
        changeDynamicFont(currentFont.file);

        set({ fonts, currentFont });
    },
    nextFont: () => {
        set((state) => {
            let newIndex = state.fontIndex + 1;
            if (newIndex >= state.fonts.length) newIndex = 0;

            const currentFont = state.fonts[newIndex];
            changeDynamicFont(currentFont.file);

            return { fontIndex: newIndex, currentFont };
        });
    },
}));

export default useFonts;
