
export type Industry = {
    name: {
        vi: string;
        ja: string;
        en: string;
    };
    slug: string;
    termCode: string; // Add NAICS code for structured data
    keywords: string[];
};

export const CAREERS = {
  "thuc-tap-sinh-ky-nang": [
    "Ngư nghiệp",
    "Nông Nghiệp",
    "Thực phẩm",
    "Sản xuất, dịch vụ tổng hợp",
    "Cơ khí, kim loại",
    "Xây dựng",
    "May mặc"
  ],
  "ky-nang-dac-dinh": [
    "Ngư nghiệp",
    "Nông nghiệp",
    "Nhà hàng",
    "Thực phẩm",
    "Sản xuất, dịch vụ tổng hợp",
    "Điện, điện tử",
    "Chế tạo Vật liệu",
    "Cơ khí, chế tạo máy",
    "Ô tô",
    "Hàng không",
    "Vận tải",
    "Xây dựng",
    "Vệ sinh toà nhà",
    "Lưu trú, khách sạn",
    "Điều dưỡng"
  ],
  "ky-su-tri-thuc": [
    "Nông lâm ngư nghiệp",
    "Thực phẩm",
    "Sản xuất, chế tạo, công nghệ",
    "Cơ khí, máy móc",
    "Công nghệ ô tô",
    "Vận chuyển hàng hoá",
    "Xây dựng",
    "Khách sạn, lưu trú",
    "Y tế, điều dưỡng",
    "Kinh doanh, kinh tế",
    "Tài chính, kế toán, bảo hiểm",
    "Báo chí, truyền thông, marketing",
    "Công nghệ thông tin",
    "Nghiên cứu, phân tích",
    "Giáo dục, đào tạo",
    "Hành chính, văn phòng",
    "Pháp lý",
    "Nghệ thuật, nghệ sĩ",
    "Thể dục thể thao",
    "Nghề có kỹ năng chuyên nghiệp",
    "Việc làm bán chuyên nghiệp"
  ]
}

export const industriesByJobType: { [key: string]: Industry[] } = {
    'thuc-tap-sinh-ky-nang': [
      { name: { vi: 'Ngư nghiệp', ja: '漁業関係', en: 'Fishery' }, slug: 'ngu-nghiep-tts', termCode: '11411', keywords: [
          'Câu cá ngừ cần và dây', 'Câu mực', 'Câu tôm, cua bằng lồng', 'Đánh cá dây câu dài', 'Đánh cá lưới kéo', 'Đánh cá lưới rê', 'Đánh cá lưới sào', 'Đánh cá lưới thả', 'Đặt lưới đánh cá', 'Nuôi sò điệp'
      ] },
      { name: { vi: 'Nông nghiệp', ja: '農業関係', en: 'Agriculture' }, slug: 'nong-nghiep-tts', termCode: '111', keywords: [
          'Chăn nuôi bò', 'Chăn nuôi bò sữa', 'Chăn nuôi gà', 'Chăn nuôi lợn', 'Nhặt trứng gà', 'Nông nghiệp chăn nuôi', 'Nông nghiệp trồng trọt', 'Thu hoạch bắp cải', 'Thu hoạch cà chua', 'Thu hoạch dâu tây', 'Thu hoạch hoa', 'Thu hoạch hoa quả', 'Thu hoạch rau củ', 'Trồng cây ăn quả', 'Trồng nấm', 'Trồng nấm công nghệ cao', 'Trồng rau củ', 'Trồng trọt nhà kính'
      ] },
      { name: { vi: 'Thực phẩm', ja: '食品製造関係', en: 'Food Manufacturing' }, slug: 'thuc-pham-tts', termCode: '311', keywords: [
          'Bánh gạo', 'Bánh kẹo', 'Bánh ngọt', 'Bếp viện', 'Chế biến cá', 'Chế biến đồ ăn sẵn', 'Chế biến gia cầm', 'Chế biến sushi', 'Chế biến thịt bò, lợn', 'Chế biến thuỷ sản sống', 'Chiết xuất thuỷ sản', 'Cơm hộp', 'Cơm nắm', 'Cửa hàng siêu thị', 'Đậu hũ', 'Đồ ăn kèm', 'Đồ konbini', 'Đóng gói bánh kẹo', 'Đóng gói cafe', 'Đóng gói gạo', 'Đóng gói rau', 'Đóng gói rau củ', 'Đóng gói rong biển', 'Đóng gói thanh cua', 'Đóng hộp thực phẩm', 'Gia công đồ ăn liền', 'Giăm bông, xúc xích...', 'Há cảo', 'Làm bánh kẹo', 'Mỳ tôm', 'Salad', 'Sản xuất bánh mì', 'Sản xuất dưa muối', 'Sản xuất mắm cá', 'Sản xuất mỳ', 'Siêu thị', 'Tẩm ướp thuỷ sản', 'Thái cá sashimi', 'Thịt bò', 'Thịt gà', 'Thịt lợn', 'Thức ăn cơ sở y tế', 'Thực phẩm', 'Thực phẩm sữa', 'Thực phẩm trứng', 'Thuỷ sản gia công chế biến', 'Thuỷ sản khô', 'Thuỷ sản lên men', 'Thuỷ sản sấy khô', 'Thuỷ sản ủ muối', 'Thuỷ sản xông khói'
      ] },
      { name: { vi: 'Sản xuất, dịch vụ tổng hợp', ja: '総合生産とサービス', en: 'General Manufacturing and Services' }, slug: 'san-xuat-dich-vu-tong-hop-tts', termCode: '3261', keywords: [
          '(Khách sạn) Tiếp khách, quản lý vệ sinh', 'Bảo dưỡng ô tô', 'Bảo trì đường sắt', 'Buồng phòng khách sạn', 'Công việc cưa gỗ', 'Điều dưỡng, hộ lý', 'Dọn dẹp khoang hành khách', 'Đóng gói', 'Đóng gói công nghiệp', 'Đóng gói mỹ phẩm', 'Đóng sách', 'Đúc gốm bằng áp lực', 'Đúc khuôn cao su', 'Đục lỗ hộp in', 'Đúc nhựa', 'Đúc nhựa cán xếp chồng', 'Đục nhựa ép phun', 'Đúc nhựa nén', 'Đúc nhựa thổi định hình', 'Đúc nhựa thổi phồng', 'Gia công đồ gia dụng', 'Gia công ép đùn cao su', 'Gia công sản phẩm gỗ', 'Gỗ ép', 'Hàng hóa hàng không', 'Hỗ trợ mặt đất máy bay', 'In gốm', 'In offset', 'In ống đồng', 'In vỏ bánh kẹo', 'Kiểm tra linh kiện ô tô', 'Kiểm tra sản phẩm nhựa', 'Lắp ráp linh kiện ô tô', 'Linh kiện ô tô', 'Nặn gốm bằng bánh xoay', 'Nhiên liệu rắn từ rác', 'Sản xuất hộp bìa cứng', 'Sản xuất hộp in', 'Sản xuất hộp nhãn dán', 'Sản xuất linh kiện', 'Sản xuất pin năng lượng', 'Sản xuất vải lanh', 'Sửa chữa ô tô', 'Thiết bị khí nén đường sắt', 'Trộn và cán cao su', 'Vật liệu composite nhiều lớp', 'Vệ sinh phòng học', 'Vệ sinh toà nhà', 'Vệ sinh văn phòng'
      ] },
      { name: { vi: 'Cơ khí, kim loại', ja: '機械・金属関係', en: 'Machinery & Metal' }, slug: 'co-khi-kim-loai-tts', termCode: '332710', keywords: [
          'Bản mạch in', 'Bảo trì máy móc', 'Chế tạo kim loại tấm', 'Chế tạo máy', 'Cơ khí', 'Cuộn dây máy điện quay', 'Dập khuôn kim loại', 'Điện', 'Điện tử', 'Đóng tàu', 'Đúc', 'Đúc gang', 'Đúc khuôn', 'Đúc khuôn buồng lạnh', 'Đúc khuôn buồng nóng', 'Đúc kim loại màu', 'Ép dập kim loại', 'Gia công cơ khí', 'Gia công ép đùn', 'Gia công kim loại - Tekko', 'Gia công tinh', 'Hàn', 'Hàn bán tự động', 'Hàn kết cấu', 'Hàn khí', 'Hàn khung thép', 'Hàn tàu', 'Hàn thủ công', 'Hàn tủ điện', 'Hàn xì', 'Hoàn thiện dụng cụ nung chảy', 'Hoàn thiện khuôn', 'Hoàn thiện sản phẩm ép đùn', 'Kiểm tra máy móc', 'Lắp đặt điều hoà', 'Lắp đặt máy móc', 'Lắp đặt tủ lạnh', 'Lắp ráp điện', 'Lắp ráp điện tử', 'Lắp ráp linh kiện bán dẫn', 'Lắp ráp máy biến áp', 'Lắp ráp thiết bị điện khí', 'Lắp ráp thiết bị điện quay', 'Lắp ráp thiết bị điện tử', 'Lắp thiết bị đóng, mở', 'Lắp tủ điện, tủ điều khiển', 'Mạ điện', 'Mạ kẽm nhúng nóng', 'Máy sản xuất tấm kim loại', 'Rèn', 'Rèn bằng búa', 'Sơn', 'Sơn cầu thép', 'Sơn công trình xây dựng', 'Sơn kim loại', 'Sơn phun', 'Sử dụng máy phay', 'Sử dụng máy tiện số', 'Sử dụng máy tiện thường', 'Thi công điện', 'Thi công kết cấu thép', 'Thiết kế bảng mạch in', 'Vận hành máy', 'Vận hành máy CNC', 'Vận hành máy ép', 'Vận hành máy ép nhựa', 'Vận hành robot', 'Xử lý điện hóa nhôm'
      ] },
      { name: { vi: 'Xây dựng', ja: '建設関係', en: 'Construction' }, slug: 'xay-dung-tts', termCode: '23', keywords: [
          'Bê tông', 'Buộc thép', 'Chống thấm', 'Cốp pha công trình', 'Dán tường', 'Đổ bê tông áp lực', 'Đổ nhựa đường', 'Dựng giàn giáo', 'Đường ống', 'Đường ống điều hoà', 'Đường ống nhà máy', 'Đường ống nước', 'Đường ống xây dựng', 'Gia công đường ống', 'Gia công khung thép', 'Gia công khung thép trong xưởng', 'Gia công sắt trong xưởng', 'Gia công vật liệu đá', 'Hàn khung thép trên cao', 'Hoàn thiện nội thất', 'Hoàn thiện sàn nhựa', 'Hoàn thiện sàn thảm', 'Hoàn thiện ván', 'Hút nước ngầm công trình', 'Khoan giếng máy dập', 'Khoan giếng máy khoan', 'Khung chắn toà nhà', 'Lái máy ủi', 'Lái máy xây dựng', 'Lái máy xúc', 'Lái máy xúc lật', 'Lái xe lu', 'Làm nền, móng', 'Lắp bồn tắm', 'Lắp đặt đường ống', 'Lắp đặt lò nung-xây dựng', 'Lắp đặt pin năng lượng', 'Lắp điện lạnh, điều hòa', 'Lắp ghép cốt thép', 'Lát đá', 'Lợp mái nhà', 'Lợp ngói', 'Mộc cốp pha', 'Nội thất gỗ-xây dựng', 'Ốp lát gạch', 'Phá dỡ', 'San lấp mặt bằng', 'Sản xuất bê tông', 'Sơn xây dựng', 'Tấm kim loại kiến trúc', 'Tấm kim loại ống gió', 'Thi công dán tường', 'Thi công lắp rèm', 'Thi công móng thép', 'Thợ mộc xây dựng', 'Trát vữa', 'Xây dựng tổng hợp'
      ] },
      { name: { vi: 'May mặc', ja: '繊維・衣服関係', en: 'Textile & Apparel' }, slug: 'may-mac-tts', termCode: '315', keywords: [
          'Chăn ga gối đệm', 'Công việc trước kéo sợi', 'Công việc trước khi dệt', 'Dệt hoàn thiện', 'Dệt kim máy sợi dọc', 'Dệt may', 'Gia công dệt', 'Gia công sợi hỗn hợp', 'Kéo sợi tinh', 'May khăn mặt', 'May mặc', 'May quần áo', 'May quần áo nam', 'Nhuộm chỉ', 'Nhuộm vải, đan len', 'Quần áo phụ nữ, trẻ em', 'Quấn sợi', 'Sản xuất áo sơ mi', 'Sản xuất đồ lót', 'Sản xuất ghế ngồi ô tô', 'Sản xuất máy dệt kim tròn', 'Sản xuất tất', 'Sản xuất thảm dệt', 'Sản xuất thảm đục lỗ', 'Sản xuất thảm nhung nổi', 'Sản xuất vải bạt'
      ] }
    ],
    'ky-nang-dac-dinh': [
      { name: { vi: 'Ngư nghiệp', ja: '漁業', en: 'Fisheries' }, slug: 'ngu-nghiep-tokutei', termCode: '11411', keywords: ['Nuôi trồng thủy sản', 'Đánh bắt cá'] },
      { name: { vi: 'Sản xuất, dịch vụ tổng hợp', ja: '総合生産とサービス', en: 'General Manufacturing and Services' }, slug: 'san-xuat-dich-vu-tong-hop-tokutei', termCode: '31-33', keywords: ['Sản xuất', 'Lắp ráp', 'Đóng gói'] },
      { name: { vi: 'Ô tô', ja: '自動車整備', en: 'Automobile Maintenance' }, slug: 'o-to-tokutei', termCode: '811110', keywords: ['Bảo dưỡng ô tô', 'Sửa chữa thân vỏ', 'Sơn ô tô'] },
      { name: { vi: 'Vệ sinh toà nhà', ja: 'ビルクリーニング', en: 'Building Cleaning' }, slug: 've-sinh-toa-nha-tokutei', termCode: '561720', keywords: ['Vệ sinh toà nhà', 'Lau kính', 'Quản lý vệ sinh'] },
      { name: { vi: 'Nông nghiệp', ja: '農業', en: 'Agriculture' }, slug: 'nong-nghiep-tokutei', termCode: '111', keywords: ['Trồng trọt', 'Chăn nuôi'] },
      { name: { vi: 'Điện, điện tử', ja: '電気・電子情報関連産業', en: 'Electric & Electronic Information' }, slug: 'dien-dien-tu-tokutei', termCode: '334', keywords: ['Lắp ráp linh kiện', 'Kiểm tra bảng mạch', 'Vận hành máy SMT'] },
      { name: { vi: 'Hàng không', ja: '航空', en: 'Aviation' }, slug: 'hang-khong-tokutei', termCode: '4881', keywords: ['Dịch vụ mặt đất', 'Vệ sinh tàu bay', 'Bốc xếp hàng hóa'] },
      { name: { vi: 'Lưu trú, khách sạn', ja: '宿泊', en: 'Lodging' }, slug: 'luu-tru-khach-san-tokutei', termCode: '721', keywords: ['Lễ tân', 'Buồng phòng', 'Dịch vụ nhà hàng khách sạn'] },
      { name: { vi: 'Nhà hàng', ja: '外食業', en: 'Food Service Industry' }, slug: 'nha-hang-tokutei', termCode: '722511', keywords: ['Nấu ăn', 'Phục vụ', 'Quản lý nhà hàng'] },
      { name: { vi: 'Chế tạo Vật liệu', ja: '素形材産業', en: 'Material Processing industry' }, slug: 'che-tao-vat-lieu-tokutei', termCode: '327', keywords: ['Đúc', 'Rèn', 'Xử lý nhiệt'] },
      { name: { vi: 'Vận tải', ja: '運送', en: 'Transportation' }, slug: 'van-tai-tokutei', termCode: '484', keywords: ['Lái xe', 'Giao nhận hàng hóa', 'Quản lý kho'] },
      { name: { vi: 'Điều dưỡng', ja: '介護', en: 'Nursing care' }, slug: 'dieu-duong-tokutei', termCode: '623', keywords: ['Chăm sóc người cao tuổi', 'Hỗ trợ sinh hoạt', 'Hộ lý'] },
      { name: { vi: 'Thực phẩm', ja: '飲食料品製造業', en: 'Food and beverages manufacturing industry' }, slug: 'thuc-pham-tokutei', termCode: '311', keywords: ['Chế biến thực phẩm', 'Đóng gói', 'Kiểm tra chất lượng'] },
      { name: { vi: 'Cơ khí, chế tạo máy', ja: '産業機械製造業', en: 'Industrial machinery manufacturing industry' }, slug: 'co-khi-che-tao-may-tokutei', termCode: '333', keywords: ['Vận hành máy CNC', 'Hàn', 'Bảo trì máy móc'] },
      { name: { vi: 'Xây dựng', ja: '建設', en: 'Construction' }, slug: 'xay-dung-tokutei', termCode: '23', keywords: ['Giàn giáo', 'Cốt thép', 'Cốp pha', 'Hoàn thiện nội thất'] },
    ],
    'ky-su-tri-thuc': [
        { name: { vi: 'Nông lâm ngư nghiệp', ja: '農林水産業', en: 'Agriculture, Forestry, Fisheries' }, slug: 'nong-lam-ngu-nghiep-ks', termCode: '11', keywords: ['Nông nghiệp', 'Lâm nghiệp', 'Thủy sản'] },
        { name: { vi: 'Thực phẩm', ja: '食品', en: 'Food Products' }, slug: 'thuc-pham-ks', termCode: '311', keywords: ['Chế biến thực phẩm', 'Sản xuất đồ uống'] },
        { name: { vi: 'Sản xuất, chế tạo, công nghệ', ja: '製造・加工・技術', en: 'Manufacturing, Processing, Technology' }, slug: 'san-xuat-che-tao-cong-nghe-ks', termCode: '31-33', keywords: ['Sản xuất', 'Chế tạo', 'Công nghệ'] },
        { name: { vi: 'Cơ khí, máy móc', ja: '機械', en: 'Machinery' }, slug: 'co-khi-may-moc-ks', termCode: '333', keywords: ['Cơ khí', 'Chế tạo máy'] },
        { name: { vi: 'Công nghệ ô tô', ja: '自動車技術', en: 'Automotive Technology' }, slug: 'cong-nghe-o-to-ks', termCode: '336', keywords: ['Ô tô', 'Sản xuất ô tô', 'Bảo dưỡng ô tô'] },
        { name: { vi: 'Vận chuyển hàng hóa', ja: '運輸・物流', en: 'Logistics & Shipping' }, slug: 'van-chuyen-hang-hoa-ks', termCode: '48-49', keywords: ['Vận tải', 'Logistics', 'Kho bãi'] },
        { name: { vi: 'Xây dựng', ja: '建設', en: 'Construction' }, slug: 'xay-dung-ks', termCode: '23', keywords: ['Xây dựng', 'Kiến trúc', 'Giám sát công trình'] },
        { name: { vi: 'Khách sạn, lưu trú', ja: 'ホテル・宿泊', en: 'Hospitality & Lodging' }, slug: 'khach-san-luu-tru-ks', termCode: '721', keywords: ['Khách sạn', 'Lễ tân', 'Quản lý buồng phòng'] },
        { name: { vi: 'Y tế, điều dưỡng', ja: '医療・介護', en: 'Medical & Nursing Care' }, slug: 'y-te-dieu-duong-ks', termCode: '62', keywords: ['Điều dưỡng', 'Hộ lý', 'Y tế'] },
        { name: { vi: 'Kinh doanh, kinh tế', ja: 'ビジネス・経済', en: 'Business & Economics' }, slug: 'kinh-doanh-kinh-te-ks', termCode: '52', keywords: ['Kinh doanh', 'Kinh tế', 'Quản trị'] },
        { name: { vi: 'Tài chính, kế toán, bảo hiểm', ja: '金融・会計・保険', en: 'Finance, Accounting, Insurance' }, slug: 'tai-chinh-ke-toan-bao-hiem-ks', termCode: '52', keywords: ['Tài chính', 'Kế toán', 'Bảo hiểm'] },
        { name: { vi: 'Báo chí, truyền thông, marketing', ja: 'ジャーナリズム・メディア・マーケティング', en: 'Journalism, Media, Marketing' }, slug: 'bao-chi-truyen-thong-marketing-ks', termCode: '5418', keywords: ['Báo chí', 'Truyền thông', 'Marketing'] },
        { name: { vi: 'Công nghệ thông tin', ja: '情報技術 (IT)', en: 'Information Technology (IT)' }, slug: 'it-ks', termCode: '5415', keywords: ['Lập trình', 'Phát triển phần mềm', 'Quản trị mạng'] },
        { name: { vi: 'Nghiên cứu, phân tích', ja: '研究・分析', en: 'Research & Analysis' }, slug: 'nghien-cuu-phan-tich-ks', termCode: '5417', keywords: ['Nghiên cứu', 'Phân tích dữ liệu'] },
        { name: { vi: 'Giáo dục, đào tạo', ja: '教育・研修', en: 'Education & Training' }, slug: 'giao-duc-dao-tao-ks', termCode: '61', keywords: ['Giáo dục', 'Đào tạo', 'Giảng dạy'] },
        { name: { vi: 'Hành chính, văn phòng', ja: '管理・事務', en: 'Administration & Office Work' }, slug: 'hanh-chinh-van-phong-ks', termCode: '5611', keywords: ['Hành chính', 'Thư ký', 'Văn phòng'] },
        { name: { vi: 'Pháp lý', ja: '法務', en: 'Legal' }, slug: 'phap-ly-ks', termCode: '5411', keywords: ['Luật', 'Pháp lý'] },
        { name: { vi: 'Nghệ thuật, nghệ sĩ', ja: 'アート・芸術', en: 'Arts & Entertainment' }, slug: 'nghe-thuat-nghe-si-ks', termCode: '71', keywords: ['Nghệ thuật', 'Thiết kế', 'Giải trí'] },
        { name: { vi: 'Thể dục thể thao', ja: 'スポーツ', en: 'Sports & Fitness' }, slug: 'the-duc-the-thao-ks', termCode: '713940', keywords: ['Thể thao', 'Huấn luyện viên'] },
        { name: { vi: 'Nghề có kỹ năng chuyên nghiệp', ja: '専門職', en: 'Professional Skills' }, slug: 'nghe-co-ky-nang-chuyen-nghiep-ks', termCode: '54', keywords: ['Tư vấn', 'Chuyên gia'] },
        { name: { vi: 'Việc làm bán chuyên nghiệp', ja: '準専門職', en: 'Semi-professional Work' }, slug: 'viec-lam-ban-chuyen-nghiep-ks', termCode: '43', keywords: ['Trợ lý', 'Hỗ trợ kỹ thuật'] }
    ]
};

export const allIndustries: Industry[] = Array.from(new Map(Object.values(industriesByJobType).flat().map(item => [item.slug, item])).values());

export const industryGroups = {
  'Công xưởng': ['Chế biến thực phẩm', 'Cơ khí', 'Điện tử', 'Dệt may', 'May mặc', 'Cơ khí, kim loại', 'Cơ khí, chế tạo máy', 'Điện, điện tử'],
  'Ngoài trời': ['Xây dựng', 'Nông nghiệp', 'Ngư nghiệp'],
  'Dịch vụ & Chăm sóc con người': ['Điều dưỡng', 'Nhà hàng', 'Vận tải', 'Lưu trú, khách sạn', 'Vệ sinh toà nhà', 'Hàng không'],
};
