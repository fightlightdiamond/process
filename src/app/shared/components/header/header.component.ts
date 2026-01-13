/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-003
 * @Description   Header presentational component for application branding
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
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";

/**
 * HeaderComponent - Presentational component for application header
 *
 * Uses PrimeNG Toolbar for consistent UI.
 * Displays application branding with logo and title.
 * Emits events for user interactions.
 *
 * @example
 * ```html
 * <app-header
 *   [title]="'My Application'"
 *   [logoUrl]="'/assets/logo.png'"
 *   (logoClick)="onLogoClick()"
 * ></app-header>
 * ```
 */
@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  /** Application title to display in the header */
  @Input() title: string = "";

  /** URL for the logo image */
  @Input() logoUrl: string = "";

  /** Event emitted when the logo is clicked */
  @Output() readonly logoClick = new EventEmitter<void>();

  /**
   * Handles logo click event
   */
  onLogoClick(): void {
    this.logoClick.emit();
  }
}
