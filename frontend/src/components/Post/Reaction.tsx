import style from "./PostReactions.module.css";
import type { ReactionComponent, ReactionUnion } from "./types";

const reactionsEmoji: Record<ReactionUnion, string> = {
  love: "❤️",
  like: "👍",
  wow: "😮",
  wrr: "😠",
  sad: "😭",
};

export default function Reaction({
  name,
  count,
  isActive,
  onReactionAdd,
}: ReactionComponent) {
  return (
    <div
      className={style.reaction}
      style={{ opacity: isActive ? 1 : 0.5 }}
      onClick={() => onReactionAdd(name)}
    >
      <span>{reactionsEmoji[name]}</span>
      <span style={{ fontWeight: "600" }}>
        {count >= 1000 ? Math.floor(count / 1000) + "k" : count}
      </span>
    </div>
  );
}
