# Workflow StudyFlow

Quỹ thời gian: 5–8 giờ/tuần. Mục tiêu: beta nhỏ có đăng nhập và dữ liệu riêng.

## Một buổi 90–120 phút

1. 10 phút: git status, đọc ghi chú cũ, chọn một việc có điều kiện hoàn thành.
2. 5 phút: đọc code và tài liệu Next.js liên quan để tránh sửa sai kiến trúc.
3. 50–70 phút: làm từng bước nhỏ, test tái hiện lỗi logic trước khi sửa.
4. 15–25 phút: kiểm tra tự động, trình duyệt và diff để phát hiện hồi quy.
5. 5–10 phút: commit phần hoàn chỉnh, push nhánh nếu đã được giao và ghi việc kế tiếp.

Bảng việc: Chưa làm → Đang làm → Chờ kiểm tra → Xong. Chỉ một việc Đang làm.

## Git

main là bản ổn định. Nhánh theo mục tiêu: feat/google-login,
fix/storage-recovery, test/focus-timer, ci/quality-checks, docs/workflow.

Chỉ thực hiện chuỗi sau khi working tree sạch. Nếu còn thay đổi, kiểm tra
và giữ trên nhánh riêng trước; không reset hoặc pull đè lên công việc.

```powershell
git status --short
git switch main
git pull --ff-only origin main
git switch -c feat/ten-tinh-nang
```

Sau khi hoàn thành và kiểm tra:

```powershell
npm run check
git diff --check
git diff
git add -p
# Thêm file mới bằng git add với tên file cụ thể.
git diff --cached
git commit -m "feat(subjects): add searchable subject picker"
git push -u origin feat/ten-tinh-nang
```

Mỗi commit giải quyết một ý; tránh "fix all" hoặc "update".
Mở Draft PR nếu chưa xong; chuyển Ready khi qua kiểm tra. Dùng mẫu PR có sẵn.
Chỉ merge khi CI xanh, đã đọc diff, thử trình duyệt và không còn lỗi mất dữ liệu
hoặc phân quyền. Có thể Squash and merge. Sau đó switch main và pull --ff-only.
Sửa lỗi đã merge bằng nhánh sửa hoặc git revert; không force push main.

## Checklist trước commit

- npm run typecheck
- npm run lint
- npm run test:run
- npm run build
- git diff --check và đọc git diff --cached
- Thử luồng sửa, dữ liệu rỗng/sai, bấm hai lần, tải lại trang.
- Nếu sửa UI: desktop, mobile, bàn phím, lỗi console.
- Nếu có auth/backend: đăng xuất, đổi tài khoản, phân quyền dữ liệu.
- Không commit secret/dữ liệu thật; cập nhật README khi đổi hành vi.

`npm run check` chạy bốn lệnh npm trên. Thử bản production trong terminal riêng:

```powershell
$env:PORT = '3001'
npm start
```

Mở http://localhost:3001 sau khi build. localhost:3000 và localhost:3001
có localStorage riêng; không coi khác dữ liệu giữa hai cổng là mất dữ liệu.

## Backlog

| Ưu tiên    | Việc                                                     | File chính                                                                               |
| ---------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Cao        | Hoàn tất Subject/Remove và dữ liệu cũ                    | components/dashboard/subject-selector.tsx, overview.tsx, study-provider.tsx              |
| Cao        | Bảo vệ dữ liệu lỗi, xuất backup                          | utils/study-storage.ts, utils/study-backup.ts, components/dashboard/storage-controls.tsx |
| Cao        | Test logic, lưu trữ, timer                               | tests/unit/, tests/integration/, vitest.config.mts                                       |
| Cao        | CI và Node thống nhất                                    | .github/workflows/ci.yml, .nvmrc, package.json                                           |
| Cao        | Theo dõi/sửa advisory khi có bản tương thích             | docs/DEPENDENCY-SECURITY.md, package-lock.json                                           |
| Cao        | Đăng nhập và RLS, kiểm tra hai tài khoản                 | mới: app/login/, components/auth/, lib/supabase/, supabase/migrations/                   |
| Cao        | Chuyển thao tác sang backend                             | study-provider.tsx; mới: lib/repositories/                                               |
| Cao        | Tách dữ liệu demo, tổng thời gian thật và quyền riêng tư | data/mockData.ts, overview.tsx, progress.tsx, components/landing/landing-page.tsx        |
| Trung bình | E2E và test phân quyền                                   | mới: playwright.config.ts, tests/e2e/, tests/integration/authorization.test.ts           |
| Trung bình | Nhập dữ liệu local không trùng                           | mới: utils/import-study-data.ts                                                          |
| Trung bình | Streak, tuần và thành tích đầy đủ                        | mới: utils/study-metrics.ts; progress.tsx, utils/format.ts                               |
| Trung bình | Timer qua reload/nhiều tab                               | components/dashboard/use-focus-timer.ts                                                  |
| Thấp       | CSS, ngôn ngữ, nội dung mẫu                              | app/globals.css, components/layout/app-shell.tsx                                         |
| Thấp       | PWA, dark mode, thông báo                                | Chốt file khi chọn làm; ngoài 4 tuần đầu                                                 |

## Bốn tuần

- Tuần 1: hoàn tất thay đổi đang làm, bảo vệ lưu trữ, test, CI, tài liệu và
  quyết định về advisory. Hoàn thành khi kiểm tra qua và dữ liệu cũ vẫn dùng được.
- Tuần 2: Supabase Auth (đề xuất Google), schema, RLS và CRUD task đầu tiên.
  Hoàn thành khi A không truy cập dữ liệu B và task còn sau đăng nhập lại.
- Tuần 3: kết nối subjects, sessions, goals; trạng thái tải/lỗi; đổi tài khoản
  không giữ dữ liệu của tài khoản trước; tổng thời gian từ session thật.
- Tuần 4: kiểm tra production/mobile, redirect auth, backup/khôi phục, quyền
  riêng tư, triển khai beta và mời nhóm nhỏ phản hồi.

Dành khoảng 1 giờ dự phòng mỗi tuần. Khi thiếu giờ, hoãn import tự động,
streak và thành tích nâng cao; không bỏ phân quyền hoặc bảo vệ dữ liệu.

Đề xuất kiến trúc tuần 2: frontend xuất tĩnh trên Cloudflare Pages, Supabase
Auth/PostgreSQL. Chưa triển khai. RLS giới hạn user_id ở database; client chỉ
giữ publishable key, không có khóa quản trị. Giữ dữ liệu demo tách biệt.
Việc mở tài khoản, chọn gói trả phí và triển khai cần phạm vi được duyệt.

## Dùng AI

- Trước việc: nhờ đọc code, giải thích và đề xuất file/cách kiểm tra.
- Sau duyệt: giao một mục tiêu cụ thể, yêu cầu giữ phạm vi và thiết kế.
- Khi test: yêu cầu tình huống sai, dữ liệu cũ, bấm lặp và lỗi lưu trữ.
- Trước PR: review diff, đưa bằng chứng/tình huống tái hiện; chưa tự sửa.
- Cuối việc: ghi README, mô tả PR và ghi chú buổi sau theo kết quả thực tế.

Không đưa secret cho AI. Tự đọc logic chính và chạy kiểm tra; AI có thể sai.
