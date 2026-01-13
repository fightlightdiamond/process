/**
 * @Project       NgSSR Todo App
 * @BD_ID         LAYOUT-004
 * @Description   Unit tests for NavigationComponent
 * @Author        developer
 * @CreatedDate   2026-01-13
 * @Updater       developer
 * @LastUpdated   2026-01-13
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NavigationComponent } from "./navigation.component";
import { NavItem } from "../../models/layout.model";

describe("NavigationComponent", () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  const mockNavItems: NavItem[] = [
    { label: "Home", route: "/home" },
    { label: "Dashboard", route: "/dashboard", icon: "pi pi-chart-bar" },
    { label: "Settings", route: "/settings" },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
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

    it("should have default empty activeRoute", () => {
      expect(component.activeRoute).toBe("");
    });

    it("should have default empty menuItems array", () => {
      expect(component.menuItems).toEqual([]);
    });
  });

  /**
   * Tests for rendering with different nav items
   * **Validates: Requirements 2.1**
   */
  describe("Rendering with different nav items", () => {
    it("should render PrimeNG Menubar component", () => {
      fixture.componentRef.setInput("items", mockNavItems);
      fixture.detectChanges();

      const menubar = fixture.nativeElement.querySelector("p-menubar");
      expect(menubar).toBeTruthy();
    });

    it("should convert NavItems to MenuItems", () => {
      fixture.componentRef.setInput("items", mockNavItems);
      fixture.detectChanges();

      expect(component.menuItems.length).toBe(3);
      expect(component.menuItems[0].label).toBe("Home");
      expect(component.menuItems[1].label).toBe("Dashboard");
      expect(component.menuItems[2].label).toBe("Settings");
    });

    it("should include icon in MenuItem when provided", () => {
      fixture.componentRef.setInput("items", mockNavItems);
      fixture.detectChanges();

      expect(component.menuItems[0].icon).toBeUndefined();
      expect(component.menuItems[1].icon).toBe("pi pi-chart-bar");
      expect(component.menuItems[2].icon).toBeUndefined();
    });

    it("should set command for all menu items", () => {
      fixture.componentRef.setInput("items", mockNavItems);
      fixture.detectChanges();

      expect(component.menuItems[0].command).toBeDefined();
      expect(component.menuItems[1].command).toBeDefined();
      expect(component.menuItems[2].command).toBeDefined();
    });

    it("should store route in id field", () => {
      fixture.componentRef.setInput("items", mockNavItems);
      fixture.detectChanges();

      expect(component.menuItems[0].id).toBe("/home");
      expect(component.menuItems[1].id).toBe("/dashboard");
      expect(component.menuItems[2].id).toBe("/settings");
    });
  });

  /**
   * Tests for active state highlighting
   * **Validates: Requirements 2.3**
   */
  describe("Active state highlighting", () => {
    it("should set active styleClass when activeRoute matches", () => {
      fixture.componentRef.setInput("items", mockNavItems);
      fixture.componentRef.setInput("activeRoute", "/dashboard");
      fixture.detectChanges();

      expect(component.menuItems[1].styleClass).toBe("active-nav-item");
      expect(component.menuItems[0].styleClass).toBeUndefined();
      expect(component.menuItems[2].styleClass).toBeUndefined();
    });

    it("should set active styleClass when item.active is true", () => {
      const itemsWithActive: NavItem[] = [
        { label: "Home", route: "/home", active: true },
        { label: "Dashboard", route: "/dashboard" },
      ];
      fixture.componentRef.setInput("items", itemsWithActive);
      fixture.detectChanges();

      expect(component.menuItems[0].styleClass).toBe("active-nav-item");
      expect(component.menuItems[1].styleClass).toBeUndefined();
    });

    it("should not set active styleClass when no active route matches", () => {
      fixture.componentRef.setInput("items", mockNavItems);
      fixture.componentRef.setInput("activeRoute", "/unknown");
      fixture.detectChanges();

      expect(component.menuItems[0].styleClass).toBeUndefined();
      expect(component.menuItems[1].styleClass).toBeUndefined();
      expect(component.menuItems[2].styleClass).toBeUndefined();
    });
  });

  /**
   * Tests for navigate event emission
   * **Validates: Requirements 2.3**
   */
  describe("Navigate event emission", () => {
    it("should emit navigate event when menu item command is executed", () => {
      const navigateSpy = spyOn(component.navigate, "emit");
      fixture.componentRef.setInput("items", mockNavItems);
      fixture.detectChanges();

      // Execute the command for first item
      component.menuItems[0].command?.({} as any);

      expect(navigateSpy).toHaveBeenCalledWith("/home");
    });

    it("should emit navigate event with correct route for each item", () => {
      const navigateSpy = spyOn(component.navigate, "emit");
      fixture.componentRef.setInput("items", mockNavItems);
      fixture.detectChanges();

      // Execute the command for second item
      component.menuItems[1].command?.({} as any);

      expect(navigateSpy).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("Items getter/setter", () => {
    it("should update menuItems when items are set", () => {
      expect(component.menuItems.length).toBe(0);

      component.items = mockNavItems;

      expect(component.menuItems.length).toBe(3);
    });

    it("should return correct items from getter", () => {
      component.items = mockNavItems;

      expect(component.items).toEqual(mockNavItems);
    });
  });

  describe("ActiveRoute getter/setter", () => {
    it("should update menuItems when activeRoute is set", () => {
      component.items = mockNavItems;

      component.activeRoute = "/settings";

      expect(component.menuItems[2].styleClass).toBe("active-nav-item");
    });

    it("should return correct activeRoute from getter", () => {
      component.activeRoute = "/test";

      expect(component.activeRoute).toBe("/test");
    });
  });
});
