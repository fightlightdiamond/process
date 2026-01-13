/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-004
 * @Description   Navigation presentational component for global navigation
 * @Author        developer
 * @CreatedDate   2026-01-13
 * @Updater       developer
 * @LastUpdated   2026-01-13
 */

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenubarModule } from "primeng/menubar";
import { MenuItem } from "primeng/api";
import { NavItem } from "../../models/layout.model";

/**
 * NavigationComponent - Presentational component for global navigation
 *
 * Uses PrimeNG Menubar for consistent UI.
 * Displays navigation items with active state highlighting.
 * Emits events for navigation interactions.
 *
 * @example
 * ```html
 * <app-navigation
 *   [items]="navItems"
 *   [activeRoute]="'/home'"
 *   (navigate)="onNavigate($event)"
 * ></app-navigation>
 * ```
 */
@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  /** Array of navigation items to display */
  @Input() set items(value: NavItem[]) {
    this._items = value;
    this.menuItems = this.convertToMenuItems(value);
  }
  get items(): NavItem[] {
    return this._items;
  }

  /** Currently active route for highlighting */
  @Input() set activeRoute(value: string) {
    this._activeRoute = value;
    this.updateMenuItems();
  }
  get activeRoute(): string {
    return this._activeRoute;
  }

  /** Event emitted when a navigation item is clicked */
  @Output() readonly navigate = new EventEmitter<string>();

  /** Internal storage for items */
  private _items: NavItem[] = [];
  private _activeRoute: string = "";

  /** Converted PrimeNG MenuItem array */
  menuItems: MenuItem[] = [];

  /**
   * Converts NavItem array to PrimeNG MenuItem array
   * @param items - Array of NavItem
   * @returns Array of MenuItem for PrimeNG Menubar
   */
  private convertToMenuItems(items: NavItem[]): MenuItem[] {
    return items.map((item) => ({
      label: item.label,
      icon: item.icon,
      command: () => this.onItemClick(item),
      styleClass: this.isActive(item) ? "active-nav-item" : undefined,
      // Store original route for reference
      id: item.route,
    }));
  }

  /**
   * Updates menu items when activeRoute changes
   */
  private updateMenuItems(): void {
    if (this._items.length > 0) {
      this.menuItems = this.convertToMenuItems(this._items);
    }
  }

  /**
   * Checks if a navigation item is currently active
   * @param item - The navigation item to check
   * @returns true if the item is active
   */
  private isActive(item: NavItem): boolean {
    return item.active === true || item.route === this._activeRoute;
  }

  /**
   * Handles navigation item click
   * @param item - The navigation item clicked
   */
  private onItemClick(item: NavItem): void {
    this.navigate.emit(item.route);
  }
}
