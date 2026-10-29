với BE:
    - Mọi request thành công đều trả về 200
    - Nếu có dùng repository cho phần relations hãy dùng object đừng dùng chuỗi string
    - Với File, uploadFile thì hãy dùng cơ chế module staticFile, nó luôn luôn hoạt động Api Upload trước trả về id, rồi id đó gắn vào API vào module chính
    - 
Với FE:
    - Với file .enum.ts thì hãy tham khảo (src/shared/api/financial/category/category.enum.ts), nó có enum, helperImpl, và export Helper
    - Với file .mutation.ts thì cũng tương tự tham khảo (src/shared/api/financial/category/category.mutation.ts), tôi đã định nghĩa sẵn các mutation custom rồi, chỉ cần áp dụng theo các nguyên tắc đó là được
    - Với file .type.ts thì tôi có định nghĩa IBaseEntity (src/shared/types/base-entity.ts), với các params cho ở những file useGet ấy, còn request hay response đặc biệt ở type.ts là được rồi, còn nữa với Paging tôi đã định nghĩa ở (src/shared/types/base-response.ts) nhé
    - Với 1 trang mới thì folder Router chỉ chứa có index của page ở (src/shared/pages) thôi, và trong folder src/shared/pages chứa module đó có các component con (modal, component con....), cố gắng chia file nhỏ nhỏ sao cho dễ maintain và kiểm soát nhé
    - Với Upload thì theo cơ chế: Upload xong lấy id gắn vào payload cho api tiếp theo (src/shared/pages/auth/profile.tsx)

Với cả 2:
    - Tất cả đều dùng npm run lint để check syntax