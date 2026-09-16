import { useContext } from 'react';
import { AuthContext } from '../../../../../context/authContext';
import Button from '../../../../generic/UI/Button/Button';
import MenuOption from '../../../../generic/UI/MenuOption/MenuOption';
import style from './OptionLayer.module.css';
import type { IOptionList } from './types';
import { useAPI } from '../../../../../hooks/useAPI';
import { useNavigate } from 'react-router-dom';

interface OptionLayerProps {
  items: IOptionList[];
}

export default function OptionLayer({ items }: OptionLayerProps) {
  const authContext = useContext(AuthContext);
  const { request } = useAPI();
  const nav = useNavigate();
  return authContext && (
    
    <div className={style.container}>
      <div className={style.options}>
        {items.map((v, i) => {
          return <MenuOption key={v.name + i} text={v.name} icon={v.icon} onClick={v.onClick} />;
        })}
      </div>
      <div className={style.userContainer}>
        <div className={style.user}>
          <div className={style.userAvatar} style={{backgroundImage:`url(https://ui-avatars.com/api/?name=${authContext.user?.username.split(' ').join('+')})`}}></div>
          <div className={style.usernameAndRole}>
            <div className={style.username}>
              {authContext && authContext.user && <strong>{authContext.user.username}</strong>}
            </div>
          </div>
        </div>
        <div className={style.buttons}>
          <Button
            text={'Report bug'}
            additionalStyle={{ backgroundColor: '#84689b', color: 'white', fontSize: '0.9rem', border: 'none' }}
          />
          <Button
            text={'Logout'}
            additionalStyle={{ backgroundColor: '#ca6060', color: 'white', fontSize: '0.9rem', border: 'none' }}
            onClick={async () => {
              const result = await request('/api/auth/logout', 'POST', undefined);
              if (result?.success) {
                //TODO: Confirmation in future
                authContext?.logout();
                nav('/auth/login');
              } 
            }}
          />
        </div>
      </div>
    </div>
  );
}
