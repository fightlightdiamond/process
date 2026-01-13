/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-002
 * @Description   Page layout container component with content projection
 * @Author        developer
 * @CreatedDate   2026-01-13
 * @Updater       developer
 * @LastUpdated   2026-01-13
 */

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  HostListener,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { DEFAULT_LAYOUT_CONFIG } from "../../models/layout.model";

/**
 * PageLayoutComponent - Structural container for page layout
 *
 * Provides a standardized page layout framework with:
 * - Fixed-height header, navigation, breadcrumb, and footer areas
 * - Flexible main content area with screen name and action sections
 * - Content projection slots for each layout area
 * - CSS custom properties for theming support
 *
 * @example
 * ```html
 * <app-page-layout [showBreadcrumb]="true" [showActionArea]="true">
 *   <div header>Header content</div>
 *   <div navigation>Navigation content</div>
 *   <div breadcrumb>Breadcrumb content</div>
 *   <div screenName>Page Title</div>
 *   <div actions>Action buttons</div>
 *   <div content>Main content</div>
 *   <div footer>Footer content</div>
 * </app-page-layout>
 * ```
 */
@Component({
  selector: "app-page-layout",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./page-layout.component.html",
  styleUrls: ["./page-layout.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent implements OnInit {
  /** Whether to show the breadcrumb area */
  @Input() showBreadcrumb: boolean = true;

  /** Whether to show the action button area */
  @Input() showActionArea: boolean = true;

  /** Whether to show the screen name area */
  @Input() showScreenName: boolean = true;

  /** Height of the header area (default: 80px) */
  @Input() headerHeight: string = DEFAULT_LAYOUT_CONFIG.headerHeight;

  /** Height of the navigation area (default: 55px) */
  @Input() navigationHeight: string = DEFAULT_LAYOUT_CONFIG.navigationHeight;

  /** Height of the breadcrumb area (default: 40px) */
  @Input() breadcrumbHeight: string = DEFAULT_LAYOUT_CONFIG.breadcrumbHeight;

  /** Height of the screen name display area (default: 100px) */
  @Input() screenNameHeight: string = DEFAULT_LAYOUT_CONFIG.screenNameHeight;

  /** Height of the action button area (default: 80px) */
  @Input() actionAreaHeight: string = DEFAULT_LAYOUT_CONFIG.actionAreaHeight;

  /** Height of the footer area (default: 75px) */
  @Input() footerHeight: string = DEFAULT_LAYOUT_CONFIG.footerHeight;

  /** Current viewport height */
  private currentViewportHeight: number = 0;

  /** Reference browser height for calculations (768px) */
  private readonly referenceBrowserHeight: number = 768;

  /** Title bar height (73px) */
  private readonly titleBarHeight: number = 73;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.updateViewportHeight();
    this.calculateMainContentHeight();
  }

  /**
   * Handle window resize events
   */
  @HostListener("window:resize")
  onWindowResize(): void {
    this.updateViewportHeight();
    this.calculateMainContentHeight();
  }

  /**
   * Update current viewport height
   */
  private updateViewportHeight(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentViewportHeight = window.innerHeight;
    } else {
      // Default height for SSR
      this.currentViewportHeight = this.referenceBrowserHeight;
    }
  }

  /**
   * Calculate and set main content area height
   * Formula: Browser_Height - Title_Bar_Height(73px) - Header_Area - Navigation_Area - Breadcrumb_Area - Footer_Area
   */
  private calculateMainContentHeight(): void {
    const headerHeightPx = this.parseHeightValue(this.headerHeight);
    const navigationHeightPx = this.parseHeightValue(this.navigationHeight);
    const breadcrumbHeightPx = this.showBreadcrumb
      ? this.parseHeightValue(this.breadcrumbHeight)
      : 0;
    const footerHeightPx = this.parseHeightValue(this.footerHeight);

    // Calculate main content height based on reference formula
    const fixedAreasHeight =
      this.titleBarHeight +
      headerHeightPx +
      navigationHeightPx +
      breadcrumbHeightPx +
      footerHeightPx;
    const mainContentHeight = Math.max(
      0,
      this.currentViewportHeight - fixedAreasHeight
    );

    // Set CSS custom property for main content height
    const hostElement = this.elementRef.nativeElement;
    hostElement.style.setProperty(
      "--main-content-height",
      `${mainContentHeight}px`
    );
  }

  /**
   * Parse height value from string to number (assumes px units)
   */
  private parseHeightValue(heightValue: string): number {
    const parsed = parseInt(heightValue.replace("px", ""), 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Get calculated main content height for testing
   */
  getCalculatedMainContentHeight(): number {
    const hostElement = this.elementRef.nativeElement;
    const mainContentHeight = hostElement.style.getPropertyValue(
      "--main-content-height"
    );
    return this.parseHeightValue(mainContentHeight);
  }
}
