import { TestBed } from "@angular/core/testing";
import { UserEffects } from "./user.effects";
import { UserApiService } from "../services/user-api.service";

describe("User Effects", () => {
  let effects: UserEffects;
  let mockApiService: jasmine.SpyObj<UserApiService>;

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj("UserApiService", [
      "getAll",
      "create",
      "update",
      "delete",
    ]);

    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        { provide: UserApiService, useValue: mockApiService },
      ],
    });

    effects = TestBed.inject(UserEffects);
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });

  it("should have init method", () => {
    expect(typeof effects.init).toBe("function");
  });
});
