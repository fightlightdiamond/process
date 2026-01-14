import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  Component,
  DebugElement,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { By } from "@angular/platform-browser";
import { GridColDirective } from "./grid-col.directive";

@Component({
  selector: "app-test-grid-col",
  template: `<div
    appGridCol
    [col]="col"
    [sm]="sm"
    [md]="md"
    [lg]="lg"
    [xl]="xl"
    [offset]="offset"
  >
    Test Content
  </div>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GridColDirective],
})
class TestComponent {
  col: number = 12;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  offset?: number;

  constructor(private cdr: ChangeDetectorRef) {}

  updateCol(value: number) {
    this.col = value;
    this.cdr.markForCheck();
  }
}

describe("GridColDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, GridColDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(
      By.directive(GridColDirective)
    );
  });

  it("should create", () => {
    expect(directiveElement).toBeTruthy();
  });

  it("should apply default column span class", () => {
    component.col = 6;
    fixture.detectChanges();

    expect(directiveElement.nativeElement.classList.contains("col-6")).toBe(
      true
    );
  });

  it("should apply responsive breakpoint classes", () => {
    component.col = 12;
    component.sm = 6;
    component.md = 4;
    component.lg = 3;
    component.xl = 2;
    fixture.detectChanges();

    expect(directiveElement.nativeElement.classList.contains("col-12")).toBe(
      true
    );
    expect(directiveElement.nativeElement.classList.contains("sm:col-6")).toBe(
      true
    );
    expect(directiveElement.nativeElement.classList.contains("md:col-4")).toBe(
      true
    );
    expect(directiveElement.nativeElement.classList.contains("lg:col-3")).toBe(
      true
    );
    expect(directiveElement.nativeElement.classList.contains("xl:col-2")).toBe(
      true
    );
  });

  it("should apply offset classes", () => {
    component.col = 6;
    component.offset = 3;
    fixture.detectChanges();

    expect(directiveElement.nativeElement.classList.contains("col-6")).toBe(
      true
    );
    expect(
      directiveElement.nativeElement.classList.contains("col-offset-3")
    ).toBe(true);
  });

  it("should validate column span to range [1, 12]", () => {
    // Test upper bound
    component.updateCol(15);
    fixture.detectChanges();
    expect(directiveElement.nativeElement.classList.contains("col-12")).toBe(
      true
    );

    // Test lower bound
    component.updateCol(0);
    fixture.detectChanges();
    expect(directiveElement.nativeElement.classList.contains("col-1")).toBe(
      true
    );

    // Test negative value
    component.updateCol(-5);
    fixture.detectChanges();
    expect(directiveElement.nativeElement.classList.contains("col-1")).toBe(
      true
    );
  });

  it("should update classes when inputs change", () => {
    component.updateCol(6);
    fixture.detectChanges();
    expect(directiveElement.nativeElement.classList.contains("col-6")).toBe(
      true
    );

    component.updateCol(8);
    fixture.detectChanges();
    expect(directiveElement.nativeElement.classList.contains("col-6")).toBe(
      false
    );
    expect(directiveElement.nativeElement.classList.contains("col-8")).toBe(
      true
    );
  });

  it("should not apply offset class when offset is 0 or undefined", () => {
    component.col = 6;
    component.offset = 0;
    fixture.detectChanges();

    const hasOffsetClass = Array.from(
      directiveElement.nativeElement.classList
    ).some((className) => (className as string).startsWith("col-offset-"));
    expect(hasOffsetClass).toBe(false);
  });
});
