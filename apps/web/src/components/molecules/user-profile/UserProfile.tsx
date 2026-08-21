import { Headline } from "../../atoms/headline/Headline";

/**
 * Helps displays a user avatar
 * @returns a user avatar component
 */
export function UserProfile(): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="border border-gray-400 rounded-full basis-12 h-12 flex items-center justify-center">
        <Headline tag="h5">BT</Headline>
      </div>
      <div>
        <p>
          <strong className="font-medium text-black">Bernard Teye</strong>
        </p>
        <span className="text-[0.9em]">Distributor</span>
      </div>
    </div>
  );
}
