import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { UserApiService } from "./user-api.service";
import { User } from "../models/user.model";

describe("UserApiService", () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;
  const apiUrl = "http://localhost:3000/users";

  const mockUsers: User[] = [
    { id: "1", name: "John", email: "john@ex.com", avatar: "avatar1.jpg" },
    { id: "2", name: "Jane", email: "jane@ex.com" },
  ];

  const mockUser: User = { id: "1", name: "John", email: "john@ex.com" };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserApiService],
    });

    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch all users via getAll()", () => {
    service.getAll().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe("GET");
    req.flush(mockUsers);
  });

  it("should create user via create()", () => {
    const newUserData = { name: "Bob", email: "bob@ex.com" };
    const responseUser: User = { id: "3", ...newUserData };

    service.create(newUserData).subscribe((user) => {
      expect(user).toEqual(responseUser);
      expect(user.id).toBe("3");
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(newUserData);
    req.flush(responseUser);
  });

  it("should update user via update()", () => {
    const userId = "1";
    const updates = { name: "Updated Name" };
    const responseUser: User = { ...mockUser, ...updates };

    service.update(userId, updates).subscribe((user) => {
      expect(user.name).toBe("Updated Name");
      expect(user.id).toBe("1");
    });

    const req = httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual(updates);
    req.flush(responseUser);
  });

  it("should delete user via delete()", () => {
    const userId = "1";

    service.delete(userId).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });

  it("should handle getAll() error", () => {
    service.getAll().subscribe(
      () => fail("should have failed"),
      (error) => {
        expect(error.message).toContain("Lỗi server: 500");
      }
    );

    const req = httpMock.expectOne(apiUrl);
    req.flush("Server error", { status: 500, statusText: "Server Error" });
  });

  it("should handle create() error", () => {
    const newUserData = { name: "Bob", email: "bob@ex.com" };

    service.create(newUserData).subscribe(
      () => fail("should have failed"),
      (error) => {
        expect(error.message).toContain("Lỗi server: 400");
      }
    );

    const req = httpMock.expectOne(apiUrl);
    req.flush("Bad request", { status: 400, statusText: "Bad Request" });
  });

  it("should handle update() error", () => {
    service.update("1", { name: "Updated" }).subscribe(
      () => fail("should have failed"),
      (error) => {
        expect(error.message).toContain("Dữ liệu không tìm thấy");
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush("Not found", { status: 404, statusText: "Not Found" });
  });

  it("should handle delete() error", () => {
    service.delete("1").subscribe(
      () => fail("should have failed"),
      (error) => {
        expect(error.message).toContain("Dữ liệu không tìm thấy");
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush("Not found", { status: 404, statusText: "Not Found" });
  });

  it("should construct correct URLs", () => {
    const userId = "123";

    service.getAll().subscribe();
    httpMock.expectOne(`${apiUrl}`);

    service.create({ name: "Test", email: "test@ex.com" }).subscribe();
    httpMock.expectOne(`${apiUrl}`);

    service.update(userId, { name: "Updated" }).subscribe();
    httpMock.expectOne(`${apiUrl}/${userId}`);

    service.delete(userId).subscribe();
    httpMock.expectOne(`${apiUrl}/${userId}`);
  });

  it("should handle user with avatar", () => {
    const userWithAvatar: User = {
      id: "1",
      name: "John",
      email: "john@ex.com",
      avatar: "https://example.com/avatar.jpg",
    };

    service
      .create({
        name: userWithAvatar.name,
        email: userWithAvatar.email,
        avatar: userWithAvatar.avatar,
      })
      .subscribe((user) => {
        expect(user.avatar).toBe(userWithAvatar.avatar);
      });

    const req = httpMock.expectOne(apiUrl);
    req.flush(userWithAvatar);
  });
});
