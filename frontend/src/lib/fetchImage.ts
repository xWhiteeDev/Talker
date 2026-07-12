import type { ViteModule } from "./types";

export async function fetchImage(imageName: string): Promise<string | undefined> {
    const images = import.meta.glob<ViteModule>(['../assets/**/*.png', '../assets/**/*.jpeg', '../assets/**/*.jpg', '../assets/**/*.svg']);
    const img = Object.keys(images).find(image => {
        const lastIndex: number = image.lastIndexOf('/');
        const fileName = image.slice(lastIndex + 1);
        if (fileName == imageName) return true

    })
    if (img == undefined) {
        return undefined
    }
    const correctImage = await images[img]()
    return correctImage.default

}
