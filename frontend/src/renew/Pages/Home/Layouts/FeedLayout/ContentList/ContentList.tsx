import type React from 'react';
import FlexContainer from '../../../../../Components/FlexContainer/FlexContainer';
import PostContainer from './sub/PostContainer/PostContainer';
import PostCreator from './sub/PostCreator/PostCreator';
import type { IPost } from '../../../../../../types/components/IPost';
import { usePosts } from '../../../../../../hooks/usePosts';
import { useEffect } from 'react';

interface IContentListProps {
  refresh: React.Dispatch<React.SetStateAction<IPost[] | undefined>>;
  posts: IPost[] | undefined;
}

export default function ContentList(props: IContentListProps) {
  const { refresh, latestPosts, clear } = usePosts();
  useEffect(() => {
    (async () => {
      if (!latestPosts || latestPosts.length === 0) {
        await refresh();
      }
    })();
    return () => clear();
  }, []);
  return (
    <FlexContainer width="100%" height="100%" alignItems="center" justifyContent="flex-start" direction="column" overflowY="auto">
      <PostCreator refresh={refresh} />
      <PostContainer posts={latestPosts} />
    </FlexContainer>
  );
}
