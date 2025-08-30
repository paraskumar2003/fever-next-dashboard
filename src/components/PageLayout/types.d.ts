export interface MenuItem {
  id: string;
  label: string;
  icon?: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
  path?: string;
  children?: MenuItem[];
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

interface HeaderProps {
  onHambugerClick?: () => void;
}
