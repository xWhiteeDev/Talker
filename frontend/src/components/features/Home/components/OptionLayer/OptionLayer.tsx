import Button from '../../../../generic/UI/Button/Button';
import MenuOption from '../../../../generic/UI/MenuOption/MenuOption';
import style from './OptionLayer.module.css';
import type {IOptionList} from './types';


interface OptionLayerProps {
  items:IOptionList[]
}

export default function OptionLayer({items}:OptionLayerProps) {
  return (
    <div className={style.container}>
      <div className={style.options}>
        {items.map((v, i) => {
          return (
            <MenuOption
              key={v.name + i}
              text={v.name}
              icon={v.icon}
              onClick={v.onClick}
            />
          );
        })}
      </div>
      <div className={style.userContainer}>
        <div className={style.user}>
          <div className={style.userAvatar}></div>
          <div className={style.usernameAndRole}>
            <div className={style.username}>
              <strong>Jacob</strong> Unknown
            </div>
            <span style={{ color: '#9f56a8', fontSize: '1.1rem' }}>
              <strong>CEO</strong>
            </span>
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
          />
        </div>
      </div>
    </div>
  );
}
 