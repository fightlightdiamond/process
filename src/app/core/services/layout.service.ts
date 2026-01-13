import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { NavItem, BreadcrumbItem } from "../../shared";

export interface LayoutConfig {
  title: string;
  navItems: NavItem[];
  breadcrumbItems: BreadcrumbItem[];
  footerLinks: { label: string; url: string }[];
  showBreadcrumb?: boolean;
  showActionArea?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  private layoutConfigSubject = new BehaviorSubject<LayoutConfig>({
    title: "Application",
    navItems: [],
    breadcrumbItems: [],
    footerLinks: [],
    showBreadcrumb: true,
    showActionArea: false,
  });

  public layoutConfig$: Observable<LayoutConfig> =
    this.layoutConfigSubject.asObservable();

  constructor() {}

  /**
   * Update the entire layout configuration
   */
  setLayoutConfig(config: LayoutConfig): void {
    this.layoutConfigSubject.next(config);
  }

  /**
   * Update only the title
   */
  setTitle(title: string): void {
    const currentConfig = this.layoutConfigSubject.value;
    this.layoutConfigSubject.next({
      ...currentConfig,
      title,
    });
  }

  /**
   * Update navigation items
   */
  setNavItems(navItems: NavItem[]): void {
    const currentConfig = this.layoutConfigSubject.value;
    this.layoutConfigSubject.next({
      ...currentConfig,
      navItems,
    });
  }

  /**
   * Update breadcrumb items
   */
  setBreadcrumbItems(breadcrumbItems: BreadcrumbItem[]): void {
    const currentConfig = this.layoutConfigSubject.value;
    this.layoutConfigSubject.next({
      ...currentConfig,
      breadcrumbItems,
    });
  }

  /**
   * Update footer links
   */
  setFooterLinks(footerLinks: { label: string; url: string }[]): void {
    const currentConfig = this.layoutConfigSubject.value;
    this.layoutConfigSubject.next({
      ...currentConfig,
      footerLinks,
    });
  }

  /**
   * Get current layout configuration
   */
  getCurrentConfig(): LayoutConfig {
    return this.layoutConfigSubject.value;
  }
}
