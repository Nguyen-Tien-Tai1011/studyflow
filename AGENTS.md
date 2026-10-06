<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Quy tắc làm việc với StudyFlow

## Bối cảnh và phạm vi

- Một sinh viên phát triển dự án, quỹ thời gian 5–8 giờ/tuần.
- Giao tiếp bằng tiếng Việt, giải thích ngắn gọn và ưu tiên thay đổi nhỏ.
- Đọc README.md, package.json, git status và file liên quan trước khi sửa.
- Đọc tài liệu liên quan trong node_modules/next/dist/docs/; không đoán API từ phiên bản cũ.
- Đề xuất kế hoạch, file và cách kiểm tra; chỉ sửa khi người dùng duyệt phạm vi.
- Khi phạm vi đã được duyệt, tiếp tục trong phạm vi đó, không hỏi lại từng bước.
- Hỏi nếu thiếu thông tin ảnh hưởng hành vi, kiến trúc hoặc chi phí.
- Giữ nguyên thay đổi đang có của người dùng; không tự mở rộng phạm vi.

## Kiến trúc

- Next.js App Router, React, TypeScript strict, Tailwind CSS và Lucide.
- app/(workspace)/ là các trang học; app/welcome/ là trang giới thiệu.
- components/dashboard/study-provider.tsx quản lý state, hành động và lưu trữ.
- components/dashboard/use-focus-timer.ts giữ timer khi chuyển trang.
- types/index.ts chứa kiểu dùng chung; data/mockData.ts chỉ là dữ liệu minh họa.
- data/subject-catalog.ts chứa nhóm, gợi ý và chuẩn hóa tên môn.
- utils/study-storage.ts kiểm tra và chuyển dữ liệu cũ của khóa studyflow-v1.
- utils/study-backup.ts tải bản sao; storage-controls.tsx hiển thị phục hồi/xuất dữ liệu.
- next.config.ts dùng output: "export"; npm start phục vụ out/ qua scripts/serve.mjs.
- Node 24 được khai báo trong .nvmrc và package.json.
- Vitest và React Testing Library kiểm tra logic/component trong tests/.
- .github/workflows/ci.yml chạy kiểm tra khi push main hoặc mở PR vào main.
- Backend và đăng nhập chưa có; kế hoạch nằm trong docs/WORKFLOW.md.
- Cập nhật mô tả này khi kiến trúc thực sự thay đổi.

## Khi viết code

- Dùng lại component và kiểu hiện có; giữ giao diện ngoài phạm vi yêu cầu.
- Không thêm thư viện nếu chưa giải thích nhu cầu và được duyệt.
- Không dùng any hoặc tắt lint để né lỗi; ngoại lệ phải có lý do cụ thể.
- Chỉ dùng "use client" khi cần trạng thái hoặc API trình duyệt.
- Không thêm Server Actions, cookies phía server hoặc API động khi vẫn xuất tĩnh.
- Khi thêm backend, tách truy cập dữ liệu khỏi component hiển thị.

## Dữ liệu và bảo mật

- Không ghi đè dữ liệu lỗi/không đọc được bằng dữ liệu mẫu.
- Giữ nguyên bản gốc để tải xuống; cảnh báo rõ khi thay đổi chỉ tồn tại trong phiên.
- Đổi schema phải có chuyển dữ liệu và test tương thích dữ liệu cũ.
- Không trộn dữ liệu mẫu vào dữ liệu tài khoản thật.
- Không ghi secret/token/dữ liệu người dùng vào Git hoặc log.
- Không đưa khóa quản trị backend vào bundle trình duyệt.
- Khi có backend, phân quyền tại backend/database và kiểm tra chéo hai tài khoản.
- Không tự chạy npm audit fix --force; xem docs/DEPENDENCY-SECURITY.md.
- Không tự mua gói, đổi dịch vụ hoặc triển khai ngoài phạm vi đã duyệt.

## Kiểm tra, Git và báo cáo

- Chạy npm run typecheck, npm run lint, npm run test:run và npm run build.
- Viết test hành vi cho lỗi logic, lưu trữ, timer và phân quyền.
- Kiểm tra trình duyệt cho UI; jsdom không xác minh bố cục/scroll thực tế.
- Báo chính xác kết quả đã chạy và phần chưa kiểm tra; CI chỉ được xác nhận sau khi chạy trên GitHub.
- Một nhánh cho một mục tiêu, commit có ý nghĩa rõ ràng.
- Không tự commit, push hoặc merge nếu chưa được giao.
- Không force push main hoặc bỏ thay đổi chưa được duyệt.
- Không commit .env, node_modules, .next, out hay dữ liệu thật.
- Kết thúc bằng thay đổi, lý do, kiểm tra và phần còn lại.
