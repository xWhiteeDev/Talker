import { useRef, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import CustomText from "../../components/Text";
import style from "../../styles/routes/Auth/register.module.css";
import { extractFormData } from "../../services/routes/Auth/registerService";

export default function Register() {
  const today = new Date();
  const currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate}`;
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
          onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const data = extractFormData(formData);
            if (data) console.log(data);
          }}
        >
          <Input
            type="email"
            name="email"
            placeholder="Write your email here"
            width="75%"
            height="15%"
            image="email_ico.png"
            min={3}
            max={30}
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
            min={5}
            max={200}
            isRequired={true}
          />
          <div className={style.personalData}>
            <Input
              type="text"
              name="firstName"
              placeholder="First name"
              width="45%"
              height="75%"
              min={2}
              max={15}
              isRequired={true}
            />
            <Input
              type="text"
              name="lastName"
              placeholder="Last name"
              width="45%"
              height="75%"
              min={2}
              max={15}
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
