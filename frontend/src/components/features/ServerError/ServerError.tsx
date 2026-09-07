import { useEffect, useState } from 'react';
import style from './ServerError.module.css';
import { fetchImage } from '../../../services/fetchImageService';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../generic/UI/Button/Button';

export default function ServerError() {
  const [icon, setIcon] = useState<string>();
  const { errorcode } = useParams<string>();
  const navigation = useNavigate();
  useEffect(() => {
    (async () => {
      const source = await fetchImage('server_error.png');
      setIcon(source);
    })();
  }, []);
  return (
    <div className={style.container}>
      <div className={style.icon} style={{ backgroundImage: `url(${icon})` }}></div>
      <div className={style.text}>
        <span style={{ fontSize: '3rem', textShadow: '0px 7px 3px #1f1e1e34' }}>
          <strong>Server error</strong>
        </span>
        <span style={{ fontSize: '2rem' }}>{errorcode ?? 'UNKNOWN'}</span>
      </div>
      <div className={style.communicate}>
        <span style={{ fontSize: '2rem' }}>
          <strong>Actually</strong> we're having server troubles...
        </span>
        <span style={{ fontSize: '1.4rem' }}>
          <strong>We understand </strong> that is annoying and sad to experience these troubles and be disconnected with world
          but...
        </span>
        <span style={{ fontSize: '1.6rem' }}>
          <strong>We will comeback soon - We also want to be on track with fresh news from world!</strong>
        </span>
      </div>
      <div className={style.buttoncontainer}>
        <Button
          text="Try to connect again"
          additionalStyle={{
            backgroundColor: '#4d4c4c10',
            borderRadius: '5px',
            width: '20%', 
            height: '13%',
            fontSize: '1.2rem',
            outline: 'none',
            border: 'none',
            boxShadow: '0px 7px 4px #3131314f',
          }}
          onClick={async () => {
            await navigation('/');
          }}
        />
      </div>
    </div>
  );
}
