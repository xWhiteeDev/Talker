import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Logo from "../../components/Logo";
import Quote from "../../components/Quote";
import Sidebar from "../../components/Sidebar";
import CustomText from "../../components/Text";

import style from "../../styles/routes/Auth/auth.module.css";
import { handleSubmitAuthForm } from "../../services/routes/Auth/authService";
import { NotificationContext } from "../../context/NotificationContext";
import { registerValidationConfig } from "../../configs/validations";
import { validatorFunctions } from "../../services/validators";

export default function AuthorizationSidebar() {
  const nav = useNavigate();
  const ctx = useContext(NotificationContext);

  return (
    <Sidebar className={style.sidebar}>
      <div className={style.mediaInfo}>
        <div className={style.mediaLogo}>
          <Logo aspectRatio="1/1" width="45%" />
          <CustomText text="Let's talk" bottomText="together!" size="2.1rem" />
        </div>
        <Quote text="Say Hello to your friends!" size="1.9rem" weight="600" />
      </div>
      <div className={style.section}>
        <form
          onSubmit={async (event) => {
            if (ctx) {
              await handleSubmitAuthForm(event, ctx, nav, {
                transmisionEndpoint: "login",
                successContent: "Logged into account!",
                navigationPoint: "/",
                validationConfiguration: registerValidationConfig,
                validationFunctions: validatorFunctions,
              });
            }
          }}
        >
          <CustomText
            text="Fill authorization fields"
            weight="600"
            size="1.1rem"
          />
          <Input
            width="85%"
            type="email"
            name="email"
            height="10%"
            placeholder="Type your email or phone number"
            image="login_ico.png"
          />
          <Input
            width="85%"
            type="password"
            name="password"
            height="10%"
            placeholder="Type your password"
            image="pass_ico.png"
          />
          <Link
            to="/recovery"
            style={{
              color: "black",
              fontSize: "1.32rem",
              marginTop: "7%",
            }}
          >
            I forgot a password...
          </Link>
          <div className={style.buttonSection}>
            <Button
              text="Sign in"
              type="submit"
              width="60%"
              height="19%"
              color="#3dc2318a"
              textColor="white"
              fontSize="1.7rem"
            />
            <Button
              type="button"
              text="Sign up"
              width="60%"
              height="19%"
              color="#0c81b827"
              textColor="white"
              fontSize="1.7rem"
              onClick={() => nav("/auth/register")}
            />
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
