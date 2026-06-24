import style from "../styles/components/auth.module.css";
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
          <Input width="222px" height="10%"/>
        </div>
      </Sidebar>
    </div>
  );
}
