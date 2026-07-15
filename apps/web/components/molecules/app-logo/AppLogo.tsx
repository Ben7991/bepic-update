import Image from "next/image";

import { Headline } from "../../atoms/headline/Headline";

export function AppLogo(): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="Bepic Shopping logo" width={45} height={45} />
      <Headline tag="h3">Energy888</Headline>
    </div>
  );
}
