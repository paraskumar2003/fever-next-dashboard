import { Suspense, useState } from "react";
import { menuItems } from "./data.sidebar";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MenuItem } from "./types";
import "./PageLayout.css";

export * from "./Header";
export * from "./DropDownMenu";

export function PageLayout({ children }: { children: React.ReactNode }) {
  const [sidebar, setSidebar] = useState<{
    show: boolean;
    menuItems: MenuItem[];
  }>({ show: true, menuItems: menuItems });

  return (
    <div className="layout-container">
      {/* Header */}
      <Header
        onHambugerClick={() => {
          setSidebar({ ...sidebar, show: true, menuItems: menuItems });
        }}
      />

      {/* Main Content Layout */}
      <Sidebar
        menuItems={menuItems}
        isOpen={sidebar.show}
        onClose={() => {
          setSidebar({ ...sidebar, show: false });
        }}
      />
      <main className="content flex-1 overflow-scroll p-4">{children}</main>
    </div>
  );
}
