/**
 * @Project       NgSSR Todo App
 * @Description   Routes for Todo feature module
 */

import { Routes } from "@angular/router";
import { TodoContainerComponent } from "./components";

export const TODO_ROUTES: Routes = [
  {
    path: "",
    component: TodoContainerComponent,
  },
];
