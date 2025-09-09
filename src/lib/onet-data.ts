
export type HollandCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type OnetJob = {
  code: string;
  title: string;
  description: string;
  tasks: string[];
  outlook_jp: string; // Triển vọng nghề nghiệp tại Nhật
};

export const HollandOnetMapping: { [key in HollandCode]: { name: string, onet_codes: string[] } } = {
  R: {
    name: 'Kỹ thuật (Realistic)',
    onet_codes: ["49-9071.00", "51-4041.00", "51-2092.00", "47-2061.00", "51-6051.00"]
  },
  I: {
    name: 'Nghiên cứu (Investigative)',
    onet_codes: ["15-1252.00", "29-1141.00", "19-1021.00", "15-1211.00", "19-4099.01"]
  },
  A: {
    name: 'Nghệ thuật (Artistic)',
    onet_codes: ["27-1024.00", "27-1014.00", "27-3043.05", "27-4021.00", "27-2012.00"]
  },
  S: {
    name: 'Xã hội (Social)',
    onet_codes: ["29-1127.00", "25-2021.00", "39-9032.00", "21-1021.00", "29-1141.00"]
  },
  E: {
    name: 'Quản lý (Enterprising)',
    onet_codes: ["41-3091.00", "13-1161.00", "11-2021.00", "41-1011.00", "11-9199.02"]
  },
  C: {
    name: 'Nghiệp vụ (Conventional)',
    onet_codes: ["43-3031.00", "43-4051.00", "43-9061.00", "43-1011.00", "13-2011.00"]
  },
};

export const onetData: OnetJob[] = [
  // Realistic (R)
  {
    code: "49-9071.00",
    title: "Thợ bảo trì và sửa chữa máy móc công nghiệp",
    description: "Sửa chữa, lắp đặt, điều chỉnh và bảo trì máy móc sản xuất công nghiệp và thiết bị nhà máy.",
    tasks: [
      "Kiểm tra và sửa chữa các lỗi trên máy móc.",
      "Thực hiện bảo trì định kỳ để đảm bảo máy hoạt động trơn tru.",
      "Lắp đặt thiết bị máy móc mới."
    ],
    outlook_jp: "Nhu cầu rất cao tại các nhà máy sản xuất của Nhật Bản, đặc biệt là các công ty vừa và nhỏ. Mức lương ổn định và nhiều cơ hội làm thêm giờ."
  },
  {
    code: "51-4041.00",
    title: "Thợ hàn, cắt, và lắp ráp",
    description: "Sử dụng thiết bị hàn, cắt để hàn hoặc nối các bộ phận kim loại hoặc để lấp đầy các lỗ, vết lõm hoặc các đường nối của các sản phẩm kim loại.",
    tasks: [
      "Vận hành máy hàn tay hoặc hàn tự động.",
      "Nối các thành phần kim loại cho các công trình xây dựng hoặc sản xuất.",
      "Kiểm tra và đảm bảo chất lượng các mối hàn."
    ],
    outlook_jp: "Luôn là ngành thiếu hụt lao động tay nghề cao tại Nhật, đặc biệt trong ngành xây dựng và đóng tàu. Thu nhập rất tốt cho người có tay nghề."
  },
  {
    code: "51-2092.00",
    title: "Vận hành máy CNC",
    description: "Vận hành máy công cụ điều khiển bằng máy tính (CNC) để cắt, tạo hình và gia công vật liệu (kim loại, nhựa, v.v.).",
    tasks: [
      "Đọc bản vẽ kỹ thuật và lập trình cho máy CNC.",
      "Gá đặt phôi và vận hành máy.",
      "Kiểm tra kích thước sản phẩm sau khi gia công."
    ],
    outlook_jp: "Cần thiết cho hầu hết các ngành sản xuất tại Nhật. Yêu cầu sự chính xác và khả năng đọc bản vẽ, nhưng mang lại thu nhập ổn định và môi trường làm việc sạch sẽ."
  },
   {
    code: "47-2061.00",
    title: "Thợ xây dựng",
    description: "Thực hiện các công việc tại công trường xây dựng, bao gồm giàn giáo, cốt thép, bê tông, hoàn thiện nội thất.",
    tasks: [
      "Lắp đặt giàn giáo.",
      "Buộc và lắp đặt cốt thép.",
      "Hoàn thiện các công việc xây, trát, ốp lát."
    ],
    outlook_jp: "Nhu cầu cực kỳ lớn do dân số già và các dự án xây dựng cho Olympic và các sự kiện quốc tế. Công việc vất vả nhưng thu nhập cao."
  },
  {
    code: "51-6051.00",
    title: "Thợ may công nghiệp",
    description: "Vận hành máy may công nghiệp để may hoặc ghép các sản phẩm dệt may như quần áo, vải bọc.",
    tasks: [
      "Vận hành máy may, máy vắt sổ.",
      "May theo các dây chuyền sản xuất.",
      "Kiểm tra chất lượng đường may."
    ],
    outlook_jp: "Nhiều nhà máy dệt may ở Nhật có nhu cầu tuyển dụng. Công việc đòi hỏi sự khéo léo và chăm chỉ, phù hợp với lao động nữ."
  },

  // Investigative (I)
  {
    code: "15-1252.00",
    title: "Lập trình viên phần mềm (Software Developer)",
    description: "Nghiên cứu, thiết kế, phát triển và kiểm thử các phần mềm cấp hệ thống và ứng dụng.",
    tasks: [
      "Viết code bằng các ngôn ngữ lập trình như Java, Python, C++.",
      "Phân tích nhu cầu người dùng để thiết kế phần mềm.",
      "Kiểm thử và sửa lỗi chương trình."
    ],
    outlook_jp: "Nhu cầu rất lớn trong bối cảnh chuyển đổi số mạnh mẽ tại Nhật. Các công ty IT lớn và các startup luôn săn đón kỹ sư có năng lực."
  },
  {
    code: "29-1141.00",
    title: "Y tá/Điều dưỡng viên đã đăng ký",
    description: "Đánh giá tình trạng sức khỏe bệnh nhân, thực hiện và ghi lại các thủ tục y tế và xét nghiệm, và giáo dục bệnh nhân và gia đình về các chủ đề sức khỏe.",
    tasks: [
      "Chăm sóc bệnh nhân tại bệnh viện hoặc viện dưỡng lão.",
      "Thực hiện các y lệnh của bác sĩ.",
      "Theo dõi và báo cáo tình trạng của bệnh nhân."
    ],
    outlook_jp: "Ngành thiếu hụt nhân lực trầm trọng nhất tại Nhật do dân số già. Visa đặc định ngành điều dưỡng có nhiều chính sách ưu đãi và cơ hội ở lại lâu dài."
  },
   {
    code: "19-1021.00",
    title: "Nhà hóa học/Nhà khoa học vật liệu",
    description: "Tiến hành các phân tích hoặc thí nghiệm hóa học định tính và định lượng trong các phòng thí nghiệm để kiểm soát chất lượng hoặc phát triển sản phẩm mới.",
    tasks: [
      "Thực hiện các thí nghiệm trong phòng lab.",
      "Phân tích các hợp chất hóa học.",
      "Nghiên cứu và phát triển vật liệu mới."
    ],
    outlook_jp: "Nhiều cơ hội trong các công ty sản xuất vật liệu, hóa chất, dược phẩm lớn của Nhật. Yêu cầu trình độ chuyên môn cao."
  },
   {
    code: "15-1211.00",
    title: "Nhà phân tích hệ thống máy tính",
    description: "Phân tích các vấn đề xử lý dữ liệu khoa học, kỹ thuật và kinh doanh để triển khai và cải thiện hệ thống máy tính.",
    tasks: [
      "Phân tích yêu cầu hệ thống của khách hàng.",
      "Thiết kế giải pháp công nghệ.",
      "Tư vấn cho các nhà quản lý về hệ thống IT."
    ],
    outlook_jp: "Nhu cầu cao ở các công ty tư vấn IT và các doanh nghiệp lớn đang trong quá trình chuyển đổi số."
  },
   {
    code: "19-4099.01",
    title: "Kỹ thuật viên phòng thí nghiệm lâm sàng",
    description: "Thực hiện các xét nghiệm phức tạp trên mô, máu và các chất dịch cơ thể khác.",
    tasks: [
      "Vận hành thiết bị xét nghiệm.",
      "Phân tích mẫu bệnh phẩm.",
      "Ghi lại kết quả xét nghiệm cho bác sĩ."
    ],
    outlook_jp: "Quan trọng trong hệ thống y tế Nhật Bản, cần nhân lực có chuyên môn và sự cẩn thận."
  },

  // Artistic (A)
  {
    code: "27-1024.00",
    title: "Nhà thiết kế đồ họa",
    description: "Thiết kế hoặc tạo đồ họa để đáp ứng nhu cầu thương mại hoặc quảng cáo của khách hàng.",
    tasks: [
      "Thiết kế logo, bao bì sản phẩm, tài liệu marketing.",
      "Sử dụng các phần mềm như Adobe Photoshop, Illustrator.",
      "Làm việc với khách hàng để hiểu yêu cầu thiết kế."
    ],
    outlook_jp: "Ngành công nghiệp quảng cáo và truyền thông tại Nhật rất phát triển. Yêu cầu cao về tính sáng tạo, thẩm mỹ và khả năng làm việc với khách hàng Nhật."
  },
   {
    code: "27-1014.00",
    title: "Nhà thiết kế đa phương tiện/Hoạt hình",
    description: "Tạo hiệu ứng đặc biệt, hoạt hình hoặc các hình ảnh trực quan khác bằng phim, video, máy tính hoặc các phương tiện điện tử khác để sử dụng trong các sản phẩm hoặc sáng tạo.",
    tasks: [
      "Thiết kế nhân vật và bối cảnh cho game, phim hoạt hình.",
      "Sử dụng phần mềm 3D như Maya, Blender.",
      "Tạo các video quảng cáo, motion graphics."
    ],
    outlook_jp: "Nhật Bản là kinh đô của manga và anime, luôn cần nhân lực cho ngành công nghiệp game và phim hoạt hình. Môi trường làm việc cạnh tranh nhưng đầy sáng tạo."
  },
  {
    code: "27-3043.05",
    title: "Người viết nội dung (Content Writer/Blogger)",
    description: "Tạo nội dung hấp dẫn cho các trang web, blog, bài đăng trên mạng xã hội và các tài liệu marketing.",
    tasks: [
        "Viết bài cho website, blog công ty.",
        "Sáng tạo nội dung cho các chiến dịch quảng cáo.",
        "Nghiên cứu từ khóa và tối ưu hóa SEO cho bài viết."
    ],
    outlook_jp: "Các công ty Nhật ngày càng chú trọng đến marketing nội dung. Người nước ngoài có khả năng viết tốt bằng tiếng Nhật (hoặc tiếng Anh cho thị trường quốc tế) có nhiều cơ hội."
  },
  {
    code: "27-4021.00",
    title: "Nhiếp ảnh gia",
    description: "Chụp ảnh người, địa điểm, sự kiện và đồ vật.",
    tasks: [
        "Chụp ảnh sản phẩm cho các trang thương mại điện tử.",
        "Chụp ảnh sự kiện, đám cưới.",
        "Chỉnh sửa và xử lý hậu kỳ cho ảnh."
    ],
    outlook_jp: "Cơ hội làm việc tự do (freelance) hoặc trong các studio, công ty quảng cáo. Đòi hỏi kỹ năng kỹ thuật và con mắt nghệ thuật."
  },
  {
    code: "27-2012.00",
    title: "Diễn viên, ca sĩ, vũ công",
    description: "Biểu diễn trên sân khấu, trong phim, truyền hình, hoặc các phương tiện truyền thông khác.",
    tasks: [
        "Tham gia các buổi thử vai.",
        "Luyện tập và biểu diễn.",
        "Xây dựng hình ảnh cá nhân."
    ],
    outlook_jp: "Ngành giải trí Nhật Bản rất cạnh tranh nhưng cũng có cơ hội cho người nước ngoài, đặc biệt nếu có ngoại hình và tài năng đặc biệt."
  },

  // Social (S)
  {
    code: "29-1127.00",
    title: "Chuyên gia trị liệu vật lý",
    description: "Hỗ trợ những người bị chấn thương hoặc bệnh tật cải thiện khả năng vận động và kiểm soát cơn đau.",
    tasks: [
        "Xây dựng kế hoạch trị liệu cho bệnh nhân.",
        "Hướng dẫn bệnh nhân thực hiện các bài tập.",
        "Theo dõi và đánh giá tiến trình của bệnh nhân."
    ],
    outlook_jp: "Nhu cầu cao do dân số già và sự phát triển của y học phục hồi chức năng. Yêu cầu chứng chỉ hành nghề tại Nhật."
  },
  {
    code: "25-2021.00",
    title: "Giáo viên mầm non",
    description: "Dạy và chăm sóc trẻ em dưới 5 tuổi.",
    tasks: [
        "Tổ chức các hoạt động học tập và vui chơi.",
        "Chăm sóc các nhu cầu hàng ngày của trẻ.",
        "Giao tiếp với phụ huynh về sự phát triển của trẻ."
    ],
    outlook_jp: "Nhật Bản đang thiếu giáo viên mầm non. Đây là công việc ý nghĩa, đòi hỏi tình yêu thương trẻ em và sự kiên nhẫn."
  },
  {
    code: "39-9032.00",
    title: "Trợ giảng",
    description: "Hỗ trợ giáo viên chính trong việc giảng dạy và quản lý lớp học.",
    tasks: [
        "Hỗ trợ các học sinh gặp khó khăn trong học tập.",
        "Chuẩn bị tài liệu giảng dạy.",
        "Giám sát học sinh trong các hoạt động."
    ],
    outlook_jp: "Nhiều cơ hội tại các trường quốc tế hoặc các trung tâm ngoại ngữ, đặc biệt là trợ giảng tiếng Anh."
  },
  {
    code: "21-1021.00",
    title: "Nhân viên công tác xã hội (mảng trẻ em, gia đình)",
    description: "Cung cấp các dịch vụ xã hội và hỗ trợ để cải thiện đời sống xã hội và tâm lý của trẻ em và gia đình.",
    tasks: [
        "Tư vấn cho các gia đình gặp khó khăn.",
        "Kết nối gia đình với các nguồn lực hỗ trợ.",
        "Can thiệp trong các trường hợp trẻ em bị lạm dụng hoặc bỏ mặc."
    ],
    outlook_jp: "Công việc có ý nghĩa xã hội cao, thường làm việc cho các tổ chức công của chính phủ hoặc các tổ chức phi lợi nhuận."
  },

  // Enterprising (E)
   {
    code: "41-3091.00",
    title: "Nhân viên kinh doanh/bán hàng",
    description: "Bán hàng hóa cho các doanh nghiệp, cơ quan chính phủ và các tổ chức khác.",
    tasks: [
        "Tìm kiếm và tiếp cận khách hàng tiềm năng.",
        "Giới thiệu và tư vấn sản phẩm, dịch vụ.",
        "Đàm phán và chốt hợp đồng."
    ],
    outlook_jp: "Luôn có nhu cầu cao ở mọi ngành. Yêu cầu kỹ năng giao tiếp và thuyết phục tốt bằng tiếng Nhật. Lương thưởng thường gắn liền với kết quả kinh doanh."
  },
  {
    code: "13-1161.00",
    title: "Nhà phân tích thị trường/Chuyên viên marketing",
    description: "Nghiên cứu các điều kiện thị trường để xác định tiềm năng bán sản phẩm và dịch vụ.",
    tasks: [
        "Phân tích dữ liệu thị trường và đối thủ cạnh tranh.",
        "Lập kế hoạch và thực hiện các chiến dịch marketing.",
        "Theo dõi và đo lường hiệu quả của các hoạt động marketing."
    ],
    outlook_jp: "Nhiều cơ hội trong các công ty lớn và các agency quảng cáo. Yêu cầu tư duy phân tích và sáng tạo."
  },
  {
    code: "11-2021.00",
    title: "Giám đốc Marketing/Bán hàng",
    description: "Lập kế hoạch, chỉ đạo hoặc điều phối các chính sách và chương trình marketing và bán hàng.",
    tasks: [
        "Xây dựng chiến lược marketing và bán hàng.",
        "Quản lý và đào tạo đội ngũ nhân viên.",
        "Chịu trách nhiệm về doanh số và ngân sách."
    ],
    outlook_jp: "Vị trí quản lý cấp cao, yêu cầu kinh nghiệm dày dặn và thành tích đã được chứng minh. Thu nhập rất cao."
  },
  {
    code: "41-1011.00",
    title: "Giám sát bán hàng tuyến đầu",
    description: "Giám sát và điều phối trực tiếp các hoạt động của nhân viên bán hàng.",
    tasks: [
        "Quản lý đội ngũ bán hàng tại cửa hàng hoặc khu vực.",
        "Đặt mục tiêu và theo dõi hiệu suất của nhân viên.",
        "Đào tạo và tạo động lực cho nhân viên."
    ],
    outlook_jp: "Phổ biến trong ngành bán lẻ, thực phẩm và dịch vụ. Là bước đệm quan trọng để tiến lên các vị trí quản lý cao hơn."
  },
   {
    code: "11-9199.02",
    title: "Giám đốc/Quản lý nhà hàng",
    description: "Lập kế hoạch, chỉ đạo, hoặc điều phối các hoạt động của một cơ sở kinh doanh thực phẩm và đồ uống.",
    tasks: [
        "Quản lý nhân viên, lịch làm việc.",
        "Kiểm soát chi phí và đảm bảo lợi nhuận.",
        "Đảm bảo chất lượng dịch vụ và sự hài lòng của khách hàng."
    ],
    outlook_jp: "Ngành dịch vụ nhà hàng tại Nhật rất phát triển. Yêu cầu kinh nghiệm quản lý và kỹ năng giao tiếp tiếng Nhật xuất sắc."
  },

  // Conventional (C)
  {
    code: "43-3031.00",
    title: "Nhân viên kế toán",
    description: "Tính toán, phân loại và ghi lại dữ liệu số để hoàn thành hồ sơ tài chính.",
    tasks: [
      "Xử lý hóa đơn, chứng từ.",
      "Thực hiện các bút toán kế toán, báo cáo thuế.",
      "Đối chiếu sổ sách và tài khoản ngân hàng."
    ],
    outlook_jp: "Mọi công ty đều cần kế toán. Đây là công việc ổn định, yêu cầu sự cẩn thận và kiến thức về luật kế toán Nhật Bản (Boki)."
  },
  {
    code: "43-4051.00",
    title: "Nhân viên chăm sóc khách hàng",
    description: "Tương tác với khách hàng để xử lý các yêu cầu, cung cấp thông tin về sản phẩm và dịch vụ, và giải quyết các khiếu nại.",
    tasks: [
      "Trả lời các cuộc gọi và email từ khách hàng.",
      "Giải đáp thắc mắc và xử lý các vấn đề.",
      "Ghi lại thông tin tương tác với khách hàng."
    ],
    outlook_jp: "Nhu cầu cao ở nhiều ngành như viễn thông, thương mại điện tử, tài chính. Đòi hỏi kỹ năng giao tiếp tiếng Nhật chuẩn và sự kiên nhẫn."
  },
  {
    code: "43-9061.00",
    title: "Nhân viên văn phòng/Hành chính tổng hợp",
    description: "Thực hiện các nhiệm vụ văn thư và hành chính theo các thủ tục đã được thiết lập.",
    tasks: [
      "Soạn thảo văn bản, quản lý hồ sơ, giấy tờ.",
      "Sắp xếp lịch họp, chuyến công tác.",
      "Hỗ trợ các công việc chung của văn phòng."
    ],
    outlook_jp: "Vị trí phổ biến trong các công ty Nhật. Là cơ hội tốt để làm quen với môi trường công sở và văn hóa làm việc của Nhật."
  },
  {
    code: "43-1011.00",
    title: "Giám sát viên/Trưởng nhóm hành chính",
    description: "Giám sát và điều phối trực tiếp các hoạt động của nhân viên văn phòng hoặc hành chính.",
    tasks: [
        "Phân công và giám sát công việc của nhân viên.",
        "Đảm bảo các quy trình hành chính được tuân thủ.",
        "Báo cáo cho cấp quản lý cao hơn."
    ],
    outlook_jp: "Là bước phát triển sự nghiệp từ vị trí nhân viên hành chính, yêu cầu kinh nghiệm và kỹ năng quản lý."
  },
  {
    code: "13-2011.00",
    title: "Chuyên viên phân tích tài chính",
    description: "Thực hiện phân tích tài chính cho các quyết định kinh doanh, đầu tư.",
    tasks: [
        "Phân tích báo cáo tài chính.",
        "Xây dựng các mô hình tài chính.",
        "Đưa ra các khuyến nghị về đầu tư hoặc cải thiện hiệu quả kinh doanh."
    ],
    outlook_jp: "Nhiều cơ hội trong các ngân hàng, công ty chứng khoán, bảo hiểm. Yêu cầu chuyên môn cao về tài chính và khả năng phân tích sắc bén."
  },
];
