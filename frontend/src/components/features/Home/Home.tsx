import { useEffect, useRef, useState } from 'react';
import style from './Home.module.css';
import Logo from '../../generic/UI/Logo/Logo';
import { useAPI } from '../../../hooks/useAPI';
import { usePosts } from '../../../hooks/usePosts';
import { PostCreator } from '../Feed/components/PostCreator/PostCreator';
import { Loading } from '../../generic/UI/Loading/Loading';
import { Activity } from '../Feed/components/Activity/Activity';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import OptionLayer from './components/OptionLayer/OptionLayer';
import FriendsLayer from './components/FriendsLayer/FriendsLayer';
import SearchLayer from './components/SearchLayer/SearchLayer';
import type { IOptionList } from './components/OptionLayer/types';
import useNotify from '../../../hooks/useNotify';

export default function Home() {
  const [postText, setPostText] = useState<string | undefined>(undefined);
  const [visibility, setVisibility] = useState<string | undefined>(undefined);
  const { request } = useAPI();
  const { refresh, posts, isLoading } = usePosts();
  const nav = useNavigate();
  const location = useLocation();
  const optionReference = useRef<HTMLDivElement>(undefined);

  const homeClickCount = useRef<number>(0);
  const timeoutId = useRef<number | undefined>(undefined);
  const optionList: IOptionList[] = [
    {
      name: 'Home',
      icon: 'home_ico',
      onClick: async () => {
        if (location.pathname !== '/') {
          nav('/');
          return;
        }
        homeClickCount.current++;
        if (homeClickCount.current === 2) {
          await refresh();
          homeClickCount.current = 0;
        } else {
          optionReference.current?.scrollTo(0, 0);
          if (timeoutId) return;
          timeoutId.current = setTimeout(() => {
            homeClickCount.current = 0;
          }, 3000);
        }
      },
    },
    {
      name: 'My profile',
      icon: 'myprofile_ico',
      onClick: () => {
        nav(`/profile/me`);
      },
    },
    { name: 'Messages', icon: 'messages_ico' },
    { name: 'Friends list', icon: 'friendslist_ico' },
    { name: 'Groups', icon: 'groups_ico' },
    { name: 'Notifications', icon: 'notifications_ico' },
    { name: 'Buy & Sell', icon: 'buyandsell_ico' },
  ];

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, [refresh]);
  const { setNotification } = useNotify();
  async function pushPost() {
    if (postText && postText.length === 0) {
      return false;
    }
    if (!visibility || visibility.trim() === '') {
      setNotification('error', 'Select visibility!');
      return false;
    }
    if (!postText || postText.trim() === '' || postText.length < 4) {
      setNotification('error', 'Write more text!');
      return false;
    }
    const payload = {
      visible_for: visibility,
      content: postText,
    };
    try {
      const res = await request<boolean>('/api/posts', 'POST', payload);
      if (res?.success) {
        setNotification('success', 'Post added!');
        await refresh();
        setPostText(undefined);
      } else {
        throw new Error('Post cannot be added');
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotification('error', error.message);
      } else {
        setNotification('error', 'Unknown error!');
      }
    }
  }

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className={style.optionsContainer}>
        <OptionLayer items={optionList} />
      </div>
      <div className={style.searchbarContainer}>
        <SearchLayer />
      </div>

      <div className={style.serviceLogoContainer}>
        <Logo additionalStyle={{ width: '5%' }} />
      </div>
      <div className={style.profileContainer}></div>
      <div className={style.friendsContainer}>
        <FriendsLayer />
      </div>
      <div className={style.feedContainerExpanded} ref={optionReference}>
        <div className={style.addPostContainer}>
          {location.pathname === '/' && (
            <PostCreator
              onWrite={(text: string) => setPostText(text)}
              text={postText}
              onOptionChange={(optionChange: string) => setVisibility(optionChange)}
              onConfirm={async () => await pushPost()}
            />
          )}
        </div>
        <div className={style.posts}>
          {posts &&
            location.pathname === '/' &&
            posts.map((v) => (
              <Activity
                type="POST"
                key={v.id}
                avatar={null}
                authorName={v.fullName}
                content={v.content}
                createdAt={v.createdAt}
                commentReactions={v.reactions}
                userReaction={v.myReaction}
                postId={v.id}
                subCommentsCount={v.commentsCount}
                onFocus={() => {
                  nav(`post/${v.id}`);
                }}
              />
            ))}
        </div>
        {location.pathname !== '/' && <Outlet />}
      </div>
    </>
  );
}
