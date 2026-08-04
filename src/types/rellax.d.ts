declare module 'rellax' {
    interface RellaxOptions {
        breakpoints?: [number, number, number];
        center?: boolean;
        horizontal?: boolean;
        relativeToWrapper?: boolean;
        round?: boolean;
        speed?: number;
        vertical?: boolean;
        wrapper?: HTMLElement | null;
    }

    export default class Rellax {
        constructor(selector: string | HTMLElement, options?: RellaxOptions);
        destroy(): void;
        refresh(): void;
    }
}
