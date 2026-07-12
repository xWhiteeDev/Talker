import logo from '../../assets/logo_talker.png';
import type { Logo } from "./types";

export default function Logo({ additionalStyle}: Logo) {
  return <img src={logo} style={additionalStyle} alt="Talker logo" />;
}
