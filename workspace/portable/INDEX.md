# Bản nội dung có thể cứu hộ trực tiếp

Các tệp trong thư mục này dùng UTF-8; nội dung văn bản chính là Markdown, thông tin và liên kết là JSON/JSONL.

## Nội dung hiện có

| Mục | Tệp |
|---|---|
| Văn bản Quyển 2, Chương 1 | `documents/document-b2-01.md` |
| Văn bản Quyển 2, Chương 2 | `documents/document-b2-02.md` |
| Văn bản Quyển 2, Chương 3 | `documents/document-b2-03.md` |
| Chương thuộc truyện nhưng ngoài mọi quyển | `documents/document-free-galahad-01.md` |
| Metadata của từng văn bản | `documents/document-b2-01.json` đến `document-b2-03.json` |
| Story (chưa điền tên tổng thể) | `library/stories/story-benny.json` |
| Hai Volume | `library/volumes/` |
| Chapter gắn Document | `library/chapters/chapter-b2-01.json` đến `chapter-b2-03.json` |
| Chapter không có `volumeId` | `library/chapters/chapter-free-galahad-01.json` |
| Arc của Quyển 1 | `narrative/arcs/` |
| Thực thể đã nhận diện | `world/entities/` |
| Sự kiện, Wiki State | `timeline/events/`, `wiki/states/` |
| Lời tự nhủ/belief | `knowledge/assertions/` |
| Thuật ngữ Mỏ Neo, Nhiệm Vụ Bắt Buộc | `taxonomy/terms/` |
| Quan hệ nhân vật và vật phẩm | `world/relations/` |
| Tiết lộ về Mỏ Neo cho Benny | `knowledge/disclosures/` |
| Liên kết Arc | `relations/arc-links.jsonl` |
| Ba cảnh được neo theo đoạn văn nguồn | `narrative/scenes/scene-free-galahad-01.json` đến `scene-free-galahad-03.json` |

Hai chương mới được tách từ một bản Markdown mà tác giả gửi; ký hiệu nguồn như
`&#x9;` và dấu escape trước dấu chấm trong `W\.E.C` được giữ nguyên, không tự sửa câu chữ.
Chương 2 chưa có tiêu đề trong nguồn nên metadata chỉ có số thứ tự.
Các neo `p001` của Chương 2 và 3 trỏ vào dòng tiêu đề nguồn.

Chương ngoài quyển không có tiêu đề tác giả cung cấp, không có số thứ tự và không thuộc
bất cứ Volume nào. Để hiển thị trong trang truyện, truy vấn các Chapter theo `storyId`,
kể cả khi `volumeId` không tồn tại; không chỉ duyệt danh sách các Volume.
Các cảnh trong chương đó chỉ dùng ranh giới đoạn văn và dấu ngắt rõ ràng, không suy
diễn Arc, POV hoặc loại cảnh.

Thư mục chưa có dữ liệu vẫn có thể tồn tại với `index.json` rỗng. Không cần chạy Altair để mở các tệp trên.

**Không sửa tay bản mirror khi Altair thật đang mở.** Fixture này cho phép đọc/sửa thủ công để thiết kế và thử nghiệm; app sản xuất sẽ cần quy trình nhập thay đổi bên ngoài riêng.
