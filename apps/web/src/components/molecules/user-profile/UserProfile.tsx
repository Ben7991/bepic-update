import userProfile from '../../../assets/user-profile.svg';
import { useAppSelector } from '../../../store/index.util';

/**
 * Helps displays a user avatar
 * @returns a user avatar component
 */
export function UserProfile(): React.JSX.Element {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="flex items-center gap-3">
      {user?.imagePath ? (
        <img
          src={`${import.meta.env.VITE_BASE_SERVER}/${user.imagePath}`}
          alt={`${user.name}'s profile`}
          className="w-12 h-12 object-cover border border-gray-300 rounded-full"
        />
      ) : (
        <div className="bg-gray-100 border border-gray-300 rounded-full basis-12 h-12 flex items-center justify-center">
          <img src={userProfile} alt="Generic image" className="w-2/3" />
        </div>
      )}
      <div>
        <p>
          <strong className="font-medium text-black">{user?.name}</strong>
        </p>
        <span className="text-[0.9em]">{user?.role}</span>
      </div>
    </div>
  );
}
