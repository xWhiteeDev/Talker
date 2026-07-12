import style from "./ErrorPage.module.css";
import CustomText from "../Text/Text";
import serverError from '../../assets/server_error.png'
export default function ErrorPage({}) {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <img src={serverError} width="35%" height="65%" alt="" />
        <div className={style.text}>
          <CustomText text="Upsss...!" additionalStyle={{fontSize:'2.3rem'}} bottomText="We've some problems with our server... We're trying to fix these problem asap." />
        </div>
      </div>
    </div>
  );
}
