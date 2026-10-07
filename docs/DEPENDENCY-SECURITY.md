# Theo dõi phụ thuộc

Kiểm tra ngày 06/10/2026:

- `npm audit` báo 5 high, 0 critical, cùng chuỗi:
  eslint-config-next 16.3.8 → @next/eslint-plugin-next → fast-glob 3.3.1
  → micromatch 4.0.8 → braces 3.0.3.
- [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
  mô tả cạn stack do biểu thức braces lồng quá sâu; advisory chưa liệt kê bản vá.
- Registry hiện trả braces 3.0.3 và eslint-config-next 16.3.8 là latest.
- `npm audit fix --force` đề xuất hạ eslint-config-next xuống 14.2.35.
  Không áp dụng vì khác major với Next đang dùng và không phải nâng lên bản vá braces.

## Phạm vi và quyết định hiện tại

Chưa sửa được upstream advisory. Đây là phụ thuộc công cụ lint ở dev/CI,
không được đóng gói vào website xuất tĩnh. Không được diễn giải thành
"không còn rủi ro": tác vụ build/lint vẫn có thể bị gián đoạn nếu xử lý
biểu thức không đáng tin cậy. Không đưa đầu vào người dùng vào glob pattern.

Giữ lint hoạt động, giữ đúng major Next; không thêm override tới phiên bản
không tồn tại, không hạ major để làm báo cáo audit biến mất.
CI giới hạn quyền contents: read, không lưu Git credential, không dùng
pull_request_target và có timeout 15 phút. Không đưa secret vào job kiểm tra PR.

## Lần kiểm tra tiếp theo

Kiểm tra lại trước beta và khi cập nhật phụ thuộc:

```powershell
npm audit
npm ls braces micromatch fast-glob eslint-config-next
npm view braces version
npm view eslint-config-next version
```

Khi có bản vá tương thích: tạo nhánh chore/deps, cập nhật lockfile,
chạy npm ci rồi npm run check và audit lại. Chỉ đóng mục này sau khi
có bằng chứng phiên bản chịu ảnh hưởng đã được loại bỏ.
