# Cấu trúc lưu trữ — Altair mock workspace

## Một kho, hai cách truy cập

1. `workspace/runtime/workspace.demo.sqlite`: **bản mô phỏng SQLite** để chạy truy vấn thử; tạo bởi script từ cùng các tệp nguồn. Không commit vào Git và **không nhận là SQLite schema runtime của Altair II**.
2. `workspace/portable/`: tệp Markdown/JSON có thể sao chép hoặc mở trực tiếp bằng trình đọc văn bản. Đây là dữ liệu sáng tác và metadata của fixture.

Trong ứng dụng thật, DATA_MODEL Altair II định hướng SQLite là nguồn ghi chính; Portable Mirror là bản phản chiếu một chiều sau lưu và cần hợp đồng giao dịch riêng. Trong **fixture** này, các tệp portable là seed được quản lý thủ công, còn SQLite dựng lại từ chúng để tránh hai nguồn ghi cạnh tranh.

## Bản đồ 14 nhóm

| # | Nhóm | Thư mục trong `workspace/portable` |
|---|---|---|
| 01 | Thư viện & tác phẩm | `library/` |
| 02 | Tài liệu & nội dung | `documents/` |
| 03 | Cấu trúc trần thuật | `narrative/` |
| 04 | Góc nhìn & giọng kể | `voice/` |
| 05 | Thế giới hư cấu | `world/` |
| 06 | Wiki & hồ sơ | `wiki/` |
| 07 | Timeline & lịch | `timeline/` |
| 08 | Nhận thức & tiết lộ | `knowledge/` |
| 09 | Thuộc tính & phân loại | `taxonomy/` |
| 10 | Biên tập & nhất quán | `editorial/` |
| 11 | Ý tưởng & ghi chú | `ideas/` |
| 12 | Thống kê & phiên viết | `metrics/` |
| 13 | Xuất bản & cộng tác | `publication/` |
| 14 | Tài nguyên & lưu trữ | `assets/`, `history/`, `translations/`, `relations/` |

`relations/` là lớp cạnh xuyên nhóm, không phải chủ sở hữu thứ hai của các đối tượng. `scenarios/` nằm **ngoài** `portable/` để không bị nhầm thành dữ kiện truyện.

## Danh tính và quan hệ

- ID ổn định, không suy danh tính từ tên file hay thứ tự chương.
- `Document` giữ nội dung gốc. `Chapter` chỉ tham chiếu `documentId`, có thể không có `volumeId`; Document có thể chưa thuộc Story.
- `Arc` chứa phạm vi dự kiến; `ArcLink` nối Arc ↔ sự kiện/trạng thái/cảnh/chương theo ID, không sao chép đối tượng đích.
- `WorldEntity` là đối tượng có cấu trúc; `WikiArticle` là bài mô tả riêng. Không ép mọi Entity phải có WikiArticle.
- Event, trạng thái, niềm tin và tiết lộ là các đối tượng khác nhau. Lời Benny tự nhủ Mercy là NPC nằm trong `knowledge/assertions`, **không là World Fact**.
- Giá trị không có trong nguồn được **bỏ qua**, không gán tên, tuổi, lịch, POV hoặc trạng thái hoàn thiện giả.
- Gợi ý và suy luận từ AI chỉ được đưa vào vùng chờ duyệt; các ví dụ ở đây dùng thông tin trích trực tiếp hoặc outline do tác giả cung cấp.

## Neo và nguồn

`sourceRef` có `documentId` và có thể có `paragraphId`, hoặc `kind: author_outline` khi dữ liệu chỉ do tác giả nêu ngoài văn bản. Vị trí `p001...` dựa trên cách đếm **đoạn văn nội dung, bỏ hai dòng tiêu đề Markdown**, bắt đầu từ 1. Khi sửa body, cần kiểm lại neo theo revision/hash trước khi tiếp tục dùng.

Với Chương 2–3 Quyển 2, bản dán của tác giả chứa tiêu đề dạng văn bản thường (không phải
`#` Markdown), nên `p001` là đoạn tiêu đề nguồn; `p002` bắt đầu nội dung. Kho lưu
giữ nguyên `&#x9;` và ký tự escape Markdown được tác giả dán; không chuẩn hóa ngầm.
Khi bóc tách, các sự kiện được gắn `chapterId` và `sourceRef` để truy vết.

## Những gì chưa tạo

Không có dữ liệu thật cho Plotline, Beat, POV, Fictional Calendar, Conlang, mục tiêu số từ, phiên viết, asset bìa, publication profile và quyền đồng tác giả. Các thư mục/index rỗng là trạng thái hợp lệ, **không phải lỗi cấu trúc**.
Không tự suy ra Arc của Quyển 2, giới tính hay tuổi của nhân vật phụ, ngày theo lịch hư cấu
hoặc đặt tên cho Chương 2. Nhận định của Clerk 88 về việc phát nhầm vật phẩm vẫn là
`Assertion`, khác với cảnh báo hệ thống đã hiển thị.

## Giới hạn

Bộ này chỉ nhằm kiểm tra bố cục kho, đọc trực tiếp và quan hệ từ một mẫu nhỏ. Chưa kiểm thử lưu đồng thời SQLite–mirror, di chuyển/rollback, 20.000 chương/quyển, soát toàn văn, Git sync, mã hóa hoặc quyền cộng tác.
