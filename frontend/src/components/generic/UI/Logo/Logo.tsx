import logo from "../../../../assets/logo_talker.png";

interface LogoProps {
  additionalStyle?: React.CSSProperties;
}
export default function Logo({ additionalStyle }: LogoProps) {
  return <img src={logo} style={additionalStyle} alt="Talker logo" />;
}
