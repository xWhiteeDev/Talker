import type React from 'react';
import FlexContainer from '../../../../Components/FlexContainer/FlexContainer';
import ContentList from './ContentList/ContentList';
import type { IPost } from '../../../../../types/components/IPost';

interface IFeedLayoutProps {
  setPosts: React.Dispatch<React.SetStateAction<IPost[] | undefined>>;
  posts: IPost[] | undefined
}

export default function FeedLayout(props: IFeedLayoutProps) {
  return (
    <FlexContainer
      width="100%"
      height="98%"
      backgroundColor="white"
      justifyContent="flex-start"
      borderRadius="10px"
      direction="row"
    >
      <FlexContainer width="65%" height="auto" direction="column">
        <ContentList setPosts={props.setPosts} posts={props.posts} />
      </FlexContainer>
      <FlexContainer borderLeft="1px solid gray" width="25%" height="100%" backgroundColor="transparent"></FlexContainer>
    </FlexContainer>
  );
}
