export const ACCOUNT_CONFIG = {
    EMAIL:{
        MIN:5,
        MAX:254,
        REGEX:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    PASSWORD:{
        MIN:5,
        MAX:254
    },
    CODE:{
        MIN: 6,
        MAX:6,
        REGEX:/^(?!.*[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}\u200D\uFE0F\u20E3]).+$/u
    }
} as const