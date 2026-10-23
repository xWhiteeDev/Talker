import CustomText from '../../Components/CustomText/CustomText';
import style from './Home.module.css';
import Logo from '../../../components/generic/UI/Logo/Logo';
import UserLayout from './Layouts/UserLayout/UserLayout';
import FeedLayout from './Layouts/FeedLayout/FeedLayout';
import Searchbar from '../../Components/Searchbar/Searchbar';
import { useState } from 'react';
import ServiceOptionsLayout from './Layouts/ServiceOptionsLayout/ServiceOptionsLayout';
import SideLayout from './Layouts/SideLayout/SideLayout';
import type { IPost } from '../../../types/components/IPost';
import { useAuth } from '../../../hooks/useAuth';
import {debugAvatar} from '../../Assets/debug';

export default function Home() {
  const [searchbarText, setSearchbarText] = useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<IPost[] | undefined>(undefined);
  const { user, logout } = useAuth();
  if (!user) {
    (async () => await logout())();
    return;
  }
  return (
    <div className={style.homeGrid}>
      <div className={style.service}>
        <Logo additionalStyle={{ width: '3vw', aspectRatio: '1/1' }} />
        <CustomText color="black" text="Talker" fontSize="1.7rem" fontWeight="600" />
      </div>
      <div className={style.searchbarLayout}>
        <Searchbar
          onInput={setSearchbarText}
          value={searchbarText}
          onConfirm={(v) => console.log(`Confirmed: ${v}`)}
          icon="magnifier"
          placeholder="Search..."
          borderRadius="10px"
          width="20vw"
          height="7vh"
          backgroundColor="white"
        />
      </div>
      <div className={style.userLayer}>
        <UserLayout
          firstName={user.firstName}
          width="90%"
          height="98%"
          backgroundColor="white"
          borderRadius="10px"
          lastName={user.lastName}
          username="not-completed"
          avatarUrl={debugAvatar}
        />
      </div>
      <div className={style.feedLayer}>
        <FeedLayout setPosts={setPosts} posts={posts} />
      </div>
      <div className={style.sideLayout}>
        <SideLayout />
      </div>
      <div className={style.serviceTopRightLayout}>
        <ServiceOptionsLayout />
      </div>
    </div>
  );
}
