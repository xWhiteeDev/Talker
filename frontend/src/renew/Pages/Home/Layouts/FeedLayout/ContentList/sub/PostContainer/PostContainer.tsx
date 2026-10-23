import type { IPost } from '../../../../../../../../types/components/IPost';
import {debugAvatar} from '../../../../../../../Assets/debug';
import FlexContainer from '../../../../../../../Components/FlexContainer/FlexContainer';
import Post from '../../../../../../../Components/Post/Post';

interface IPostContainer {
  posts: IPost[] | undefined;
}

export default function PostContainer(props: IPostContainer) {
  
  return (
    <FlexContainer width="100%" height="100%" direction="column">
      {props.posts &&
        props.posts.map((p) => (
          <Post
          key={p.id}
            width="100%"
            height="auto"
            authorName={p.fullName}
            text={p.text}
            addedAt={p.created_at}
            for={p.visible_for}
            avatarUrl={debugAvatar}
          />
        ))}
    </FlexContainer>
  );
}
