# Tuần 1 — tình trạng bàn giao

Ngày: 06/10/2026. Nhánh: `chore/week-1-foundation`.

## Đã làm

- Giữ và hoàn thiện các thay đổi Remove/Undo, Subject từ lượt trước.
- Thêm danh mục môn dùng chung, tìm kiếm, môn tự tạo, chống trùng, Recent.
- Giữ môn đang chọn trong timer ngay cả khi task duy nhất của môn bị xóa.
- Bảo vệ dữ liệu lưu bị lỗi: giữ nguyên bản gốc, không autosave đè lên dữ liệu đó.
- Cảnh báo lưu trữ tồn tại lâu dài; nút xuất workspace và tải bản gốc để phục hồi.
- Test Vitest/React Testing Library; Node 24.15+ trong nhánh 24.x.
- Typecheck sinh route types bằng next typegen trước khi chạy tsc.
- GitHub Actions, mẫu PR, workflow và hướng dẫn AI.

## Bằng chứng kiểm tra

- `npm run check`: qua typecheck, lint, 25 test trong 5 file, production build.
- Build xuất các trang /, /goals, /progress, /sessions, /subjects, /welcome.
- `git diff --check`: qua.
- `npm ci --dry-run --ignore-scripts --no-audit`: qua; đây không phải một lần cài sạch trên Linux.
- Workflow YAML đã đọc và kiểm tra cú pháp cục bộ. Chưa chạy GitHub Actions.
- Các gói đã có không đổi phiên bản; phụ thuộc mới phục vụ bộ test.
- `npm audit` còn 5 high trong công cụ ESLint, chưa có bản vá tương thích.
  Xem DEPENDENCY-SECURITY.md; không coi mục này là đã sửa.

## Kiểm tra trình duyệt

- Đã truy cập bản production tại localhost:3001 trên tab người dùng mở lại.
- Qua: tìm môn không phân biệt hoa/thường, chọn bằng phím mũi tên/Enter,
  Escape đóng danh sách, Tab tới tạo môn, chống trùng tên đã chuẩn hóa.
- Qua: tạo Japanese N3 thuộc Languages và task thử; tải lại vẫn còn dữ liệu,
  Recent hiển thị môn vừa dùng, timer nhận đúng môn của task.
- Qua: Remove và Undo khôi phục task thử. Đã xóa task thử sau khi kiểm tra;
  môn Japanese N3 vẫn nằm trong dữ liệu local tại port 3001.
- Kiểm tra mobile 390 px và 320 px. Phát hiện tràn ngang ở thẻ thống kê
  và mép popup tại 320 px; đã sửa cho số liệu xuống dòng và tính chiều rộng
  popup theo phần màn hình thực sự khả dụng, trừ thanh cuộn.
- Sau sửa, `npm run check` tiếp tục qua đầy đủ typecheck, lint, 25 test và build.
  Kiểm tra lại production: 320 px có clientWidth/scrollWidth cùng 305 px;
  390 px cùng 375 px (phần chênh là thanh cuộn). Popup nằm trong màn hình.
  Form tạo môn mở được, không có console error trong lần kiểm tra cuối.
- Đã trả trình duyệt về kích thước ban đầu và đóng biểu mẫu thử.

## Còn phải xác nhận / giới hạn

- Đã bấm Export study data nhưng công cụ không nhận sự kiện download;
  chưa tìm thấy file tương ứng trong thư mục Downloads mặc định.
  Chưa xác nhận thành công tải backup; đã hỏi người dùng kiểm tra file thực tế.
- Máy chủ production đã khởi động ở localhost:3001; port 3000 có bộ dữ liệu riêng.
- Người dùng đã yêu cầu commit/push nhánh tuần 1. Chưa mở PR hoặc merge main.
  Workflow hiện chạy khi mở PR vào main hoặc push main; push nhánh tuần 1
  riêng lẻ chưa kích hoạt CI. Chỉ xác nhận CI khi có kết quả chạy trên GitHub.
- Không có file-import UI, đăng nhập hoặc backend trong thay đổi tuần 1.

Chưa coi việc tải backup là hoàn tất khi chưa có file kiểm chứng. Công việc
tiếp theo sau commit/push là xác nhận backup và mở PR khi người dùng giao
thực hiện.
