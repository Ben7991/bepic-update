import css from './Loader.module.css';
import logo from '../../../assets/icon.png';

export function Loader(): React.JSX.Element {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-white">
      <img src={logo} alt="AppLogo" className={css.loader__img} />
      <div className={css.loader}></div>
    </div>
  );
}
