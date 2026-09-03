import { useEffect, useState } from 'react';
import style from './Profile.module.css';
import { useAPI } from '../../../../../hooks/useAPI';
import Tab from './Tab/Tab';
import { Activity } from '../Activity/Activity';
import type { ReactionUnion } from '../../../../../types/VisualUnions';
import { useNavigate, useParams } from 'react-router-dom';
interface IProfile {
  fullName: string;
  birthdayDate: string;
  joinDate: string;
  description: string;
  content: IContent[];
}
interface IContent {
  id: number;
  createdAt: string;
  authorId: number;
  content: string;
  visibleFor: 'Public' | 'Friends' | 'Private';
  fullName: string;
  reactions: Record<ReactionUnion, number>;
  myReaction: ReactionUnion;
  commentsCount: number;
  photo: string | null;
  video: string | null;
  file: string | null;
  gif: string | null;
  taggedUsers: string[] | null;
  pinnedPlace: string | null;
}

export default function Profile() {
  const { request } = useAPI();
  const [profile, setProfile] = useState<IProfile | undefined>(undefined);
  const nav = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const endpoint: string = id ?? 'me';
    (async () => {
      const result = await request<IProfile>(`/api/profile/${endpoint}`, 'GET');
      if (!result || (result && !result.success) || !result.data) {
        nav('/');
        console.error('Failed to fetch profile!');
        return;
      }
      setProfile(result.data);
    })();
  }, [id, nav, request]);
  return (
    profile && (
      <div className={style.container}>
        <div className={style.background}></div>
        <div className={style.profileContainer}>
          <div className={style.personal}>
            <Tab header="Joined at" text={new Date(profile.joinDate).toLocaleDateString()} />
            <Tab header="Birthday" text={new Date(profile.birthdayDate).toLocaleDateString()} />
            <Tab header="Live in" text="Mielec, Poland" />
          </div>
          <div className={style.profile}>
            <div className={style.avatar}></div>
            <div className={style.name}>
              <span>
                <strong>{profile.fullName}</strong>
              </span>
            </div>
          </div>
          {!id && (
            <div className={style.settings}>
              <div className={style.settingsBtn}></div>
            </div>
          )}

          <div className={style.descriptionContainer}>
            <Tab header="Description" text={profile.description} />
          </div>
        </div>
        <div className={style.profileItems}>
          <div className={style.friendsList}>
            <div className={style.friendsHeader}>
              <span>Friends</span>
            </div>
            <div className={style.friendsContent}>
              {!id && <span className={style.zero}>You don't have any friends...</span>}
              {id && <span className={style.zero}>0 Friends</span>}
            </div>
          </div>
          <div className={style.contentList}>
            <div className={style.contentHeader}>
              <span>Content</span>
            </div>
            <div className={style.content}>
              {profile.content &&
                profile.content.length > 0 &&
                profile.content.map((v) => (
                  <Activity
                    key={v.id}
                    avatar={null}
                    authorName={v.fullName}
                    content={v.content}
                    createdAt={v.createdAt}
                    postId={v.id}
                    userReaction={v.myReaction}
                    commentReactions={v.reactions}
                    subCommentsCount={v.commentsCount}
                    type={'POST'}
                    onFocus={() => {
                      nav(`/post/${v.id}`);
                    }}
                  />
                ))}
              {(profile.content.length === 0 || !profile.content) && <span className={style.zero}>Nothing to see here yet.</span>}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
