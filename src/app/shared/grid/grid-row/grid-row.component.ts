import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * GridRowComponent - A row component for the grid system
 * Uses PrimeFlex grid classes for layout
 * Requirements: 4.3 - Provide utility classes for vertical and horizontal alignment
 */
@Component({
  selector: "app-grid-row",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./grid-row.component.html",
  styleUrls: ["./grid-row.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridRowComponent {
  /**
   * Vertical alignment of items within the row
   * Maps to PrimeFlex align-items classes
   */
  @Input() align: "start" | "center" | "end" | "stretch" | "baseline" = "start";

  /**
   * Horizontal justification of items within the row
   * Maps to PrimeFlex justify-content classes
   */
  @Input() justify:
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly" = "start";

  /**
   * Get the CSS classes for the row based on align and justify inputs
   */
  get rowClasses(): { [key: string]: boolean } {
    return {
      grid: true,
      // PrimeFlex align-items classes
      "align-items-start": this.align === "start",
      "align-items-center": this.align === "center",
      "align-items-end": this.align === "end",
      "align-items-stretch": this.align === "stretch",
      "align-items-baseline": this.align === "baseline",
      // PrimeFlex justify-content classes
      "justify-content-start": this.justify === "start",
      "justify-content-center": this.justify === "center",
      "justify-content-end": this.justify === "end",
      "justify-content-between": this.justify === "between",
      "justify-content-around": this.justify === "around",
      "justify-content-evenly": this.justify === "evenly",
    };
  }
}
