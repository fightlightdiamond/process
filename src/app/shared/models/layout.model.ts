/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-001
 * @Description   Layout configuration interfaces and default values
 * @Author        developer
 * @CreatedDate   2026-01-13
 * @Updater       developer
 * @LastUpdated   2026-01-13
 */

/**
 * Configuration interface for layout height values
 * Uses CSS custom properties for theming support
 */
export interface LayoutConfig {
  headerHeight: string;
  navigationHeight: string;
  breadcrumbHeight: string;
  screenNameHeight: string;
  actionAreaHeight: string;
  footerHeight: string;
}

/**
 * Default layout configuration based on 768px browser height reference
 * Header: 80px, Navigation: 55px, Breadcrumb: 40px
 * Screen Name: 100px, Action Area: 80px, Footer: 75px
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  headerHeight: "80px",
  navigationHeight: "55px",
  breadcrumbHeight: "40px",
  screenNameHeight: "100px",
  actionAreaHeight: "80px",
  footerHeight: "75px",
};

/**
 * Navigation item interface for global navigation
 */
export interface NavItem {
  label: string;
  route: string;
  icon?: string;
  active?: boolean;
}

/**
 * Breadcrumb item interface for location hierarchy display
 */
export interface BreadcrumbItem {
  label: string;
  route?: string;
}
