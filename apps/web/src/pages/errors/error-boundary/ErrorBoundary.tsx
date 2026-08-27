import { RotateCcw } from "lucide-react";
import { Button } from "../../../components/atoms/button/Button";
import { Headline } from "../../../components/atoms/headline/Headline";

type ErrorBoundaryProps = {
  message: string;
  resetLink: string;
}

export function ErrorBoundary({message, resetLink}: ErrorBoundaryProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center pt-20 md:pt-32 w-[90%] md:w-2/3 xl:w-3/5 mx-auto text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-20"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>

      <Headline tag="h1">Oops!!! An error occured</Headline>
      <p>{message}</p>
      <p className="mb-4">Please reset with the link below</p>
      <Button el="link" to={resetLink} variant="primary" className="flex! items-center gap-2">
        <RotateCcw className="w-4"/>
        <span>Reset now</span>
      </Button>
    </div>
  );
}
