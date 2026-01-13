/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-006
 * @Description   Footer presentational component for copyright and links
 * @Author        developer
 * @CreatedDate   2026-01-13
 * @Updater       developer
 * @LastUpdated   2026-01-13
 */

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";

/**
 * FooterComponent - Presentational component for application footer
 *
 * Uses PrimeNG Toolbar for consistent UI.
 * Displays copyright information and footer links.
 *
 * @example
 * ```html
 * <app-footer
 *   [copyright]="'© 2026 My Company'"
 *   [links]="footerLinks"
 * ></app-footer>
 * ```
 */
@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  /** Copyright text to display */
  @Input() copyright: string = "";

  /** Array of footer links */
  @Input() links: { label: string; url: string }[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  /**
   * Handles footer link click
   * @param url - The URL to navigate to
   */
  onLinkClick(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }
}
