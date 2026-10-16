export const ACCOUNT_CONFIG = {
    EMAIL:{
        MIN:8,
        MAX:72,
        REGEX:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    PASSWORD:{
        MIN:8,
        MAX:72,
        MAX_BYTES:72
    },
    CODE:{
        MIN: 6,
        MAX:6,
        REGEX:/^(?!.*[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}\u200D\uFE0F\u20E3]).+$/u
    }
} as const