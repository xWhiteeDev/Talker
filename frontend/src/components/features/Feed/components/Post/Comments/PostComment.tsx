import style from "./PostComment.module.css";
import unk_person from "../../../../../../assets/unk_person.png";
import Reaction from "../../Reaction/Reaction";
import CustomText from "../../../../../generic/UI/Text/Text";
interface PostCommentProps {
  avatar: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  onFocus():void
}

export function PostComment({
  avatar,
  authorName,
  content,
  createdAt,
  onFocus
}: PostCommentProps) {
  return (
    <div className={style.postCommentContainer}>
      <div className={style.postCommentContent} style={{cursor:'pointer'}} onClick={()=>onFocus()}>
        <UserInfo
          avatar={avatar ?? null}
          authorName={authorName}
          createdAt={createdAt}
        />
        <span>{content}</span>
      </div>
      <div className={style.postCommentReactions}>
        <Reaction
          name="love"
          count={0}
          isActive={false}
          onReactionAdd={() => {}}
        />
        <Reaction
          name="like"
          count={0}
          isActive={false}
          onReactionAdd={() => {}}
        />
        <Reaction
          name="wow"
          count={0}
          isActive={false}
          onReactionAdd={() => {}}
        />
      </div>
      <div className={style.commentToComment}>
        <CustomText text="5 Responses to that comment" additionalStyle={{fontSize:'1.2rem'}}/>
      </div>
    </div>
  );
}

interface UserPostInfoProps {
  avatar: string | null;
  authorName: string;
  createdAt: string;
}

export default function UserInfo(user: UserPostInfoProps) {
  return (
    <div className={style.user}>
      <div className={style.userAvatar}>
        <img
          src={user.avatar ?? unk_person}
          className={style.avatar}
          alt="user avatar"
        />
      </div>
      <div className={style.postInfo}>
        <span style={{ fontWeight: "600" }}>{user.authorName}</span>
        <span>{new Date(user.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
