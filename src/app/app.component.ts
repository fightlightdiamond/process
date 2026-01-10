import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TodoContainerComponent } from "./components/todo-container/todo-container.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, TodoContainerComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "RxJS Todo App";
}
