import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../../../../generic/UI/Logo/Logo.tsx";
import CustomText from "../../../../../generic/UI/Text/Text.tsx";
import Quote from "../../../../../generic/UI/Quote/Quote.tsx";
import style from "./Login.module.css";
import Button from "../../../../../generic/UI/Button/Button.tsx";
import Input from "../../../../../generic/UI/Input/Input.tsx";
import {handleSubmitAuthForm} from "../../../modules/authService.ts";
import {registerValidationConfig} from "../../../assets/configuration.ts";
import {validatorFunctions} from "../../../../../../services/validationMethods.ts";
import {customNotificationCtx} from "../../../../../../context/customNotificationContext.ts";

export default function Login() {
  const nav = useNavigate();
  const ctx = useContext(customNotificationCtx);  
  return (
    <div className={style.sidebar}>
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
                navigationPoint: "/",
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
    </div>
  );
}
