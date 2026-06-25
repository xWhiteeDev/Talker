import logo from "../assets/logo_talker.png";
import type { ILogo } from "../interfaces/components/ILogo";

export default function Logo({ width, height,aspectRatio }: ILogo) {
  return <img src={logo} style={{ width, height, aspectRatio }} alt="Talker logo" />;
}
