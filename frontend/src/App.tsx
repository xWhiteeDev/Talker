import { Outlet } from 'react-router-dom';
import style from './App.module.css';

export default function App() {
  return (
    <div
      className={style.appContainer}
      style={{
        backgroundImage: 'linear-gradient(322deg, rgba(187, 245, 254, 1) 0%, rgba(219, 219, 219, 0.61) 100%)',
        color: '#000000',
      }}
    >
      <Outlet />
    </div>
  );
}
