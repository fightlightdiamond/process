import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-grid-container",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./grid-container.component.html",
  styleUrls: ["./grid-container.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridContainerComponent {}
