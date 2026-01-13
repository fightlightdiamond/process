import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Renderer2,
} from "@angular/core";

@Directive({
  selector: "[appGridCol]",
  standalone: true,
})
export class GridColDirective implements OnInit, OnChanges {
  @Input() col: number = 12; // Default span for all screen sizes
  @Input() sm?: number; // Small screens (≥576px)
  @Input() md?: number; // Medium screens (≥768px)
  @Input() lg?: number; // Large screens (≥992px)
  @Input() xl?: number; // Extra large screens (≥1200px)
  @Input() offset?: number; // Column offset

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.applyClasses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.applyClasses();
    }
  }

  private applyClasses(): void {
    // Remove existing grid classes
    this.removeExistingClasses();

    // Apply default column span
    if (this.col !== undefined && this.col !== null) {
      this.renderer.addClass(
        this.el.nativeElement,
        `col-${this.validateColumnSpan(this.col)}`
      );
    }

    // Apply responsive column spans
    if (this.sm !== undefined) {
      this.renderer.addClass(
        this.el.nativeElement,
        `sm:col-${this.validateColumnSpan(this.sm)}`
      );
    }

    if (this.md !== undefined) {
      this.renderer.addClass(
        this.el.nativeElement,
        `md:col-${this.validateColumnSpan(this.md)}`
      );
    }

    if (this.lg !== undefined) {
      this.renderer.addClass(
        this.el.nativeElement,
        `lg:col-${this.validateColumnSpan(this.lg)}`
      );
    }

    if (this.xl !== undefined) {
      this.renderer.addClass(
        this.el.nativeElement,
        `xl:col-${this.validateColumnSpan(this.xl)}`
      );
    }

    // Apply offset if specified
    if (this.offset !== undefined && this.offset > 0) {
      this.renderer.addClass(
        this.el.nativeElement,
        `col-offset-${this.validateColumnSpan(this.offset)}`
      );
    }
  }

  private removeExistingClasses(): void {
    const element = this.el.nativeElement;
    const classesToRemove: string[] = [];

    // Collect all grid-related classes to remove
    for (let i = 0; i <= 12; i++) {
      classesToRemove.push(
        `col-${i}`,
        `sm:col-${i}`,
        `md:col-${i}`,
        `lg:col-${i}`,
        `xl:col-${i}`,
        `col-offset-${i}`
      );
    }

    // Remove classes
    classesToRemove.forEach((className) => {
      if (element.classList.contains(className)) {
        this.renderer.removeClass(element, className);
      }
    });
  }

  private validateColumnSpan(span: number): number {
    // Clamp column span to valid range [1, 12] as per error handling strategy
    return Math.max(1, Math.min(12, Math.floor(span)));
  }
}
