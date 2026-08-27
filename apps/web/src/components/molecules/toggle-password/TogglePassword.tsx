import { Eye, EyeOff } from 'lucide-react';

type TogglePasswordProps = {
  state: boolean;
  onClick: VoidFunction;
};

export function TogglePassword({
  state,
  onClick,
}: TogglePasswordProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={-1}
      className="cursor-pointer"
    >
      {state ? <Eye className="w-4" /> : <EyeOff className="w-4" />}
    </button>
  );
}
