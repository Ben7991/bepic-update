import { Container } from "@/components/atoms/grid/Grid";

export function Footer(): React.JSX.Element {
  return (
    <footer className="py-8 text-center bg-gray-200">
      <Container>
        <p>Energy888 &copy; 2024 - 2026 | All rights reserved</p>
      </Container>
    </footer>
  );
}
