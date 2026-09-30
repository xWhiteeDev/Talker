import { Outlet } from 'react-router-dom';
import style from './App.module.css';

export default function App() {
  return (
    <div className={style.appContainer}>
      <Outlet />
    </div>
  );
}
