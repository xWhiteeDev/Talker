import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar.tsx";
import Logo from "../../../components/Logo/Logo.tsx";
import CustomText from "../../../components/Text/Text.tsx";
import Quote from "../../../components/Quote/Quote.tsx";
import style from "./Login.module.css";
import Button from "../../../components/Button/Button.tsx";
import Input from "../../../components/Input/Input.tsx";
import { NotificationContext } from "../../../components/Notification/context/NotificationContext.ts";
import { registerValidationConfig } from "../configs/authConfig.ts";
import { handleSubmitAuthForm } from "../services/authService.ts";
import { validatorFunctions } from "../validation/validationMethods.ts";

export default function Login() {
  const nav = useNavigate();
  const ctx = useContext(NotificationContext);  
  return (
    <Sidebar className={style.sidebar}>
      <div className={style.mediaInfo}>
        <div className={style.mediaLogo}>
          <Logo additionalStyle={{ aspectRatio: "1/1", width: "45%" }} />
          <CustomText
            text="Let's talk"
            bottomText="together!"
            additionalStyle={{ fontSize: "2.1rem" }}
          />
        </div>
        <Quote
          text="Say Hello to your friends!"
          additionalStyle={{ fontSize: "1.9rem", fontWeight: "600" }}
        />
      </div>
      <div className={style.section}>
        <form
          onSubmit={async (event) => {
            if (ctx) {
              await handleSubmitAuthForm(event, ctx, nav, {
                transmisionEndpoint: "login",
                navigationPoint: "/home",
                validationConfiguration: registerValidationConfig,
                validationFunctions: validatorFunctions,
              });
            }
          }}
        >
          <CustomText
            text="Fill authorization fields"
            additionalStyle={{ fontWeight: "600", fontSize: "1.2rem" }}
          />
          <Input
            additionalStyle={{
              width: "85%",
              height: "9%",
              fontSize: "1.2rem",
            }}
            type="email"
            name="email"
            placeholder="Type your email or phone number"
            image="login_ico.png"
          />
          <Input
            additionalStyle={{ width: "85%", height: "9%" }}
            type="password"
            name="password"
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
              additionalStyle={{
                width: "60%",
                height: "19%",
                backgroundColor: "#3dc2318a",
                color: "white",
                fontSize: "1.7rem",
              }}
            />
            <Button
              type="button"
              text="Sign up"
              additionalStyle={{
                width: "60%",
                height: "19%",
                backgroundColor: "#0c81b827",
                color: "white",
                fontSize: "1.7rem",
              }}
              onClick={() => nav("/auth/register")}
            />
            <CustomText additionalStyle={{textAlign:'center'}} text="Remember! Talker administration will never ask you about your password" />
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
