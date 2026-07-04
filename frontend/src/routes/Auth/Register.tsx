import Button from "../../components/Button";
import Input from "../../components/Input";
import CustomText from "../../components/Text";
import style from "../../styles/routes/Auth/register.module.css";
import { registerValidationConfig } from "../../configs/validations";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { handleSubmitAuthForm } from "../../services/routes/Auth/authService";
import { validatorFunctions } from "../../services/validators";

export default function Register() {
  const nav = useNavigate();
  const ctx = useContext(NotificationContext);
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
          onSubmit={async (event) => {
            if (ctx) {
              await handleSubmitAuthForm(event, ctx, nav, {
                transmisionEndpoint: "register",
                successContent: "Acconut created!",
                navigationPoint: "/auth/login",
                validationConfiguration: registerValidationConfig,
                validationFunctions: validatorFunctions
              });
            }
          }}
        >
          <Input
            type="email"
            name="email"
            placeholder="Write your email here"
            width="75%"
            height="15%"
            image="email_ico.png"
            min={registerValidationConfig.email.length?.min}
            max={registerValidationConfig.email.length?.max}
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
            min={registerValidationConfig.password.length?.min}
            max={registerValidationConfig.password.length?.max}
            isRequired={true}
          />
          <div className={style.personalData}>
            <Input
              type="text"
              name="firstName"
              placeholder="First name"
              width="45%"
              height="75%"
              min={registerValidationConfig.personalData.length?.min}
              max={registerValidationConfig.personalData.length?.max}
              isRequired={true}
            />
            <Input
              type="text"
              name="lastName"
              placeholder="Last name"
              width="45%"
              height="75%"
              min={registerValidationConfig.personalData.length?.min}
              max={registerValidationConfig.personalData.length?.max}
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
