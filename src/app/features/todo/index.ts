/**
 * @Project       NgSSR Todo App
 * @Description   Public API for Todo feature module
 *
 * This is the only entry point for importing from the todo feature.
 * Other modules should import from here, not from internal paths.
 */

// Models
export * from "./models";

// Store (Facade is the main public API for state)
export { TodoFacade } from "./store";

// Routes
export { TODO_ROUTES } from "./todo.routes";

// Components (only export container for routing)
export { TodoContainerComponent } from "./components";
