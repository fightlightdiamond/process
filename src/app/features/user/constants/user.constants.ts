/**
 * User Feature Constants & Messages
 * All messages are in Vietnamese for user-facing text
 */

// User List Component Messages
export const USER_LIST_CONFIRM_DELETE_MESSAGE = (userName: string): string =>
  `Bạn chắc chắn muốn xóa user "${userName}"?`;

export const USER_LIST_CONFIRM_DELETE_ICON = "pi pi-exclamation-triangle";

// User Form Component Messages
export const USER_FORM_TITLE_CREATE = "Thêm User Mới";
export const USER_FORM_TITLE_EDIT = "Sửa Thông Tin User";
export const USER_FORM_LABEL_NAME = "Tên";
export const USER_FORM_LABEL_EMAIL = "Email";
export const USER_FORM_LABEL_AVATAR = "Avatar";
export const USER_FORM_PLACEHOLDER_NAME = "Nhập tên user";
export const USER_FORM_PLACEHOLDER_EMAIL = "Nhập email";
export const USER_FORM_PLACEHOLDER_AVATAR = "URL ảnh đại diện";
export const USER_FORM_ERROR_NAME_REQUIRED = "Tên là bắt buộc";
export const USER_FORM_ERROR_NAME_MIN_LENGTH = "Tên phải tối thiểu 2 ký tự";
export const USER_FORM_ERROR_EMAIL_REQUIRED = "Email là bắt buộc";
export const USER_FORM_ERROR_EMAIL_INVALID = "Email không hợp lệ";
export const USER_FORM_BUTTON_SAVE = "Lưu";
export const USER_FORM_BUTTON_CANCEL = "Hủy";

// User Container Component Messages
export const USER_CONTAINER_TITLE = "Quản Lý User";
export const USER_CONTAINER_BUTTON_ADD = "+ Thêm User";
export const USER_CONTAINER_LOADING = "Đang tải dữ liệu...";
export const USER_CONTAINER_ERROR_PREFIX = "Lỗi: ";

// API Error Messages
export const API_ERROR_NOT_FOUND = "Dữ liệu không tìm thấy";
export const API_ERROR_SERVER_PREFIX = "Lỗi server: ";
export const API_ERROR_CONNECTION =
  "Không thể kết nối đến server. Vui lòng kiểm tra JSON Server đã chạy?";
export const API_ERROR_LOAD_USERS = "Lỗi khi tải danh sách users";
export const API_ERROR_ADD_USER = "Lỗi khi thêm user";
export const API_ERROR_UPDATE_USER = "Lỗi khi cập nhật user";
export const API_ERROR_DELETE_USER = "Lỗi khi xóa user";

// User Model Constraints
export const USER_NAME_MIN_LENGTH = 2;
export const USER_NAME_MAX_LENGTH = 100;
export const USER_EMAIL_MAX_LENGTH = 100;
export const USER_AVATAR_MAX_LENGTH = 500;
