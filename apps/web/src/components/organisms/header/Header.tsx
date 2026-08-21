import { Container } from "../../atoms/grid/Grid";
import { AppLogo } from "../../molecules/app-logo/AppLogo";
import { DisplayLoginForm } from "./Header.partials";

export function Header(): React.JSX.Element {
  return (
    <header className="py-4 border-b border-b-gray-300">
      <Container>
        <div className="flex justify-between items-center">
          <AppLogo />
          <DisplayLoginForm />
        </div>
      </Container>
    </header>
  );
}
