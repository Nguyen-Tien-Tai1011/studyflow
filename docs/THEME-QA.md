# Giao diện Sáng / Tối / Theo hệ thống

Nhánh: `feature/dark-mode`. Không thêm thư viện.

## Hành vi

- Nút trên thanh điều hướng của workspace và `/welcome`; lựa chọn tương ứng tại `/settings`.
- Mặc định Theo hệ thống. Lưu `light`, `dark` hoặc `system` vào `studyflow-theme`.
- Theme không đọc/ghi khóa dữ liệu học `studyflow-v1`.
- Khi Theo hệ thống, nghe thay đổi `prefers-color-scheme`; lựa chọn thủ công giữ nguyên khi máy đổi chế độ.
- Đồng bộ giữa các tab cùng origin. Localhost khác port vẫn là hai nơi lưu độc lập.
- Khi không đọc/ghi được localStorage, vẫn đổi giao diện trong phiên; Settings báo không lưu được.
- Script tĩnh trong head áp dụng data-theme và color-scheme trước nội dung. Root layout vẫn là Server Component; provider/controls là Client Component.
- Tailwind 4 dùng custom variant theo data-theme; bảng biến màu trong globals.css dùng chung cho mọi trang.
- Focus Session giữ phong cách nền xanh đậm trong cả hai chế độ; ảnh welcome giữ màu tự nhiên.

## Đã kiểm tra

- `npm run check`: typecheck, lint, 43 test trong 10 file và production build đều qua.
- Test mô phỏng OS đổi sáng/tối, lựa chọn thủ công, dữ liệu lưu hỏng/không hợp lệ,
  storage bị chặn, đồng bộ tab, cleanup listener, bàn phím Escape và dữ liệu học không bị sửa.
- Test các cặp biến màu chữ/nền chính: ít nhất 4,5:1; cột biểu đồ/nền: ít nhất 3:1.
  Đây là kiểm tra bảng màu, không phải chứng nhận khả năng tiếp cận toàn bộ ứng dụng.
- Bản HTML xuất của Dashboard, Settings, welcome chứa script khởi tạo trước body.
- Trình duyệt production: xem Dashboard, Subjects, Sessions, Progress, Goals, Settings,
  welcome ở cả hai nền; đã xem toàn trang welcome tối và Progress sáng.
- Kiểm tra Subject popup và Focus Custom trên nền tối mobile; không tạo/xóa dữ liệu học khi thử theme.
- Lựa chọn Tối giữ sau tải lại Settings; chuyển sang welcome và quay lại vẫn đồng bộ.
- Desktop rộng 1400 px, mobile 320/390 px; sửa tràn header ở 320 px và 1200 px.
  Menu thu gọn áp dụng đến 1280 px để đủ chỗ cho Settings và nút giao diện.
- Lần kiểm tra cuối không có console error. Đã trả viewport về mặc định và lựa chọn Theo hệ thống.
- Chưa đổi chế độ hệ điều hành thật bằng công cụ; hành vi đổi OS được kiểm tra bằng test mô phỏng.
- Chưa đo first-paint bằng bản ghi hiệu năng; đã kiểm tra thứ tự script trong HTML, logic khởi tạo và reload thực tế.
- Chưa push nhánh hoặc chạy CI trên GitHub cho thay đổi này.

## Checklist tự kiểm tra bằng mắt

1. Mở `/settings`, chọn Sáng rồi Tối. Nút trên thanh điều hướng phải đổi theo.
2. Chọn Tối và tải lại; quan sát ngay lúc trang mở để phát hiện nháy nền sáng.
   Thử mở trực tiếp `/`, `/settings`, `/welcome` trong tab mới cùng origin.
3. Chọn Theo hệ thống, đổi cài đặt màu của máy giữa sáng/tối khi app đang mở.
   App phải tự đổi. Chọn Sáng thủ công rồi đổi máy sang Tối: app vẫn phải sáng.
4. Mở Dashboard, Subjects, Sessions, Progress, Goals và welcome ở mỗi chế độ.
   Xem chữ phụ, ô tìm kiếm, bảng, menu nổi, thanh tiến độ, biểu đồ và trạng thái hoàn thành.
5. Trong Focus Session, xem cả Pomodoro và Custom: số đếm, ô phút, nút Apply/Start/Reset
   phải rõ. Chuyển theme không được reset phiên đang chạy.
6. Ở welcome, xem ảnh, chú thích ảnh, thẻ nổi, các khối giới thiệu và chân trang.
7. Thu cửa sổ về chiều rộng 320–390 px; mở menu giao diện và navigation.
   Không được có cuộn ngang toàn trang; bảng Sessions có vùng cuộn riêng.
8. Dùng Tab để đến nút giao diện, Enter để mở, phím mũi tên/Space để chọn,
   Escape để đóng. Luôn nhìn thấy vị trí focus.
9. Mở hai tab cùng địa chỉ/port, đổi lựa chọn ở một tab và kiểm tra tab còn lại.
   Kiểm tra task, môn học và lịch sử vẫn còn nguyên.
