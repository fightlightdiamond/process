import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { Subject, takeUntil, filter } from "rxjs";
import {
  PageLayoutComponent,
  HeaderComponent,
  NavigationComponent,
  BreadcrumbComponent,
  FooterComponent,
} from "./shared";
import { GridModule } from "./shared/grid/grid.module";
import { LayoutService, LayoutConfigService } from "./core";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    AsyncPipe,
    RouterOutlet,
    PageLayoutComponent,
    HeaderComponent,
    NavigationComponent,
    BreadcrumbComponent,
    FooterComponent,
    GridModule,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Layout configuration from service
  layoutConfig$ = this.layoutService.layoutConfig$;

  // Current year for footer
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private layoutConfigService: LayoutConfigService
  ) {}

  ngOnInit(): void {
    // Set default layout configuration
    this.layoutService.setLayoutConfig(
      this.layoutConfigService.getTodoLayoutConfig()
    );

    // Listen to route changes to update layout configuration
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updateLayoutForRoute(event.url);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Update layout configuration based on current route
   */
  private updateLayoutForRoute(url: string): void {
    if (url.startsWith("/users")) {
      this.layoutService.setLayoutConfig(
        this.layoutConfigService.getUserLayoutConfig()
      );
    } else if (url.startsWith("/dashboard")) {
      this.layoutService.setLayoutConfig(
        this.layoutConfigService.getDashboardLayoutConfig()
      );
    } else if (url === "/" || url.startsWith("/todos")) {
      this.layoutService.setLayoutConfig(
        this.layoutConfigService.getTodoLayoutConfig()
      );
    } else {
      this.layoutService.setLayoutConfig(
        this.layoutConfigService.getDefaultLayoutConfig()
      );
    }
  }

  onLogoClick(): void {
    this.router.navigate(["/"]);
  }

  onNavigate(route: string): void {
    this.router.navigate([route]);
  }

  onBreadcrumbNavigate(route: string): void {
    this.router.navigate([route]);
  }
}
