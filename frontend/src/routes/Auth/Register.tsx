import Button from "../../components/Button";
import Input from "../../components/Input";
import CustomText from "../../components/Text";
import style from "../../styles/routes/Auth/register.module.css";
import {
  checkDataRequirements,
  extractFormData,
} from "../../services/routes/Auth/authService";
import { registerConfig } from "../../configs/registerConfig";
import { redirect, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  return (
    <div className={style.container}>
      <CustomText
        text="Here you can create your own account!"
        bottomText="But before we want to know something about you"
        align="center"
        size="1.2rem"
      />
      <div className={style.section}>
        <form
          style={{ height: "100%", width: "100%" }}
          onSubmit={async (e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const data = extractFormData(formData);
            if (!data) return; //todo Error handler / notify user
            const requirementsCheck = checkDataRequirements(
              data,
              registerConfig,
            );
            if (requirementsCheck) return; //todo Error handler / notify user
            const res = await fetch("http://localhost:3000/api/auth/register", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ data }),
            });
            if (!res.ok) {
              const {message} = await res.json();

              console.error(res.status, message);
              //todo Error handler / notify user
              return;
            }
            nav("/auth/login");
          }}
        >
          <Input
            type="email"
            name="email"
            placeholder="Write your email here"
            width="75%"
            height="15%"
            image="email_ico.png"
            min={registerConfig.email.min}
            max={registerConfig.email.max}
            isRequired={true}
          />
          <Input
            type="date"
            name="birthdayDate"
            placeholder="Write your email here"
            width="75%"
            height="15%"
            image="birthday_ico.png"
            isRequired={true}
          />
          <Input
            type="password"
            name="password"
            placeholder="Write your password here"
            width="75%"
            height="15%"
            image="pass_ico.png"
            min={registerConfig.password.min}
            max={registerConfig.password.max}
            isRequired={true}
          />
          <div className={style.personalData}>
            <Input
              type="text"
              name="firstName"
              placeholder="First name"
              width="45%"
              height="75%"
              min={registerConfig.personalData.min}
              max={registerConfig.personalData.max}
              isRequired={true}
            />
            <Input
              type="text"
              name="lastName"
              placeholder="Last name"
              width="45%"
              height="75%"
              min={registerConfig.personalData.min}
              max={registerConfig.personalData.max}
              isRequired={true}
            />
          </div>
          <Button
            type="submit"
            width="45%"
            height="17%"
            text="Sign up"
            color="#3dc2318a"
            textColor="white"
            fontSize="1.7rem"
          />
        </form>
      </div>
    </div>
  );
}
