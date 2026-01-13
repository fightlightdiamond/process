/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-005
 * @Description   Unit tests for BreadcrumbComponent
 * @Author        developer
 * @CreatedDate   2026-01-13
 * @Updater       developer
 * @LastUpdated   2026-01-13
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BreadcrumbComponent } from "./breadcrumb.component";
import { BreadcrumbItem } from "../../models/layout.model";
import { MenuItem } from "primeng/api";

describe("BreadcrumbComponent", () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  const mockBreadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", route: "/" },
    { label: "Products", route: "/products" },
    { label: "Electronics" },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Component Creation", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should have default empty items array", () => {
      expect(component.items).toEqual([]);
    });

    it("should have default empty menuItems array", () => {
      expect(component.menuItems).toEqual([]);
    });
  });

  /**
   * Tests for rendering with different breadcrumb items
   * **Validates: Requirements 3.1**
   */
  describe("Rendering with different breadcrumb items", () => {
    it("should render PrimeNG breadcrumb component", () => {
      fixture.componentRef.setInput("items", mockBreadcrumbItems);
      fixture.detectChanges();

      const breadcrumb = fixture.nativeElement.querySelector("p-breadcrumb");
      expect(breadcrumb).toBeTruthy();
    });

    it("should convert BreadcrumbItems to MenuItems", () => {
      fixture.componentRef.setInput("items", mockBreadcrumbItems);
      fixture.detectChanges();

      expect(component.menuItems.length).toBe(3);
      expect(component.menuItems[0].label).toBe("Home");
      expect(component.menuItems[1].label).toBe("Products");
      expect(component.menuItems[2].label).toBe("Electronics");
    });

    it("should set command for navigable items (not last)", () => {
      fixture.componentRef.setInput("items", mockBreadcrumbItems);
      fixture.detectChanges();

      expect(component.menuItems[0].command).toBeDefined();
      expect(component.menuItems[1].command).toBeDefined();
      expect(component.menuItems[2].command).toBeUndefined();
    });

    it("should mark last item with breadcrumb-current styleClass", () => {
      fixture.componentRef.setInput("items", mockBreadcrumbItems);
      fixture.detectChanges();

      expect(component.menuItems[0].styleClass).toBeUndefined();
      expect(component.menuItems[1].styleClass).toBeUndefined();
      expect(component.menuItems[2].styleClass).toBe("breadcrumb-current");
    });

    it("should handle single item", () => {
      const singleItem: BreadcrumbItem[] = [{ label: "Home" }];
      fixture.componentRef.setInput("items", singleItem);
      fixture.detectChanges();

      expect(component.menuItems.length).toBe(1);
      expect(component.menuItems[0].styleClass).toBe("breadcrumb-current");
      expect(component.menuItems[0].command).toBeUndefined();
    });
  });

  /**
   * Tests for navigate event emission
   * **Validates: Requirements 3.3**
   */
  describe("Navigate event emission", () => {
    it("should emit navigate event when navigable item command is executed", () => {
      const navigateSpy = spyOn(component.navigate, "emit");
      fixture.componentRef.setInput("items", mockBreadcrumbItems);
      fixture.detectChanges();

      component.menuItems[0].command?.({} as any);

      expect(navigateSpy).toHaveBeenCalledWith("/");
    });

    it("should emit navigate event with correct route", () => {
      const navigateSpy = spyOn(component.navigate, "emit");
      fixture.componentRef.setInput("items", mockBreadcrumbItems);
      fixture.detectChanges();

      component.menuItems[1].command?.({} as any);

      expect(navigateSpy).toHaveBeenCalledWith("/products");
    });
  });

  describe("Home item", () => {
    it("should accept home input", () => {
      const homeItem: MenuItem = { icon: "pi pi-home", url: "/" };
      fixture.componentRef.setInput("home", homeItem);
      fixture.detectChanges();

      expect(component.home).toEqual(homeItem);
    });

    it("should emit navigate on home click with url", () => {
      const navigateSpy = spyOn(component.navigate, "emit");
      const homeItem: MenuItem = { icon: "pi pi-home", url: "/" };
      fixture.componentRef.setInput("home", homeItem);
      fixture.detectChanges();

      component.onHomeClick();

      expect(navigateSpy).toHaveBeenCalledWith("/");
    });
  });
});
