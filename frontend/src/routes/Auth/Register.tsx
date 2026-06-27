import { useRef, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import CustomText from "../../components/Text";
import style from "../../styles/routes/Auth/register.module.css";

export default function Register() {
  const birthdayInput = useRef<HTMLInputElement | null>(null);
  const [personAge, setPersonAge] = useState<number>(0)
  return (
    <div className={style.container}>
      <CustomText text="Here you can create your own account!" size="1.2rem" />
      <Input
        type="email"
        placeholder="Write your email here..."
        width="45%"
        height="15%"
        image="email_ico.png"
      />
      <CustomText
        text="Select your birthday date"
        bottomText="Remember you cannot be younger than 14"
        size="1rem"
        align="center"
      />
      <Input type="date" ref={birthdayInput} width="35%" height="15%" image="birthday_ico.png" />
      <Button
        text="Next step >"
        color="#3dc2318a"
        textColor="white"
        fontSize="1rem"
        width="22%"
        height="17%"
      />
      {JSON.stringify(birthdayInput.current?.valueAsDate)}
    </div>
  );
}
