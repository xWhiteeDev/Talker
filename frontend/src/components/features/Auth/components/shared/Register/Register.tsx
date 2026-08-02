import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import style from "./Register.module.css";
import { customNotificationCtx } from "../../../../../../context/customNotificationContext";
import CustomText from "../../../../../generic/UI/Text/Text";
import Button from "../../../../../generic/UI/Button/Button";
import Input from "../../../../../generic/UI/Input/Input";
import { handleSubmitAuthForm } from "../../../modules/authService";
import { registerValidationConfig } from "../../../assets/configuration";
import {validatorFunctions} from "../../../../../../services/validationMethods";

const Inputs = {
  mainSection: [
    {
      type: "email",
      name: "email",
      placeholder: "Write your email here",
      image: "email_ico.png",
      min: registerValidationConfig.email.length?.min,
      max: registerValidationConfig.email.length?.max,
      additionalStyle: { width: "75%", height: "15%" },
    },
    {
      type: "password",
      name: "password",
      placeholder: "Write your password here",
      image: "pass_ico.png",
      min: registerValidationConfig.password.length?.min,
      max: registerValidationConfig.password.length?.max,
      additionalStyle: { width: "75%", height: "15%" },
    },
    {
      type: "date",
      name: "birthdayDate",
      placeholder: "Pick your birthday date here",
      image: "birthday_ico.png",
      additionalStyle: { width: "75%", height: "15%" },
    },
  ],
  personalDataSection: [
    {
      type: "text",
      name: "firstName",
      placeholder: "First name",
      min: registerValidationConfig.personalData.length?.min,
      max: registerValidationConfig.personalData.length?.max,
      additionalStyle: { width: "45%", height: "75%" },
    },
    {
      type: "text",
      name: "lastName",
      placeholder: "Last name",
      min: registerValidationConfig.personalData.length?.min,
      max: registerValidationConfig.personalData.length?.max,
      additionalStyle: { width: "45%", height: "75%" },
    },
  ],
};

export default function Register() {
  const nav = useNavigate();
  const ctx = useContext(customNotificationCtx);
  return (
    <div className={style.container}>
      <CustomText
        text="Here you can create your own account!"
        bottomText="But before we want to know something about you"
        additionalStyle={{ textAlign: "center", fontSize: "1.2rem" }}
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
                validationFunctions: validatorFunctions,
              });
            }
          }}
        >
          {Inputs.mainSection.map((v) => (
            <Input
              key={v.name}
              type={v.type}
              name={v.name}
              placeholder={v.placeholder}
              image={v.image}
              isRequired={true}
              min={v.min}
              max={v.max}
              additionalStyle={v.additionalStyle}
            />
          ))}

          <div className={style.personalData}>
            {Inputs.personalDataSection.map((v) => (
              <Input
                key={v.name}
                type={v.type}
                name={v.name}
                placeholder={v.placeholder}
                isRequired={true}
                min={v.min}
                max={v.max}
                additionalStyle={v.additionalStyle}
              />
            ))}
          </div>
          <Button
            type="submit"
            text="Sign up"
            additionalStyle={{
              width: "45%",
              height: "17%",
              backgroundColor: "#3dc2318a",
              color: "white",
              fontSize: "1.7rem",
            }}
          />
        </form>
      </div>
    </div>
  );
}
