import type {ReactionUnion} from "../../../../../types/VisualUnions";
import style from "./Reaction.module.css";

 interface ReactionProps {
    name: ReactionUnion;
    count: number;
    isActive: boolean;
    onReactionAdd(name: string): void;

}
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
  onReactionAdd
}: ReactionProps) {
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
