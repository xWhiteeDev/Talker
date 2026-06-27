import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Logo from "../../components/Logo";
import Quote from "../../components/Quote";
import Sidebar from "../../components/Sidebar";
import CustomText from "../../components/Text";

import style from "../../styles/routes/Auth/auth.module.css";


export default function AuthorizationSidebar() {
  const [loginInput, setLoginInput] = useState<string>();
  const [passwordInput, setPasswordInput] = useState<string>();
  const navigate = useNavigate();

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
        <CustomText
          text="Fill authorization fields"
          weight="600"
          size="1.1rem"
        />
        <Input
          width="85%"
          type="text"
          height="15%"
          placeholder="Type your email or phone number"
          image="login_ico.png"
          onInput={(e) => setLoginInput(e.currentTarget.value)}
        />
        <Input
          width="85%"
          type="password"
          height="15%"
          placeholder="Type your password"
          image="pass_ico.png"
          onInput={(e) => setPasswordInput(e.currentTarget.value)}
        />
        <Link
          to="/recovery"
          style={{
            color: "black",
            fontSize: "1.32rem",
          }}
        >
          I forgot a password...
        </Link>
      </div>
      <div className={style.buttonSection}>
        <Button
          text="Sign in"
          width="60%"
          height="25%"
          color="#3dc2318a"
          textColor="white"
          fontSize="1.7rem"
          onClick={() => console.log(passwordInput, loginInput)}
        />
        <Button
          text="Sign up"
          width="60%"
          height="23%"
          color="#0c81b827"
          textColor="white"
          fontSize="1.7rem"
          onClick={() => navigate("register")}
        />
      </div>
    </Sidebar>
  );
}