import { Headline } from "../../atoms/headline/Headline";
import logo from "../../../assets/icon.png";

export function AppLogo(): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="Bepic Shopping logo" width={45} height={45} />
      <Headline tag="h3">Energy888</Headline>
    </div>
  );
}
