#!/usr/bin/env node
/**
 * Generator for RxJS Store (actions, reducer, effects, store, facade)
 *
 * Usage: node tools/generators/generate-store.js <name> [--path=<path>]
 * Example: node tools/generators/generate-store.js user
 */

const path = require("path");
const { generateFileHeader, getPath } = require("./lib/config");
const {
  toPascalCase,
  toUpperCase,
  writeFile,
  parseArgs,
  ensureDir,
} = require("./lib/utils");

// Parse arguments
const { name, options } = parseArgs(process.argv.slice(2));

if (!name) {
  console.error("❌ Error: Please provide a name");
  console.log(
    "Usage: node tools/generators/generate-store.js <name> [--path=<path>]"
  );
  process.exit(1);
}

const Name = toPascalCase(name);
const NAME = toUpperCase(name);
const basePath = options.path || getPath("store");
const storePath = path.join(basePath, name);

ensureDir(storePath);

// Templates
const templates = {
  actions: () => `${generateFileHeader(
    `${NAME}-001`,
    `Redux-style action creators for ${Name} store`
  )}import { Action, ${Name} } from '../../models/${name}.model';

export enum ${Name}ActionTypes {
  LOAD_${NAME}S = '[${Name}] Load ${Name}s',
  LOAD_${NAME}S_SUCCESS = '[${Name}] Load ${Name}s Success',
  LOAD_${NAME}S_FAILURE = '[${Name}] Load ${Name}s Failure',
  ADD_${NAME} = '[${Name}] Add ${Name}',
  ADD_${NAME}_SUCCESS = '[${Name}] Add ${Name} Success',
  ADD_${NAME}_FAILURE = '[${Name}] Add ${Name} Failure',
  UPDATE_${NAME} = '[${Name}] Update ${Name}',
  UPDATE_${NAME}_SUCCESS = '[${Name}] Update ${Name} Success',
  UPDATE_${NAME}_FAILURE = '[${Name}] Update ${Name} Failure',
  DELETE_${NAME} = '[${Name}] Delete ${Name}',
  DELETE_${NAME}_SUCCESS = '[${Name}] Delete ${Name} Success',
  DELETE_${NAME}_FAILURE = '[${Name}] Delete ${Name} Failure',
}

export const load${Name}s = (): Action => ({ type: ${Name}ActionTypes.LOAD_${NAME}S });
export const load${Name}sSuccess = (${name}s: ${Name}[]): Action<${Name}[]> => ({ type: ${Name}ActionTypes.LOAD_${NAME}S_SUCCESS, payload: ${name}s });
export const load${Name}sFailure = (error: string): Action<string> => ({ type: ${Name}ActionTypes.LOAD_${NAME}S_FAILURE, payload: error });

export const add${Name} = (data: Omit<${Name}, 'id'>): Action => ({ type: ${Name}ActionTypes.ADD_${NAME}, payload: data });
export const add${Name}Success = (${name}: ${Name}): Action<${Name}> => ({ type: ${Name}ActionTypes.ADD_${NAME}_SUCCESS, payload: ${name} });
export const add${Name}Failure = (error: string): Action<string> => ({ type: ${Name}ActionTypes.ADD_${NAME}_FAILURE, payload: error });

export const update${Name} = (payload: { id: string; updates: Partial<${Name}> }): Action => ({ type: ${Name}ActionTypes.UPDATE_${NAME}, payload });
export const update${Name}Success = (${name}: ${Name}): Action<${Name}> => ({ type: ${Name}ActionTypes.UPDATE_${NAME}_SUCCESS, payload: ${name} });
export const update${Name}Failure = (error: string): Action<string> => ({ type: ${Name}ActionTypes.UPDATE_${NAME}_FAILURE, payload: error });

export const delete${Name} = (id: string): Action<string> => ({ type: ${Name}ActionTypes.DELETE_${NAME}, payload: id });
export const delete${Name}Success = (id: string): Action<string> => ({ type: ${Name}ActionTypes.DELETE_${NAME}_SUCCESS, payload: id });
export const delete${Name}Failure = (error: string): Action<string> => ({ type: ${Name}ActionTypes.DELETE_${NAME}_FAILURE, payload: error });
`,

  reducer: () => `${generateFileHeader(
    `${NAME}-001`,
    `Pure reducer function for ${Name} state management`
  )}import { Action, ${Name}, ${Name}State } from '../../models/${name}.model';
import { ${Name}ActionTypes } from './${name}.actions';

export const initialState: ${Name}State = {
  ${name}s: [],
  loading: false,
  error: null,
};

export function ${name}Reducer(state: ${Name}State = initialState, action: Action): ${Name}State {
  switch (action.type) {
    case ${Name}ActionTypes.LOAD_${NAME}S:
    case ${Name}ActionTypes.ADD_${NAME}:
    case ${Name}ActionTypes.UPDATE_${NAME}:
    case ${Name}ActionTypes.DELETE_${NAME}:
      return { ...state, loading: true, error: null };

    case ${Name}ActionTypes.LOAD_${NAME}S_SUCCESS:
      return { ...state, ${name}s: action.payload as ${Name}[], loading: false };

    case ${Name}ActionTypes.ADD_${NAME}_SUCCESS:
      return { ...state, ${name}s: [...state.${name}s, action.payload as ${Name}], loading: false };

    case ${Name}ActionTypes.UPDATE_${NAME}_SUCCESS:
      const updated = action.payload as ${Name};
      return { ...state, ${name}s: state.${name}s.map(item => item.id === updated.id ? updated : item), loading: false };

    case ${Name}ActionTypes.DELETE_${NAME}_SUCCESS:
      return { ...state, ${name}s: state.${name}s.filter(item => item.id !== action.payload), loading: false };

    case ${Name}ActionTypes.LOAD_${NAME}S_FAILURE:
    case ${Name}ActionTypes.ADD_${NAME}_FAILURE:
    case ${Name}ActionTypes.UPDATE_${NAME}_FAILURE:
    case ${Name}ActionTypes.DELETE_${NAME}_FAILURE:
      return { ...state, loading: false, error: action.payload as string };

    default:
      return state;
  }
}
`,

  effects: () => `${generateFileHeader(
    `${NAME}-001`,
    `Side effects handler for ${Name} API calls`
  )}import { Injectable } from '@angular/core';
import { Subject, merge, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';

import { Action, ${Name} } from '../../models/${name}.model';
import { ${Name}ApiService } from '../../services/${name}-api.service';
import {
  ${Name}ActionTypes,
  load${Name}sSuccess, load${Name}sFailure,
  add${Name}Success, add${Name}Failure,
  update${Name}Success, update${Name}Failure,
  delete${Name}Success, delete${Name}Failure,
} from './${name}.actions';

@Injectable({ providedIn: 'root' })
export class ${Name}Effects {
  private dispatchFn: ((action: Action) => void) | null = null;

  constructor(private apiService: ${Name}ApiService) {}

  init(actions$: Subject<Action>, dispatch: (action: Action) => void): void {
    this.dispatchFn = dispatch;
    merge(
      this.loadEffect(actions$),
      this.addEffect(actions$),
      this.updateEffect(actions$),
      this.deleteEffect(actions$)
    ).subscribe(action => action && this.dispatchFn?.(action));
  }

  private loadEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter(action => action.type === ${Name}ActionTypes.LOAD_${NAME}S),
      switchMap(() => this.apiService.getAll().pipe(
        map((data: ${Name}[]) => load${Name}sSuccess(data)),
        catchError(error => of(load${Name}sFailure(error.error?.message || 'Failed to load')))
      ))
    );
  }

  private addEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter(action => action.type === ${Name}ActionTypes.ADD_${NAME}),
      switchMap(action => this.apiService.create(action.payload).pipe(
        map((data: ${Name}) => add${Name}Success(data)),
        catchError(error => of(add${Name}Failure(error.error?.message || 'Failed to add')))
      ))
    );
  }

  private updateEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter(action => action.type === ${Name}ActionTypes.UPDATE_${NAME}),
      switchMap(action => {
        const { id, updates } = action.payload;
        return this.apiService.update(id, updates).pipe(
          map((data: ${Name}) => update${Name}Success(data)),
          catchError(error => of(update${Name}Failure(error.error?.message || 'Failed to update')))
        );
      })
    );
  }

  private deleteEffect(actions$: Subject<Action>) {
    return actions$.pipe(
      filter(action => action.type === ${Name}ActionTypes.DELETE_${NAME}),
      switchMap(action => this.apiService.delete(action.payload).pipe(
        map(() => delete${Name}Success(action.payload)),
        catchError(error => of(delete${Name}Failure(error.error?.message || 'Failed to delete')))
      ))
    );
  }
}
`,

  store: () => `${generateFileHeader(
    `${NAME}-001`,
    `Centralized state store for ${Name}`
  )}import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { Action, ${Name}, ${Name}State } from '../../models/${name}.model';
import { ${name}Reducer, initialState } from './${name}.reducer';
import { ${Name}Effects } from './${name}.effects';

@Injectable({ providedIn: 'root' })
export class ${Name}Store {
  private state$ = new BehaviorSubject<${Name}State>(initialState);
  private actions$ = new Subject<Action>();

  readonly ${name}s$: Observable<${Name}[]> = this.state$.pipe(map(s => s.${name}s), distinctUntilChanged());
  readonly loading$: Observable<boolean> = this.state$.pipe(map(s => s.loading), distinctUntilChanged());
  readonly error$: Observable<string | null> = this.state$.pipe(map(s => s.error), distinctUntilChanged());

  constructor(private effects: ${Name}Effects) {
    this.effects.init(this.actions$, action => this.dispatch(action));
  }

  dispatch(action: Action): void {
    const newState = ${name}Reducer(this.state$.getValue(), action);
    this.state$.next(newState);
    this.actions$.next(action);
  }

  getState(): ${Name}State {
    return this.state$.getValue();
  }
}
`,

  facade: () => `${generateFileHeader(
    `${NAME}-001`,
    `Facade pattern - simplified API for ${Name} store`
  )}import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ${Name} } from '../../models/${name}.model';
import { ${Name}Store } from './${name}.store';
import { load${Name}s, add${Name}, update${Name}, delete${Name} } from './${name}.actions';

@Injectable({ providedIn: 'root' })
export class ${Name}Facade {
  readonly ${name}s$: Observable<${Name}[]> = this.store.${name}s$;
  readonly loading$: Observable<boolean> = this.store.loading$;
  readonly error$: Observable<string | null> = this.store.error$;

  constructor(private store: ${Name}Store) {
    this.load${Name}s();
  }

  load${Name}s(): void { this.store.dispatch(load${Name}s()); }
  add${Name}(data: Omit<${Name}, 'id'>): void { this.store.dispatch(add${Name}(data)); }
  update${Name}(id: string, updates: Partial<${Name}>): void { this.store.dispatch(update${Name}({ id, updates })); }
  delete${Name}(id: string): void { this.store.dispatch(delete${Name}(id)); }
}
`,

  index: () => `${generateFileHeader(
    `${NAME}-001`,
    `${Name} Store barrel file`
  )}export * from './${name}.actions';
export * from './${name}.reducer';
export * from './${name}.effects';
export * from './${name}.store';
export * from './${name}.facade';
`,
};

// Write files
const files = [
  { name: `${name}.actions.ts`, template: "actions" },
  { name: `${name}.reducer.ts`, template: "reducer" },
  { name: `${name}.effects.ts`, template: "effects" },
  { name: `${name}.store.ts`, template: "store" },
  { name: `${name}.facade.ts`, template: "facade" },
  { name: "index.ts", template: "index" },
];

files.forEach((file) => {
  writeFile(path.join(storePath, file.name), templates[file.template]());
});

console.log(`
🎉 Store "${name}" generated successfully!

⚠️  Don't forget to create:
   - ${getPath("models")}/${name}.model.ts
   - ${getPath("services")}/${name}-api.service.ts
`);
