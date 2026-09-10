import { useContext, useEffect, useState } from 'react';
import style from './Profile.module.css';
import { useAPI } from '../../../../../hooks/useAPI';
import Tab from './Tab/Tab';
import { Activity } from '../Activity/Activity';
import type { TReactionUnion } from '../../../../../types/components/IComponentsUnion';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../../generic/UI/Button/Button';
import { AuthContext } from '../../../../../context/authContext';
interface IProfile {
  fullName: string;
  birthdayDate: string;
  joinDate: string;
  description: string;
  content: IContent[];
  relation?: IProfileRelation;
}

type TProfileRelation = null | 'pending' | 'accepted';
interface IProfileRelation {
  status: TProfileRelation;
  creator: number;
}
interface IContent {
  id: number;
  createdAt: string;
  authorId: number;
  content: string;
  visibleFor: 'Public' | 'Friends' | 'Private';
  fullName: string;
  reactions: Record<TReactionUnion, number>;
  myReaction: TReactionUnion;
  commentsCount: number;
  photo: string | null;
  video: string | null;
  file: string | null;
  gif: string | null;
  taggedUsers: string[] | null;
  pinnedPlace: string | null;
}

interface IRelationState {
  status: TProfileRelation;
  creator: number;
}

export default function Profile() {
  const { request } = useAPI();
  const [profile, setProfile] = useState<IProfile | undefined>(undefined);
  const nav = useNavigate();
  const { id } = useParams();
  const [relation, setRelation] = useState<IRelationState | null>(null);
  const authContext = useContext(AuthContext);
  useEffect(() => {
    const endpoint: string = id ?? 'me';
    (async () => {
      const result = await request<IProfile>(`/api/profile/${endpoint}`, 'GET');
      if (!result || (result && !result.success) || !result.data) {
        nav('/');
        console.error('Failed to fetch profile!');
        return;
      }
      console.log(result.data);
      setProfile(result.data);
      if (result.data.relation) {
        setRelation((prev) => {
          if (!result.data?.relation) return prev;
          return {
            ...(prev || {}),
            ...result.data.relation,
          };
        });
      }
    })();
  }, [id, nav, request]);

  async function addRequestToFriends(otherId: number) {
    if (isNaN(otherId) || otherId == null) {
      console.error('Failed to send request to user. ID is not a number');
      return;
    }
    //TODO: Use try catch here
    const result = await request<boolean>('/api/friends/invites', 'POST', { otherId });
    if (result && result.success == true && result.data == true) {
      if (authContext && authContext.user) {
        const userId = authContext.user.id;
        setRelation((prev) => {
          return {
            ...(prev || {}),
            status: 'pending',
            creator: +userId,
          };
        });
      }
    }
  }
  async function setRequestStatus(status: 'decline' | 'accepted') {
    if (!status || typeof status !== 'string') {
      console.error('You can only provide non-empty string!');
      return;
    }
    if (!id || (id && (isNaN(+id) || +id < 0))) {
      console.log(id);
      console.error('Requested id cannot be any other type than number and cannot be lower than 0!');
      return;
    }

    const allowedStatuses = ['decline', 'accepted'];
    if (!allowedStatuses.includes(status)) {
      console.error('Passed status is not valid!');
      return;
    }
    const routeMethod = status === 'decline' ? 'DELETE' : 'PATCH';
    const otherId = +id;
    //TODO: Use try catch here

    const result = await request<boolean>('/api/friends/invites', routeMethod, { otherId });
    if (!result || !result.success) {
      console.error('Cannot change relaton state!');
      return;
    }
    if (routeMethod === 'DELETE') {
      setRelation(null);
    }
    if (routeMethod === 'PATCH') {
      setRelation((p) => {
        if (!p) return null;
        return {
          ...p,
          status: 'accepted',
          creator: p.creator,
        };
      });
    }
  }
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
        {id && authContext?.user && (
          <div className={style.relationButtons}>
            {!relation && (
              <Button
                text="+ Invite to friends"
                onClick={async () => {
                  if (id && (isNaN(+id) || id == undefined)) {
                    return;
                  }
                  await addRequestToFriends(+id);
                }}
              />
            )}
            {relation && relation.status == 'pending' && relation.creator === +authContext.user.id && (
              <>
                <Button isDisabled text="Pending" additionalStyle={{ backgroundColor: '#cf9c3d' }} />
                <Button
                  text="x Remove Request"
                  onClick={async () => await setRequestStatus('decline')}
                  additionalStyle={{ backgroundColor: '#cf3d3d' }}
                />
              </>
            )}
            {relation && relation.status == 'pending' && relation.creator !== +authContext.user.id && (
              <>
                <Button
                  text="Accept"
                  onClick={async () => await setRequestStatus('accepted')}
                  additionalStyle={{ backgroundColor: '#0c6d09' }}
                />
                <Button
                  text="x Decline"
                  onClick={async () => await setRequestStatus('decline')}
                  additionalStyle={{ backgroundColor: '#cf3d3d' }}
                />
              </>
            )}
            {relation && relation.status == 'accepted' && (
              <>
                <Button isDisabled text="Friends" additionalStyle={{ backgroundColor: '#1d4fac' }} />
                <Button
                  text="x Remove friend"
                  onClick={async () => await setRequestStatus('decline')}
                  additionalStyle={{ backgroundColor: '#cf3d3d' }}
                />
              </>
            )}
          </div>
        )}

        <div className={style.profileItems}>
          <div className={style.friendsList}>
            <div className={style.friendsHeader}>
              <span>Friends</span>
            </div>
            {/* <div className={style.friendsContent}>
              {!id && <span className={style.zero}>You don't have any friends...</span>}
              {id && <span className={style.zero}>0 Friends</span>}
            </div> */}
          </div>

          <div className={style.contentList}>
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
