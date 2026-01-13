/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-002
 * @Description   Property-based tests for PageLayoutComponent
 * @Author        developer
 * @CreatedDate   2026-01-13
 * @Updater       developer
 * @LastUpdated   2026-01-13
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import * as fc from "fast-check";
import { PageLayoutComponent } from "./page-layout.component";
import { DEFAULT_LAYOUT_CONFIG } from "../../models/layout.model";

/**
 * Test host component for testing content projection
 */
@Component({
  selector: "app-test-host",
  standalone: true,
  imports: [PageLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-page-layout
    [showBreadcrumb]="showBreadcrumb"
    [showActionArea]="showActionArea"
    [headerHeight]="headerHeight"
    [navigationHeight]="navigationHeight"
    [breadcrumbHeight]="breadcrumbHeight"
    [screenNameHeight]="screenNameHeight"
    [actionAreaHeight]="actionAreaHeight"
    [footerHeight]="footerHeight"
    ><div header class="test-header">Header Content</div>
    <div navigation class="test-navigation">Navigation Content</div>
    <div breadcrumb class="test-breadcrumb">Breadcrumb Content</div>
    <div screenName class="test-screen-name">Screen Name Content</div>
    <div actions class="test-actions">Actions Content</div>
    <div content class="test-content">Main Content</div>
    <div footer class="test-footer">Footer Content</div></app-page-layout
  >`,
})
class TestHostComponent {
  showBreadcrumb = true;
  showActionArea = true;
  headerHeight = DEFAULT_LAYOUT_CONFIG.headerHeight;
  navigationHeight = DEFAULT_LAYOUT_CONFIG.navigationHeight;
  breadcrumbHeight = DEFAULT_LAYOUT_CONFIG.breadcrumbHeight;
  screenNameHeight = DEFAULT_LAYOUT_CONFIG.screenNameHeight;
  actionAreaHeight = DEFAULT_LAYOUT_CONFIG.actionAreaHeight;
  footerHeight = DEFAULT_LAYOUT_CONFIG.footerHeight;
}

/**
 * Helper function to filter content that's safe for Angular templates
 * Ensures content has visible characters (not just whitespace) and no special template characters
 */
function safeTemplateContent(s: string): boolean {
  const trimmed = s.trim();
  // Must have at least one non-whitespace character
  if (trimmed.length === 0) return false;
  // Must not contain only whitespace characters
  if (!/\S/.test(s)) return false;
  // Must not contain Angular template special characters
  return (
    !s.includes("@") &&
    !s.includes("{") &&
    !s.includes("}") &&
    !s.includes("<") &&
    !s.includes(">") &&
    !s.includes("&") &&
    !s.includes("$") &&
    !s.includes("`") &&
    !s.includes("\\")
  );
}

describe("PageLayoutComponent", () => {
  let component: PageLayoutComponent;
  let fixture: ComponentFixture<PageLayoutComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLayoutComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  describe("Component Creation", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should have default input values", () => {
      expect(component.showBreadcrumb).toBe(true);
      expect(component.showActionArea).toBe(true);
      expect(component.headerHeight).toBe("80px");
      expect(component.navigationHeight).toBe("55px");
      expect(component.breadcrumbHeight).toBe("40px");
      expect(component.screenNameHeight).toBe("100px");
      expect(component.actionAreaHeight).toBe("80px");
      expect(component.footerHeight).toBe("75px");
    });
  });

  /**
   * Property 1: Fixed-height areas maintain specified heights
   * **Validates: Requirements 1.1, 2.1, 3.1, 4.4, 4.5, 5.1**
   *
   * For any layout area with a specified fixed height, THE rendered element
   * SHALL have a computed height equal to the specified value.
   */
  describe("Property 1: Fixed-height areas maintain specified heights", () => {
    it("Property: header area maintains specified height", () => {
      // Feature: page-layout, Property 1: Fixed-height areas maintain specified heights
      // **Validates: Requirements 1.1, 2.1, 3.1, 4.4, 4.5, 5.1**
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 200 }),
          (heightValue: number) => {
            hostComponent.headerHeight = `${heightValue}px`;
            hostFixture.detectChanges();

            const headerEl =
              hostFixture.nativeElement.querySelector(".layout-header");
            const computedStyle = window.getComputedStyle(headerEl);

            return computedStyle.height === `${heightValue}px`;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("Property: navigation area maintains specified height", () => {
      // Feature: page-layout, Property 1: Fixed-height areas maintain specified heights
      // **Validates: Requirements 1.1, 2.1, 3.1, 4.4, 4.5, 5.1**
      fc.assert(
        fc.property(
          fc.integer({ min: 30, max: 150 }),
          (heightValue: number) => {
            hostComponent.navigationHeight = `${heightValue}px`;
            hostFixture.detectChanges();

            const navEl =
              hostFixture.nativeElement.querySelector(".layout-navigation");
            const computedStyle = window.getComputedStyle(navEl);

            return computedStyle.height === `${heightValue}px`;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("Property: breadcrumb area maintains specified height when visible", () => {
      // Feature: page-layout, Property 1: Fixed-height areas maintain specified heights
      // **Validates: Requirements 1.1, 2.1, 3.1, 4.4, 4.5, 5.1**
      fc.assert(
        fc.property(
          fc.integer({ min: 20, max: 100 }),
          (heightValue: number) => {
            hostComponent.showBreadcrumb = true;
            hostComponent.breadcrumbHeight = `${heightValue}px`;
            hostFixture.detectChanges();

            const breadcrumbEl =
              hostFixture.nativeElement.querySelector(".layout-breadcrumb");
            if (!breadcrumbEl) return false;

            const computedStyle = window.getComputedStyle(breadcrumbEl);
            return computedStyle.height === `${heightValue}px`;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("Property: screen name area maintains specified height", () => {
      // Feature: page-layout, Property 1: Fixed-height areas maintain specified heights
      // **Validates: Requirements 1.1, 2.1, 3.1, 4.4, 4.5, 5.1**
      fc.assert(
        fc.property(
          fc.integer({ min: 50, max: 200 }),
          (heightValue: number) => {
            hostComponent.screenNameHeight = `${heightValue}px`;
            hostFixture.detectChanges();

            const screenNameEl =
              hostFixture.nativeElement.querySelector(".screen-name-area");
            const computedStyle = window.getComputedStyle(screenNameEl);

            return computedStyle.height === `${heightValue}px`;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("Property: action area maintains specified height when visible", () => {
      // Feature: page-layout, Property 1: Fixed-height areas maintain specified heights
      // **Validates: Requirements 1.1, 2.1, 3.1, 4.4, 4.5, 5.1**
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 150 }),
          (heightValue: number) => {
            hostComponent.showActionArea = true;
            hostComponent.actionAreaHeight = `${heightValue}px`;
            hostFixture.detectChanges();

            const actionEl =
              hostFixture.nativeElement.querySelector(".action-area");
            if (!actionEl) return false;

            const computedStyle = window.getComputedStyle(actionEl);
            return computedStyle.height === `${heightValue}px`;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("Property: footer area maintains specified height", () => {
      // Feature: page-layout, Property 1: Fixed-height areas maintain specified heights
      // **Validates: Requirements 1.1, 2.1, 3.1, 4.4, 4.5, 5.1**
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 150 }),
          (heightValue: number) => {
            hostComponent.footerHeight = `${heightValue}px`;
            hostFixture.detectChanges();

            const footerEl =
              hostFixture.nativeElement.querySelector(".layout-footer");
            const computedStyle = window.getComputedStyle(footerEl);

            return computedStyle.height === `${heightValue}px`;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 5: Optional areas can be hidden via inputs
   * **Validates: Requirements 7.3, 7.4**
   *
   * For any boolean value passed to showBreadcrumb or showActionArea inputs,
   * WHEN the value is false, THE corresponding layout area SHALL NOT be rendered in the DOM,
   * AND WHEN the value is true, THE corresponding layout area SHALL be rendered.
   */
  describe("Property 5: Optional areas can be hidden via inputs", () => {
    it("Property: breadcrumb area visibility matches showBreadcrumb input", () => {
      // Feature: page-layout, Property 5: Optional areas can be hidden via inputs
      // **Validates: Requirements 7.3, 7.4**
      fc.assert(
        fc.property(fc.boolean(), (showBreadcrumb: boolean) => {
          hostComponent.showBreadcrumb = showBreadcrumb;
          hostFixture.detectChanges();

          const breadcrumbEl =
            hostFixture.nativeElement.querySelector(".layout-breadcrumb");
          const isRendered = breadcrumbEl !== null;

          return isRendered === showBreadcrumb;
        }),
        { numRuns: 100 }
      );
    });

    it("Property: action area visibility matches showActionArea input", () => {
      // Feature: page-layout, Property 5: Optional areas can be hidden via inputs
      // **Validates: Requirements 7.3, 7.4**
      fc.assert(
        fc.property(fc.boolean(), (showActionArea: boolean) => {
          hostComponent.showActionArea = showActionArea;
          hostFixture.detectChanges();

          const actionEl =
            hostFixture.nativeElement.querySelector(".action-area");
          const isRendered = actionEl !== null;

          return isRendered === showActionArea;
        }),
        { numRuns: 100 }
      );
    });

    it("Property: both optional areas can be independently controlled", () => {
      // Feature: page-layout, Property 5: Optional areas can be hidden via inputs
      // **Validates: Requirements 7.3, 7.4**
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.boolean(),
          (showBreadcrumb: boolean, showActionArea: boolean) => {
            hostComponent.showBreadcrumb = showBreadcrumb;
            hostComponent.showActionArea = showActionArea;
            hostFixture.detectChanges();

            const breadcrumbEl =
              hostFixture.nativeElement.querySelector(".layout-breadcrumb");
            const actionEl =
              hostFixture.nativeElement.querySelector(".action-area");

            const breadcrumbCorrect =
              (breadcrumbEl !== null) === showBreadcrumb;
            const actionCorrect = (actionEl !== null) === showActionArea;

            return breadcrumbCorrect && actionCorrect;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: Main content area fills remaining space
   * **Validates: Requirements 4.1, 4.3, 6.1, 6.2**
   *
   * For any viewport height, THE Main_Content_Area height SHALL equal the viewport height
   * minus the sum of all fixed-height areas (Header + Navigation + Breadcrumb + Footer),
   * and THE content-area within Main_Content_Area SHALL enable vertical scrolling when
   * content exceeds available space.
   */
  describe("Property 3: Main content area fills remaining space", () => {
    it("Property: main content height equals viewport minus fixed areas", () => {
      // Feature: page-layout, Property 3: Main content area fills remaining space
      // **Validates: Requirements 4.1, 4.3, 6.1, 6.2**
      fc.assert(
        fc.property(
          fc.integer({ min: 400, max: 1200 }), // viewport height
          fc.integer({ min: 60, max: 120 }), // header height
          fc.integer({ min: 40, max: 80 }), // navigation height
          fc.integer({ min: 30, max: 60 }), // breadcrumb height
          fc.integer({ min: 60, max: 120 }), // footer height
          fc.boolean(), // show breadcrumb
          (
            viewportHeight: number,
            headerHeight: number,
            navigationHeight: number,
            breadcrumbHeight: number,
            footerHeight: number,
            showBreadcrumb: boolean
          ) => {
            // Mock window.innerHeight
            Object.defineProperty(window, "innerHeight", {
              writable: true,
              configurable: true,
              value: viewportHeight,
            });

            // Set component inputs
            hostComponent.headerHeight = `${headerHeight}px`;
            hostComponent.navigationHeight = `${navigationHeight}px`;
            hostComponent.breadcrumbHeight = `${breadcrumbHeight}px`;
            hostComponent.footerHeight = `${footerHeight}px`;
            hostComponent.showBreadcrumb = showBreadcrumb;
            hostFixture.detectChanges();

            // Get the component instance
            const pageLayoutComponent = hostFixture.debugElement.query(
              (el) => el.componentInstance instanceof PageLayoutComponent
            )?.componentInstance as PageLayoutComponent;

            if (!pageLayoutComponent) return false;

            // Trigger resize to recalculate
            pageLayoutComponent.onWindowResize();
            hostFixture.detectChanges();

            // Calculate expected main content height
            const titleBarHeight = 73;
            const actualBreadcrumbHeight = showBreadcrumb
              ? breadcrumbHeight
              : 0;
            const fixedAreasHeight =
              titleBarHeight +
              headerHeight +
              navigationHeight +
              actualBreadcrumbHeight +
              footerHeight;
            const expectedMainContentHeight = Math.max(
              0,
              viewportHeight - fixedAreasHeight
            );

            // Get actual calculated height
            const actualMainContentHeight =
              pageLayoutComponent.getCalculatedMainContentHeight();

            return actualMainContentHeight === expectedMainContentHeight;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("Property: content area enables vertical scrolling", () => {
      // Feature: page-layout, Property 3: Main content area fills remaining space
      // **Validates: Requirements 4.1, 4.3, 6.1, 6.2**
      fc.assert(
        fc.property(
          fc.integer({ min: 400, max: 800 }),
          (viewportHeight: number) => {
            // Mock window.innerHeight
            Object.defineProperty(window, "innerHeight", {
              writable: true,
              configurable: true,
              value: viewportHeight,
            });

            hostFixture.detectChanges();

            const contentAreaEl =
              hostFixture.nativeElement.querySelector(".content-area");
            const computedStyle = window.getComputedStyle(contentAreaEl);

            // Content area should have overflow-y: auto for scrolling
            return computedStyle.overflowY === "auto";
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: Fixed heights are maintained across viewport widths
   * **Validates: Requirements 1.4, 2.4, 3.4, 5.4, 6.3**
   *
   * For any viewport width, THE fixed-height layout areas (Header, Navigation, Breadcrumb, Footer)
   * SHALL maintain their specified heights regardless of viewport width changes.
   */
  describe("Property 2: Fixed heights maintained across viewport widths", () => {
    it("Property: fixed areas maintain heights across viewport widths", () => {
      // Feature: page-layout, Property 2: Fixed heights maintained across viewport widths
      // **Validates: Requirements 1.4, 2.4, 3.4, 5.4, 6.3**
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 1920 }), // viewport width
          fc.integer({ min: 60, max: 120 }), // header height
          fc.integer({ min: 40, max: 80 }), // navigation height
          fc.integer({ min: 30, max: 60 }), // breadcrumb height
          fc.integer({ min: 60, max: 120 }), // footer height
          fc.boolean(), // show breadcrumb
          (
            viewportWidth: number,
            headerHeight: number,
            navigationHeight: number,
            breadcrumbHeight: number,
            footerHeight: number,
            showBreadcrumb: boolean
          ) => {
            // Mock window.innerWidth
            Object.defineProperty(window, "innerWidth", {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            // Set component inputs
            hostComponent.headerHeight = `${headerHeight}px`;
            hostComponent.navigationHeight = `${navigationHeight}px`;
            hostComponent.breadcrumbHeight = `${breadcrumbHeight}px`;
            hostComponent.footerHeight = `${footerHeight}px`;
            hostComponent.showBreadcrumb = showBreadcrumb;
            hostFixture.detectChanges();

            // Get the component instance and trigger resize
            const pageLayoutComponent = hostFixture.debugElement.query(
              (el: { componentInstance: unknown }) =>
                el.componentInstance instanceof PageLayoutComponent
            )?.componentInstance as PageLayoutComponent;

            if (!pageLayoutComponent) return false;

            pageLayoutComponent.onWindowResize();
            hostFixture.detectChanges();

            // Check that all fixed areas maintain their specified heights
            const headerEl =
              hostFixture.nativeElement.querySelector(".layout-header");
            const navEl =
              hostFixture.nativeElement.querySelector(".layout-navigation");
            const breadcrumbEl =
              hostFixture.nativeElement.querySelector(".layout-breadcrumb");
            const footerEl =
              hostFixture.nativeElement.querySelector(".layout-footer");

            const headerCorrect =
              window.getComputedStyle(headerEl).height === `${headerHeight}px`;
            const navCorrect =
              window.getComputedStyle(navEl).height === `${navigationHeight}px`;
            const breadcrumbCorrect = showBreadcrumb
              ? breadcrumbEl &&
                window.getComputedStyle(breadcrumbEl).height ===
                  `${breadcrumbHeight}px`
              : breadcrumbEl === null;
            const footerCorrect =
              window.getComputedStyle(footerEl).height === `${footerHeight}px`;

            return (
              headerCorrect && navCorrect && breadcrumbCorrect && footerCorrect
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it("Property: screen name and action areas maintain heights across viewport widths", () => {
      // Feature: page-layout, Property 2: Fixed heights maintained across viewport widths
      // **Validates: Requirements 1.4, 2.4, 3.4, 5.4, 6.3**
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 1920 }), // viewport width
          fc.integer({ min: 50, max: 150 }), // screen name height
          fc.integer({ min: 40, max: 120 }), // action area height
          fc.boolean(), // show action area
          (
            viewportWidth: number,
            screenNameHeight: number,
            actionAreaHeight: number,
            showActionArea: boolean
          ) => {
            // Mock window.innerWidth
            Object.defineProperty(window, "innerWidth", {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            // Set component inputs
            hostComponent.screenNameHeight = `${screenNameHeight}px`;
            hostComponent.actionAreaHeight = `${actionAreaHeight}px`;
            hostComponent.showActionArea = showActionArea;
            hostFixture.detectChanges();

            // Get the component instance and trigger resize
            const pageLayoutComponent = hostFixture.debugElement.query(
              (el: { componentInstance: unknown }) =>
                el.componentInstance instanceof PageLayoutComponent
            )?.componentInstance as PageLayoutComponent;

            if (!pageLayoutComponent) return false;

            pageLayoutComponent.onWindowResize();
            hostFixture.detectChanges();

            // Check that screen name and action areas maintain their specified heights
            const screenNameEl =
              hostFixture.nativeElement.querySelector(".screen-name-area");
            const actionEl =
              hostFixture.nativeElement.querySelector(".action-area");

            const screenNameCorrect =
              window.getComputedStyle(screenNameEl).height ===
              `${screenNameHeight}px`;
            const actionCorrect = showActionArea
              ? actionEl &&
                window.getComputedStyle(actionEl).height ===
                  `${actionAreaHeight}px`
              : actionEl === null;

            return screenNameCorrect && actionCorrect;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: Content projection renders in correct slots
   * **Validates: Requirements 7.2**
   *
   * For any content projected into the PageLayoutComponent using selector attributes
   * (header, navigation, breadcrumb, screenName, actions, content, footer),
   * THE projected content SHALL appear within the corresponding layout area element.
   */
  describe("Property 4: Content projection renders in correct slots", () => {
    it("Property: projected content appears in correct layout areas", () => {
      // Feature: page-layout, Property 4: Content projection renders in correct slots
      // **Validates: Requirements 7.2**
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter(safeTemplateContent), // header content
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter(safeTemplateContent), // navigation content
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter(safeTemplateContent), // breadcrumb content
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter(safeTemplateContent), // screen name content
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter(safeTemplateContent), // actions content
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter(safeTemplateContent), // main content
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter(safeTemplateContent), // footer content
          fc.boolean(), // show breadcrumb
          fc.boolean(), // show action area
          (
            headerContent: string,
            navigationContent: string,
            breadcrumbContent: string,
            screenNameContent: string,
            actionsContent: string,
            mainContent: string,
            footerContent: string,
            showBreadcrumb: boolean,
            showActionArea: boolean
          ) => {
            // Create a dynamic test host component with random content
            @Component({
              selector: `dynamic-test-host-${Math.random().toString(36).substr(2, 9)}`,
              standalone: true,
              imports: [PageLayoutComponent],
              changeDetection: ChangeDetectionStrategy.OnPush,
              template: `
                <app-page-layout
                  [showBreadcrumb]="showBreadcrumb"
                  [showActionArea]="showActionArea"
                >
                  <div header class="test-header">${headerContent}</div>
                  <div navigation class="test-navigation">
                    ${navigationContent}
                  </div>
                  <div breadcrumb class="test-breadcrumb">
                    ${breadcrumbContent}
                  </div>
                  <div screenName class="test-screen-name">
                    ${screenNameContent}
                  </div>
                  <div actions class="test-actions">${actionsContent}</div>
                  <div content class="test-content">${mainContent}</div>
                  <div footer class="test-footer">${footerContent}</div>
                </app-page-layout>
              `,
            })
            class DynamicTestHostComponent {
              showBreadcrumb = showBreadcrumb;
              showActionArea = showActionArea;
            }

            const dynamicFixture = TestBed.createComponent(
              DynamicTestHostComponent
            );
            dynamicFixture.detectChanges();

            // Check that content appears in the correct layout areas
            const headerEl = dynamicFixture.nativeElement.querySelector(
              ".layout-header .test-header"
            );
            const navigationEl = dynamicFixture.nativeElement.querySelector(
              ".layout-navigation .test-navigation"
            );
            const breadcrumbEl = dynamicFixture.nativeElement.querySelector(
              ".layout-breadcrumb .test-breadcrumb"
            );
            const screenNameEl = dynamicFixture.nativeElement.querySelector(
              ".screen-name-area .test-screen-name"
            );
            const actionsEl = dynamicFixture.nativeElement.querySelector(
              ".action-area .test-actions"
            );
            const contentEl = dynamicFixture.nativeElement.querySelector(
              ".content-area .test-content"
            );
            const footerEl = dynamicFixture.nativeElement.querySelector(
              ".layout-footer .test-footer"
            );

            // Verify content is projected to correct slots
            const headerCorrect =
              headerEl && headerEl.textContent?.trim() === headerContent.trim();
            const navigationCorrect =
              navigationEl &&
              navigationEl.textContent?.trim() === navigationContent.trim();
            const breadcrumbCorrect = showBreadcrumb
              ? breadcrumbEl &&
                breadcrumbEl.textContent?.trim() === breadcrumbContent.trim()
              : breadcrumbEl === null;
            const screenNameCorrect =
              screenNameEl &&
              screenNameEl.textContent?.trim() === screenNameContent.trim();
            const actionsCorrect = showActionArea
              ? actionsEl &&
                actionsEl.textContent?.trim() === actionsContent.trim()
              : actionsEl === null;
            const contentCorrect =
              contentEl && contentEl.textContent?.trim() === mainContent.trim();
            const footerCorrect =
              footerEl && footerEl.textContent?.trim() === footerContent.trim();

            return (
              headerCorrect &&
              navigationCorrect &&
              breadcrumbCorrect &&
              screenNameCorrect &&
              actionsCorrect &&
              contentCorrect &&
              footerCorrect
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it("Property: empty content projection renders empty slots", () => {
      // Feature: page-layout, Property 4: Content projection renders in correct slots
      // **Validates: Requirements 7.2**
      fc.assert(
        fc.property(
          fc.boolean(), // show breadcrumb
          fc.boolean(), // show action area
          (showBreadcrumb: boolean, showActionArea: boolean) => {
            // Create a test host component with no projected content
            @Component({
              selector: `empty-test-host-${Math.random().toString(36).substr(2, 9)}`,
              standalone: true,
              imports: [PageLayoutComponent],
              changeDetection: ChangeDetectionStrategy.OnPush,
              template: `
                <app-page-layout
                  [showBreadcrumb]="showBreadcrumb"
                  [showActionArea]="showActionArea"
                >
                  <!-- No projected content -->
                </app-page-layout>
              `,
            })
            class EmptyTestHostComponent {
              showBreadcrumb = showBreadcrumb;
              showActionArea = showActionArea;
            }

            const emptyFixture = TestBed.createComponent(
              EmptyTestHostComponent
            );
            emptyFixture.detectChanges();

            // Check that layout areas exist but are empty (no projected content with test classes)
            const headerEl =
              emptyFixture.nativeElement.querySelector(".layout-header");
            const navigationEl =
              emptyFixture.nativeElement.querySelector(".layout-navigation");
            const breadcrumbEl =
              emptyFixture.nativeElement.querySelector(".layout-breadcrumb");
            const screenNameEl =
              emptyFixture.nativeElement.querySelector(".screen-name-area");
            const actionsEl =
              emptyFixture.nativeElement.querySelector(".action-area");
            const contentEl =
              emptyFixture.nativeElement.querySelector(".content-area");
            const footerEl =
              emptyFixture.nativeElement.querySelector(".layout-footer");

            // Verify required layout areas exist (header, navigation, screen-name, content, footer always exist)
            const headerExists = headerEl !== null;
            const navigationExists = navigationEl !== null;
            const screenNameExists = screenNameEl !== null;
            const contentExists = contentEl !== null;
            const footerExists = footerEl !== null;

            // Verify optional areas exist only when their flags are true
            const breadcrumbCorrect = showBreadcrumb
              ? breadcrumbEl !== null
              : breadcrumbEl === null;
            const actionsCorrect = showActionArea
              ? actionsEl !== null
              : actionsEl === null;

            // Verify no test content was projected (areas should be empty or contain only whitespace)
            const headerEmpty =
              headerEl && headerEl.querySelector(".test-header") === null;
            const navigationEmpty =
              navigationEl &&
              navigationEl.querySelector(".test-navigation") === null;
            const screenNameEmpty =
              screenNameEl &&
              screenNameEl.querySelector(".test-screen-name") === null;
            const contentEmpty =
              contentEl && contentEl.querySelector(".test-content") === null;
            const footerEmpty =
              footerEl && footerEl.querySelector(".test-footer") === null;

            return (
              headerExists &&
              navigationExists &&
              screenNameExists &&
              contentExists &&
              footerExists &&
              breadcrumbCorrect &&
              actionsCorrect &&
              headerEmpty &&
              navigationEmpty &&
              screenNameEmpty &&
              contentEmpty &&
              footerEmpty
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it("Property: content projection works with mixed projected and empty slots", () => {
      // Feature: page-layout, Property 4: Content projection renders in correct slots
      // **Validates: Requirements 7.2**
      fc.assert(
        fc.property(
          fc.boolean(), // project header
          fc.boolean(), // project navigation
          fc.boolean(), // project breadcrumb
          fc.boolean(), // project screen name
          fc.boolean(), // project actions
          fc.boolean(), // project content
          fc.boolean(), // project footer
          fc.boolean(), // show breadcrumb
          fc.boolean(), // show action area
          (
            projectHeader: boolean,
            projectNavigation: boolean,
            projectBreadcrumb: boolean,
            projectScreenName: boolean,
            projectActions: boolean,
            projectContent: boolean,
            projectFooter: boolean,
            showBreadcrumb: boolean,
            showActionArea: boolean
          ) => {
            // Create a test host component with selective content projection
            @Component({
              selector: `mixed-test-host-${Math.random().toString(36).substr(2, 9)}`,
              standalone: true,
              imports: [PageLayoutComponent],
              changeDetection: ChangeDetectionStrategy.OnPush,
              template: `
                <app-page-layout
                  [showBreadcrumb]="showBreadcrumb"
                  [showActionArea]="showActionArea"
                >
                  ${projectHeader
                    ? '<div header class="test-header">Header</div>'
                    : ""}
                  ${projectNavigation
                    ? '<div navigation class="test-navigation">Navigation</div>'
                    : ""}
                  ${projectBreadcrumb
                    ? '<div breadcrumb class="test-breadcrumb">Breadcrumb</div>'
                    : ""}
                  ${projectScreenName
                    ? '<div screenName class="test-screen-name">Screen Name</div>'
                    : ""}
                  ${projectActions
                    ? '<div actions class="test-actions">Actions</div>'
                    : ""}
                  ${projectContent
                    ? '<div content class="test-content">Content</div>'
                    : ""}
                  ${projectFooter
                    ? '<div footer class="test-footer">Footer</div>'
                    : ""}
                </app-page-layout>
              `,
            })
            class MixedTestHostComponent {
              showBreadcrumb = showBreadcrumb;
              showActionArea = showActionArea;
            }

            const mixedFixture = TestBed.createComponent(
              MixedTestHostComponent
            );
            mixedFixture.detectChanges();

            // Check that projected content appears and empty slots remain empty
            const headerProjected = mixedFixture.nativeElement.querySelector(
              ".layout-header .test-header"
            );
            const headerArea =
              mixedFixture.nativeElement.querySelector(".layout-header");
            const navigationProjected =
              mixedFixture.nativeElement.querySelector(
                ".layout-navigation .test-navigation"
              );
            const navigationArea =
              mixedFixture.nativeElement.querySelector(".layout-navigation");
            const footerProjected = mixedFixture.nativeElement.querySelector(
              ".layout-footer .test-footer"
            );
            const footerArea =
              mixedFixture.nativeElement.querySelector(".layout-footer");
            const screenNameProjected =
              mixedFixture.nativeElement.querySelector(
                ".screen-name-area .test-screen-name"
              );
            const screenNameArea =
              mixedFixture.nativeElement.querySelector(".screen-name-area");
            const contentProjected = mixedFixture.nativeElement.querySelector(
              ".content-area .test-content"
            );
            const contentArea =
              mixedFixture.nativeElement.querySelector(".content-area");

            // For header: if projected, content exists; if not projected, area exists but is empty
            const headerCorrect = projectHeader
              ? headerProjected !== null
              : headerArea !== null &&
                headerArea.querySelector(".test-header") === null;

            // For navigation: if projected, content exists; if not projected, area exists but is empty
            const navigationCorrect = projectNavigation
              ? navigationProjected !== null
              : navigationArea !== null &&
                navigationArea.querySelector(".test-navigation") === null;

            // For footer: if projected, content exists; if not projected, area exists but is empty
            const footerCorrect = projectFooter
              ? footerProjected !== null
              : footerArea !== null &&
                footerArea.querySelector(".test-footer") === null;

            // For screen name: if projected, content exists; if not projected, area exists but is empty
            const screenNameCorrect = projectScreenName
              ? screenNameProjected !== null
              : screenNameArea !== null &&
                screenNameArea.querySelector(".test-screen-name") === null;

            // For content: if projected, content exists; if not projected, area exists but is empty
            const contentCorrect = projectContent
              ? contentProjected !== null
              : contentArea !== null &&
                contentArea.querySelector(".test-content") === null;

            // Test layout areas exist regardless of content projection
            const layoutAreasExist =
              headerArea !== null &&
              navigationArea !== null &&
              footerArea !== null &&
              screenNameArea !== null &&
              contentArea !== null;

            return (
              headerCorrect &&
              navigationCorrect &&
              footerCorrect &&
              screenNameCorrect &&
              contentCorrect &&
              layoutAreasExist
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
