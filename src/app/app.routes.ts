import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./features/todo").then((m) => m.TODO_ROUTES),
  },
];
