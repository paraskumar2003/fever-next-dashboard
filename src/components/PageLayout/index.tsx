import { Header } from "./Header";

export * from "./Header";
export * from "./DropDownMenu";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
