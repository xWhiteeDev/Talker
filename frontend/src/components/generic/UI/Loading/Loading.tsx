import Logo from "../Logo/Logo";
import CustomText from "../Text/Text";
import style from './Loading.module.css'
export function Loading() {
  return (
    <div className={style.loadingScene}>
      <Logo additionalStyle={{ width: "46%", gridColumn: "2/3" }} />
      <CustomText
        text="Loading post..."
        bottomText="Be patient"
        additionalStyle={{ fontSize: "1.2rem", textAlign: "center" }}
      />
    </div>
  );
}
