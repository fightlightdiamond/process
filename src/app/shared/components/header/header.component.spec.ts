/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-003
 * @Description   Unit tests for HeaderComponent
 * @Author        developer
 * @CreatedDate   2026-01-13
 * @Updater       developer
 * @LastUpdated   2026-01-13
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Component Creation", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should have default empty title", () => {
      expect(component.title).toBe("");
    });

    it("should have default empty logoUrl", () => {
      expect(component.logoUrl).toBe("");
    });
  });

  /**
   * Tests for rendering with different inputs
   * **Validates: Requirements 1.1, 1.2**
   */
  describe("Rendering with different inputs", () => {
    it("should render PrimeNG toolbar", () => {
      const toolbar = fixture.nativeElement.querySelector("p-toolbar");
      expect(toolbar).toBeTruthy();
    });

    it("should display title when provided", () => {
      fixture.componentRef.setInput("title", "Test Application");
      fixture.detectChanges();

      const titleEl = fixture.nativeElement.querySelector(".header-title");
      expect(titleEl).toBeTruthy();
      expect(titleEl.textContent).toBe("Test Application");
    });

    it("should not render title element when title is empty", () => {
      fixture.componentRef.setInput("title", "");
      fixture.detectChanges();

      const titleEl = fixture.nativeElement.querySelector(".header-title");
      expect(titleEl).toBeFalsy();
    });

    it("should display logo when logoUrl is provided", () => {
      fixture.componentRef.setInput("logoUrl", "/assets/test-logo.png");
      fixture.componentRef.setInput("title", "Test App");
      fixture.detectChanges();

      const logoEl = fixture.nativeElement.querySelector(".header-logo");
      expect(logoEl).toBeTruthy();
      expect(logoEl.getAttribute("src")).toBe("/assets/test-logo.png");
    });

    it("should not render logo element when logoUrl is empty", () => {
      fixture.componentRef.setInput("logoUrl", "");
      fixture.detectChanges();

      const logoEl = fixture.nativeElement.querySelector(".header-logo");
      expect(logoEl).toBeFalsy();
    });

    it("should set correct alt text on logo image", () => {
      fixture.componentRef.setInput("logoUrl", "/assets/logo.png");
      fixture.componentRef.setInput("title", "My App");
      fixture.detectChanges();

      const logoEl = fixture.nativeElement.querySelector(".header-logo");
      expect(logoEl).toBeTruthy();
      expect(logoEl.getAttribute("alt")).toBe("My App logo");
    });
  });

  /**
   * Tests for logoClick event emission
   * **Validates: Requirements 1.3**
   */
  describe("logoClick event emission", () => {
    it("should emit logoClick event when brand button is clicked", () => {
      const logoClickSpy = spyOn(component.logoClick, "emit");

      const brandEl = fixture.nativeElement.querySelector(".header-brand");
      brandEl.click();

      expect(logoClickSpy).toHaveBeenCalled();
    });

    it("should have correct aria-label on brand button", () => {
      fixture.componentRef.setInput("title", "My Application");
      fixture.detectChanges();

      const brandEl = fixture.nativeElement.querySelector(".header-brand");
      expect(brandEl.getAttribute("aria-label")).toBe(
        "Go to home - My Application"
      );
    });
  });

  describe("Content projection", () => {
    it("should have toolbar group end for projected content", () => {
      const groupEnd = fixture.nativeElement.querySelector(
        ".p-toolbar-group-end"
      );
      expect(groupEnd).toBeTruthy();
    });
  });
});
