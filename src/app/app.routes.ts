import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./features/todo").then((m) => m.TODO_ROUTES),
  },
  {
    path: "users",
    loadComponent: () =>
      import("./features/user/user.component").then((m) => m.UserComponent),
  },
];
