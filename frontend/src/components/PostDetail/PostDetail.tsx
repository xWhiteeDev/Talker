import { useParams } from "react-router-dom";
import style from "./PostDetail.module.css";
import Button from "../Button/Button";
import type { PostDetails } from "./types";
import { useEffect, useState } from "react";
import { useAPI } from "../../hooks/useAPI";
import UserPostInfo from "../Post/extra/User/User";
import Comment from "./comments/Comment";
import EditableTextArea from "../EditableTextArea/EditableTextArea";
import CustomText from "../Text/Text";
export function PostDetail() {
  const { postid } = useParams();
  const [postDetails, setPostDetails] = useState<PostDetails>();
  const [postComments, setPostComments] = useState<any[]>();
  const [comment, setCommentValue] = useState<string | undefined>(undefined);
  const { request } = useAPI();

  useEffect(() => {
    request<PostDetails>(`/api/posts/${postid}`, "GET").then((res) => {
      if (res?.success && res.data && Object.keys(res.data).length > 0) {
        setPostDetails(res.data);
      }
    });
  }, []);

  async function handleSendComment() {
    if (!comment || comment.length === 0) return;
    if (!postid) return;
    request("/api/comments", "POST", {
      postId: parseInt(postid),
      parentId: null,
      content: comment,
    })
      .then((response) => {
        if (response?.success) {
          console.log("Comment added");
        } else {
          console.log("Comment adding fault");
        }
      })
      .catch((err) => console.error(`Unexpected error: ${err}`));
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Button text="X" />
      </div>
      <div className={style.author}>
        {postDetails && (
          <UserPostInfo
            authorName={postDetails.fullName}
            avatar={null}
            visibility={postDetails.visibleFor}
            createdAt={postDetails.created_at}
          />
        )}
      </div>
      <div className={style.content}>{postDetails?.content}</div>
      <div className={style.comments}>
        <div className={style.addComment}>
          <EditableTextArea
            placeholder="+ Add comment"
            placeholderFontSize="1.2rem"
            onInput={(text) => setCommentValue(text)}
            additionalStyle={{ height: "100%", fontSize: "1.2rem" }}
          />
          <div className={style.commentFooter}>
            <Button
              text="Send"
              isDisabled={comment && comment.length > 150 ? true : false}
              additionalStyle={{
                width: "10%",
                background: "#e2e2e2",
                borderRadius: "15%",
                fontWeight: 400,
                fontSize: "1rem",
                border: "1px solid white",
              }}
              onClick={async () => await handleSendComment()}
            />
            <span
              style={{
                color: comment && comment.length > 150 ? "red" : "black",
              }}
            >
              {comment ? comment.length : 0}/150
            </span>
          </div>
        </div>
        {postDetails &&
          postDetails.comments  ?
          postDetails.comments.map((v) => (
            <Comment
              authorName={v.fullName}
              content={v.content}
              createdAt={v.createdAt}
              avatar={null}
            />
          )) : <CustomText text="Nobody wrote any comments"/>}
      </div>
    </div>
  );
}
