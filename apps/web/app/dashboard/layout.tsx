import { type ChildrenOnlyProps } from "@/utils/utils.types";
import { DashboardLayoutContent } from "./layout.partials";

export default function DashboardLayout({
  children,
}: ChildrenOnlyProps): React.JSX.Element {
  return (
    <main className="lg:flex lg:w-full lg:h-screen">
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </main>
  );
}
