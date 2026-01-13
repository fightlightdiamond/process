import { Injectable } from "@angular/core";
import { LayoutConfig } from "./layout.service";

@Injectable({
  providedIn: "root",
})
export class LayoutConfigService {
  constructor() {}

  /**
   * Get layout configuration for Todo feature
   */
  getTodoLayoutConfig(): LayoutConfig {
    return {
      title: "Todo App",
      navItems: [
        { label: "Home", route: "/", icon: "home" },
        { label: "Todos", route: "/", icon: "task" },
        { label: "Users", route: "/users", icon: "people" },
      ],
      breadcrumbItems: [{ label: "Home", route: "/" }, { label: "Todo List" }],
      footerLinks: [
        { label: "About", url: "/about" },
        { label: "Help", url: "/help" },
      ],
      showBreadcrumb: true,
      showActionArea: false,
    };
  }

  /**
   * Get layout configuration for User feature
   */
  getUserLayoutConfig(): LayoutConfig {
    return {
      title: "User Management",
      navItems: [
        { label: "Home", route: "/", icon: "home" },
        { label: "Todos", route: "/", icon: "task" },
        { label: "Users", route: "/users", icon: "people" },
      ],
      breadcrumbItems: [
        { label: "Home", route: "/" },
        { label: "User Management" },
      ],
      footerLinks: [
        { label: "About", url: "/about" },
        { label: "Help", url: "/help" },
        { label: "Privacy", url: "/privacy" },
      ],
      showBreadcrumb: true,
      showActionArea: true,
    };
  }

  /**
   * Get layout configuration for Dashboard feature
   */
  getDashboardLayoutConfig(): LayoutConfig {
    return {
      title: "Dashboard",
      navItems: [
        { label: "Dashboard", route: "/dashboard", icon: "dashboard" },
        { label: "Todos", route: "/", icon: "task" },
        { label: "Users", route: "/users", icon: "people" },
        { label: "Reports", route: "/reports", icon: "analytics" },
      ],
      breadcrumbItems: [{ label: "Home", route: "/" }, { label: "Dashboard" }],
      footerLinks: [
        { label: "About", url: "/about" },
        { label: "Help", url: "/help" },
        { label: "Support", url: "/support" },
      ],
      showBreadcrumb: true,
      showActionArea: true,
    };
  }

  /**
   * Get default layout configuration
   */
  getDefaultLayoutConfig(): LayoutConfig {
    return {
      title: "Grid System Demo",
      navItems: [
        { label: "Home", route: "/", icon: "home" },
        { label: "Grid Demo", route: "/grid", icon: "grid_on" },
      ],
      breadcrumbItems: [{ label: "Home", route: "/" }, { label: "Grid Demo" }],
      footerLinks: [
        { label: "About", url: "/about" },
        { label: "Help", url: "/help" },
      ],
      showBreadcrumb: true,
      showActionArea: false,
    };
  }
}
