import style from "../styles/routes/auth.module.css";
import Sidebar from "../components/Sidebar";
import Quote from "../components/Quote";
import Logo from "../components/Logo";
import CustomText from "../components/Text";
import Input from "../components/Input";
export default function Auth() {
  return (
    <div className={style.container}>
      <Sidebar className={style.sidebar}>
        <div className={style.mediaInfo}>
          <div className={style.mediaLogo}>
            <Logo aspectRatio="1/1" width="45%" />
            <CustomText
              text="Let's talk"
              bottomText="together!"
              size="2.1rem"
            />
          </div>
          <Quote text="Say Hello to your friends!" size="1.9rem" weight="600" />
        </div>
        <div className={style.section}>
          <CustomText text="Fill authorization fields" weight="600" size="1.1rem"/>
          <Input width="85%" type="text" height="20%" placeholder="Type your email or phone number" image="login_ico.png" />
          <Input width="85%" type="password" height="20%" placeholder="Type your password" image="pass_ico.png" />
        </div>
      </Sidebar>
    </div>
  );
}
