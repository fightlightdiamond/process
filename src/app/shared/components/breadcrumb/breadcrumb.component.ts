/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-005
 * @Description   Breadcrumb presentational component for location hierarchy display
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
import { BreadcrumbModule } from "primeng/breadcrumb";
import { MenuItem } from "primeng/api";
import { BreadcrumbItem } from "../../models/layout.model";

/**
 * BreadcrumbComponent - Presentational component for breadcrumb navigation
 *
 * Uses PrimeNG Breadcrumb component for consistent UI.
 * Displays a breadcrumb trail showing the current location hierarchy.
 * Emits events for navigation interactions.
 *
 * @example
 * ```html
 * <app-breadcrumb
 *   [items]="breadcrumbItems"
 *   (navigate)="onNavigate($event)"
 * ></app-breadcrumb>
 * ```
 */
@Component({
  selector: "app-breadcrumb",
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  /** Array of breadcrumb items to display */
  @Input() set items(value: BreadcrumbItem[]) {
    this._items = value;
    this.menuItems = this.convertToMenuItems(value);
  }
  get items(): BreadcrumbItem[] {
    return this._items;
  }

  /** Home item for breadcrumb (optional) */
  @Input() home: MenuItem | undefined;

  /** Event emitted when a breadcrumb item is clicked */
  @Output() readonly navigate = new EventEmitter<string>();

  /** Internal storage for items */
  private _items: BreadcrumbItem[] = [];

  /** Converted PrimeNG MenuItem array */
  menuItems: MenuItem[] = [];

  /**
   * Converts BreadcrumbItem array to PrimeNG MenuItem array
   * @param items - Array of BreadcrumbItem
   * @returns Array of MenuItem for PrimeNG Breadcrumb
   */
  private convertToMenuItems(items: BreadcrumbItem[]): MenuItem[] {
    return items.map((item, index) => {
      const isLast = index === items.length - 1;
      return {
        label: item.label,
        // Only add command for navigable items (has route and not last)
        command:
          item.route && !isLast ? () => this.onItemClick(item) : undefined,
        // Style last item differently
        styleClass: isLast ? "breadcrumb-current" : undefined,
      };
    });
  }

  /**
   * Handles breadcrumb item click
   * @param item - The breadcrumb item clicked
   */
  private onItemClick(item: BreadcrumbItem): void {
    if (item.route) {
      this.navigate.emit(item.route);
    }
  }

  /**
   * Handles home item click
   */
  onHomeClick(): void {
    if (this.home?.url) {
      this.navigate.emit(this.home.url);
    }
  }
}
