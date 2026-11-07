# Bản nội dung có thể cứu hộ trực tiếp

Các tệp trong thư mục này dùng UTF-8; nội dung văn bản chính là Markdown, thông tin và liên kết là JSON/JSONL.

## Nội dung hiện có

| Mục | Tệp |
|---|---|
| Văn bản Quyển 2, Chương 1 | `documents/document-b2-01.md` |
| Metadata của văn bản | `documents/document-b2-01.json` |
| Story (chưa điền tên tổng thể) | `library/stories/story-benny.json` |
| Hai Volume | `library/volumes/` |
| Chapter gắn Document | `library/chapters/chapter-b2-01.json` |
| Arc của Quyển 1 | `narrative/arcs/` |
| Thực thể đã nhận diện | `world/entities/` |
| Sự kiện, Wiki State | `timeline/events/`, `wiki/states/` |
| Lời tự nhủ/belief | `knowledge/assertions/` |
| Liên kết Arc | `relations/arc-links.jsonl` |

Thư mục chưa có dữ liệu vẫn có thể tồn tại với `index.json` rỗng. Không cần chạy Altair để mở các tệp trên.

**Không sửa tay bản mirror khi Altair thật đang mở.** Fixture này cho phép đọc/sửa thủ công để thiết kế và thử nghiệm; app sản xuất sẽ cần quy trình nhập thay đổi bên ngoài riêng.
