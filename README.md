# my-story-test — Altair portable workspace fixture

Repository thử nghiệm cấu trúc lưu trữ cho **Altair**, dựa trên 14 nhóm dữ liệu cấp cao và 43 nhóm chi tiết trong *Danh mục dữ liệu tổng thể* (07/11/2026).

Đây là **fixture thiết kế** để dựng vỏ ứng dụng và kiểm tra tham chiếu. Nó **không phải kho sản xuất**, không phải schema SQLite chính thức của `Altair-II` và không xác nhận các gợi ý AI thành canon của tác giả.

## Bắt đầu

- [Sơ đồ kho và quy tắc biểu diễn](docs/STORAGE_LAYOUT.md).
- [Manifest kho mô phỏng](workspace/altair-workspace.json).
- [Bản cứu hộ Markdown/JSON](workspace/portable/INDEX.md).
- Văn bản thực của tác giả: `workspace/portable/documents/document-b2-01.md`,
  `document-b2-02.md` và `document-b2-03.md` (Quyển 2, Chương 1–3).
- Mô phỏng SQLite (tạo từ nguồn Markdown/JSON, không commit DB): `python3 tools/build_demo_sqlite.py`.
- Kiểm tra ID, đường dẫn, tham chiếu và văn bản: `node tools/check_workspace.mjs`.

## Phạm vi

- Đủ **14 thư mục nghiệp vụ**. Nhóm chưa có thông tin chỉ có `index.json` rỗng, không tự tạo thuộc tính/tình tiết.
- Một tác phẩm chưa có tên tổng thể đã xác nhận, hai quyển; có văn bản Quyển 2/Chương 1–3.
- Ba Arc Quyển 1 và phạm vi chương theo ví dụ tác giả đưa ra; không tự sinh nội dung 30 chương chưa được cung cấp.
- Sự kiện/trạng thái/nhận thức của Chương 1–3 có neo nguồn; niềm tin và lời khẳng định
  của nhân vật không mặc nhiên trở thành sự thật khách quan. Chương 2 không được tự đặt tiêu đề.
- Các trạng thái UI thử nghiệm đặt trong `workspace/scenarios/`, **không ghi ngược** thành dữ kiện tác phẩm.

Không dùng repository này để đồng bộ dữ liệu thật hoặc làm migration từ Story Manager. Không cần Git CLI, tài khoản mạng hay dịch vụ ngoài để đọc bộ dữ liệu đã xuất.
