/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-006
 * @Description   Unit tests for FooterComponent
 * @Author        developer
 * @CreatedDate   2026-01-13
 * @Updater       developer
 * @LastUpdated   2026-01-13
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FooterComponent } from "./footer.component";

describe("FooterComponent", () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  const mockLinks = [
    { label: "Privacy Policy", url: "https://example.com/privacy" },
    { label: "Terms of Service", url: "https://example.com/terms" },
    { label: "Contact", url: "https://example.com/contact" },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Component Creation", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should have default empty copyright", () => {
      expect(component.copyright).toBe("");
    });

    it("should have default empty links array", () => {
      expect(component.links).toEqual([]);
    });
  });

  /**
   * Tests for rendering with different inputs
   * **Validates: Requirements 5.1, 5.2**
   */
  describe("Rendering with different inputs", () => {
    it("should render PrimeNG toolbar", () => {
      const toolbar = fixture.nativeElement.querySelector("p-toolbar");
      expect(toolbar).toBeTruthy();
    });

    it("should display copyright when provided", () => {
      fixture.componentRef.setInput("copyright", "© 2026 My Company");
      fixture.detectChanges();

      const copyrightEl =
        fixture.nativeElement.querySelector(".footer-copyright");
      expect(copyrightEl).toBeTruthy();
      expect(copyrightEl.textContent).toBe("© 2026 My Company");
    });

    it("should not render copyright element when copyright is empty", () => {
      fixture.componentRef.setInput("copyright", "");
      fixture.detectChanges();

      const copyrightEl =
        fixture.nativeElement.querySelector(".footer-copyright");
      expect(copyrightEl).toBeFalsy();
    });

    it("should render footer links when provided", () => {
      fixture.componentRef.setInput("links", mockLinks);
      fixture.detectChanges();

      const linkButtons =
        fixture.nativeElement.querySelectorAll(".footer-link");
      expect(linkButtons.length).toBe(3);
      expect(linkButtons[0].textContent.trim()).toBe("Privacy Policy");
      expect(linkButtons[1].textContent.trim()).toBe("Terms of Service");
      expect(linkButtons[2].textContent.trim()).toBe("Contact");
    });

    it("should not render links when links array is empty", () => {
      fixture.componentRef.setInput("links", []);
      fixture.detectChanges();

      const linkButtons =
        fixture.nativeElement.querySelectorAll(".footer-link");
      expect(linkButtons.length).toBe(0);
    });

    it("should set correct aria-label on link buttons", () => {
      fixture.componentRef.setInput("links", mockLinks);
      fixture.detectChanges();

      const linkButtons =
        fixture.nativeElement.querySelectorAll(".footer-link");
      expect(linkButtons[0].getAttribute("aria-label")).toBe(
        "Open Privacy Policy in new tab"
      );
      expect(linkButtons[1].getAttribute("aria-label")).toBe(
        "Open Terms of Service in new tab"
      );
      expect(linkButtons[2].getAttribute("aria-label")).toBe(
        "Open Contact in new tab"
      );
    });
  });

  /**
   * Tests for link click handling
   * **Validates: Requirements 5.3**
   */
  describe("Link click handling", () => {
    it("should call window.open when link is clicked", () => {
      const windowOpenSpy = spyOn(window, "open");
      fixture.componentRef.setInput("links", mockLinks);
      fixture.detectChanges();

      const linkButton = fixture.nativeElement.querySelector(".footer-link");
      linkButton.click();

      expect(windowOpenSpy).toHaveBeenCalledWith(
        "https://example.com/privacy",
        "_blank",
        "noopener,noreferrer"
      );
    });

    it("should open correct URL for each link", () => {
      const windowOpenSpy = spyOn(window, "open");
      fixture.componentRef.setInput("links", mockLinks);
      fixture.detectChanges();

      const linkButtons =
        fixture.nativeElement.querySelectorAll(".footer-link");
      linkButtons[1].click();

      expect(windowOpenSpy).toHaveBeenCalledWith(
        "https://example.com/terms",
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  describe("onLinkClick method", () => {
    it("should call window.open with correct parameters", () => {
      const windowOpenSpy = spyOn(window, "open");

      component.onLinkClick("https://example.com/test");

      expect(windowOpenSpy).toHaveBeenCalledWith(
        "https://example.com/test",
        "_blank",
        "noopener,noreferrer"
      );
    });
  });
});
