export default function Emoji({ emoji }: { emoji: string }) {
    return (
        <span
            style={{
                fontFamily: 'Noto Color Emoji',
            }}
        >
            {emoji}
        </span>
    );
}
