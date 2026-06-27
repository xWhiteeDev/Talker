import { Outlet } from "react-router-dom";
import style from '../../styles/routes/Auth/auth.module.css'

export default function Auth() {
  return (
    <div className={style.container}>
      <Outlet />
    </div>
  );
}
