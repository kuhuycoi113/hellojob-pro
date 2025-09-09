
export type DISCGroup = 'D' | 'I' | 'S' | 'C';

export type DISCWord = {
  id: number;
  word: string;
  group: DISCGroup;
};

export type DISCQuestion = {
  id: number;
  words: DISCWord[];
};

export const discQuestions: DISCQuestion[] = [
  { id: 1, words: [
      { id: 1, word: 'Thích phiêu lưu, mạo hiểm', group: 'D' },
      { id: 2, word: 'Hoạt bát, năng nổ', group: 'I' },
      { id: 3, word: 'Dễ đoán, dễ lường', group: 'S' },
      { id: 4, word: 'Thích nghi, hòa hợp', group: 'C' },
  ]},
  { id: 2, words: [
      { id: 5, word: 'Sống động, náo nhiệt', group: 'I' },
      { id: 6, word: 'Nhút nhát, e dè', group: 'S' },
      { id: 7, word: 'Hài lòng, thỏa mãn', group: 'C' },
      { id: 8, word: 'Mạnh mẽ, quyết liệt', group: 'D' },
  ]},
  { id: 3, words: [
      { id: 9, word: 'Kiên định, không thay đổi', group: 'S' },
      { id: 10, word: 'Vui vẻ, lạc quan', group: 'I' },
      { id: 11, word: 'Hay đòi hỏi, yêu sách', group: 'D' },
      { id: 12, word: 'Nhún nhường, phục tùng', group: 'C' },
  ]},
  { id: 4, words: [
      { id: 13, word: 'Hay do dự, lưỡng lự', group: 'C' },
      { id: 14, word: 'Can đảm, dũng cảm', group: 'D' },
      { id: 15, word: 'Lôi cuốn, hấp dẫn', group: 'I' },
      { id: 16, word: 'Điềm tĩnh, bình thản', group: 'S' },
  ]},
  { id: 5, words: [
      { id: 17, word: 'Dễ thương, đáng mến', group: 'S' },
      { id: 18, word: 'Thúc đẩy, khuyến khích', group: 'I' },
      { id: 19, word: 'Quả quyết, chắc chắn', group: 'D' },
      { id: 20, word: 'Kín đáo, dè dặt', group: 'C' },
  ]},
  { id: 6, words: [
      { id: 21, word: 'Sẵn lòng, sẵn sàng', group: 'C' },
      { id: 22, word: 'Nhiệt tình, hăng hái', group: 'I' },
      { id: 23, word: 'Táo bạo, gan góc', group: 'D' },
      { id: 24, word: 'Dịu dàng, ôn hòa', group: 'S' },
  ]},
  { id: 7, words: [
      { id: 25, word: 'Trung thành, chung thủy', group: 'S' },
      { id: 26, word: 'Thuyết phục, có sức ảnh hưởng', group: 'I' },
      { id: 27, word: 'Cứng đầu, bướng bỉnh', group: 'D' },
      { id: 28, word: 'Nhẹ nhàng, từ tốn', group: 'C' },
  ]},
  { id: 8, words: [
      { id: 29, word: 'Hiếu động, thích kiểm soát', group: 'D' },
      { id: 30, word: 'Cởi mở, dễ tiếp thu', group: 'C' },
      { id: 31, word: 'Hay giúp đỡ, tốt bụng', group: 'S' },
      { id: 32, word: 'Sôi nổi, hoạt náo', group: 'I' },
  ]},
  { id: 9, words: [
      { id: 33, word: 'Tự tin, tràn đầy sức sống', group: 'I' },
      { id: 34, word: 'Đồng cảm, thấu hiểu', group: 'S' },
      { id: 35, word: 'Khoan dung, độ lượng', group: 'C' },
      { id: 36, word: 'Quyết đoán, kiên quyết', group: 'D' },
  ]},
  { id: 10, words: [
      { id: 37, word: 'Tự chủ, độc lập', group: 'D' },
      { id: 38, word: 'Tinh tế, nhạy bén', group: 'C' },
      { id: 39, word: 'Thích giao du, hòa đồng', group: 'I' },
      { id: 40, word: 'Kiên nhẫn, bền bỉ', group: 'S' },
  ]},
  { id: 11, words: [
      { id: 41, word: 'Tốt bụng, tử tế', group: 'S' },
      { id: 42, word: 'Truyền cảm hứng', group: 'I' },
      { id: 43, word: 'Thích cạnh tranh, ganh đua', group: 'D' },
      { id: 44, word: 'Chu đáo, ân cần', group: 'C' },
  ]},
  { id: 12, words: [
      { id: 45, word: 'Hay suy nghĩ, trầm tư', group: 'C' },
      { id: 46, word: 'Ngoan cường, kiên trì', group: 'D' },
      { id: 47, word: 'Lạc quan, yêu đời', group: 'I' },
      { id: 48, word: 'Thích chiều chuộng, hay nhượng bộ', group: 'S' },
  ]},
  { id: 13, words: [
      { id: 49, word: 'Thân thiện, cởi mở', group: 'I' },
      { id: 50, word: 'Chính xác, đúng đắn', group: 'C' },
      { id: 51, word: 'Thẳng thắn, bộc trực', group: 'D' },
      { id: 52, word: 'Điềm đạm, không nóng vội', group: 'S' },
  ]},
  { id: 14, words: [
      { id: 53, word: 'Dễ dãi, thoải mái', group: 'S' },
      { id: 54, word: 'Hay nói, nói nhiều', group: 'I' },
      { id: 55, word: 'Can đảm, không sợ hãi', group: 'D' },
      { id: 56, word: 'Hòa nhã, lịch thiệp', group: 'C' },
  ]},
  { id: 15, words: [
      { id: 57, word: 'Có kỷ luật, tuân thủ', group: 'C' },
      { id: 58, word: 'Hào phóng, rộng lượng', group: 'I' },
      { id: 59, word: 'Sống động, giàu năng lượng', group: 'D' },
      { id: 60, word: 'Ổn định, vững vàng', group: 'S' },
  ]},
  { id: 16, words: [
      { id: 61, word: 'Thích thuyết phục, tranh luận', group: 'D' },
      { id: 62, word: 'Dễ chịu, thoải mái', group: 'S' },
      { id: 63, word: 'Khiêm tốn, giản dị', group: 'C' },
      { id: 64, word: 'Nguyên bản, độc đáo', group: 'I' },
  ]},
  { id: 17, words: [
      { id: 65, word: 'Hay chỉ trích, phán xét', group: 'C' },
      { id: 66, word: 'Bốc đồng, hấp tấp', group: 'I' },
      { id: 67, word: 'Cứng rắn, nghiêm khắc', group: 'D' },
      { id: 68, word: 'Không quyết đoán, do dự', group: 'S' },
  ]},
  { id: 18, words: [
      { id: 69, word: 'Hay lo lắng, bất an', group: 'S' },
      { id: 70, word: 'Lạnh lùng, xa cách', group: 'C' },
      { id: 71, word: 'Dễ nổi nóng, cáu kỉnh', group: 'D' },
      { id: 72, word: 'Vô kỷ luật, bừa bãi', group: 'I' },
  ]},
  { id: 19, words: [
      { id: 73, word: 'Thờ ơ, lãnh đạm', group: 'S' },
      { id: 74, word: 'Thiếu nhiệt tình, hờ hững', group: 'C' },
      { id: 75, 'word': 'Không thân thiện, khó gần', group: 'D' },
      { id: 76, word: 'Hay quên, đãng trí', group: 'I' },
  ]},
  { id: 20, words: [
      { id: 77, word: 'Bộc trực, thẳng như ruột ngựa', group: 'D' },
      { id: 78, word: 'Dễ bị kích động, náo động', group: 'I' },
      { id: 79, word: 'Nhút nhát, rụt rè', group: 'S' },
      { id: 80, word: 'Bi quan, tiêu cực', group: 'C' },
  ]},
  { id: 21, words: [
      { id: 81, word: 'Thích tranh luận, cãi lý', group: 'D' },
      { id: 82, word: 'Bừa bộn, không ngăn nắp', group: 'I' },
      { id: 83, word: 'Hay nghi ngờ, đa nghi', group: 'C' },
      { id: 84, word: 'Thụ động, lười biếng', group: 'S' },
  ]},
  { id: 22, words: [
      { id: 85, word: 'Phụ thuộc, dựa dẫm', group: 'S' },
      { id: 86, word: 'Ngây thơ, cả tin', group: 'I' },
      { id: 87, word: 'Tiêu cực, hay phản đối', group: 'C' },
      { id: 88, word: 'Thống trị, áp đặt', group: 'D' },
  ]},
  { id: 23, words: [
      { id: 89, word: 'Vô tâm, không để ý', group: 'D' },
      { id: 90, word: 'Không an toàn, bất ổn', group: 'S' },
      { id: 91, word: 'Không được yêu thích', group: 'I' },
      { id: 92, word: 'Khó đoán, thất thường', group: 'C' },
  ]},
  { id: 24, words: [
      { id: 93, word: 'Thiếu kiên nhẫn, nóng vội', group: 'D' },
      { id: 94, word: 'Hay thay đổi, không ổn định', group: 'I' },
      { id: 95, word: 'Cầu toàn, quá kỹ tính', group: 'C' },
      { id: 96, word: 'Dễ bị tổn thương, nhạy cảm', group: 'S' },
  ]},
  { id: 25, words: [
      { id: 97, word: 'Tự phụ, kiêu ngạo', group: 'D' },
      { id: 98, word: 'Dễ nản lòng, bỏ cuộc', group: 'S' },
      { id: 99, word: 'Thích khoe khoang, khoác lác', group: 'I' },
      { id: 100, word: 'Xa cách, khó gần', group: 'C' },
  ]},
  { id: 26, words: [
      { id: 101, word: 'Hay oán giận, thù dai', group: 'C' },
      { id: 102, word: 'Nghịch ngợm, phá phách', group: 'I' },
      { id: 103, word: 'Nổi loạn, chống đối', group: 'D' },
      { id: 104, word: 'Miễn cưỡng, không sẵn lòng', group: 'S' },
  ]},
  { id: 27, words: [
      { id: 105, word: 'Độc đoán, gia trưởng', group: 'D' },
      { id: 106, word: 'Hay phàn nàn, càu nhàu', group: 'I' },
      { id: 107, word: 'Nhân nhượng, dễ dãi', group: 'S' },
      { id: 108, word: 'Thỏa hiệp, nhượng bộ', group: 'C' },
  ]},
  { id: 28, words: [
      { id: 109, word: 'Đầy tham vọng, cầu tiến', group: 'D' },
      { id: 110, word: 'Dễ chịu, hòa đồng', group: 'I' },
      { id: 111, word: 'Điềm tĩnh, ôn hòa', group: 'S' },
      { id: 112, word: 'Cẩn thận, chu đáo', group: 'C' },
  ]},
];

export const discProfile = {
  D: {
    name: "Dominance (Thống trị)",
    description: "Người thuộc nhóm D có xu hướng mạnh mẽ, tự tin, quyết đoán và tập trung vào kết quả. Họ thích thử thách, kiểm soát và giải quyết vấn đề một cách nhanh chóng. Họ là những nhà lãnh đạo bẩm sinh, luôn hướng tới mục tiêu và không ngại đối đầu.",
    strengths: ["Quyết đoán", "Tự tin", "Tập trung vào mục tiêu", "Thích cạnh tranh", "Chấp nhận rủi ro"],
    weaknesses: ["Thiếu kiên nhẫn", "Có thể độc đoán", "Ít quan tâm đến chi tiết", "Khó lắng nghe người khác"],
    careers: ["Giám đốc điều hành (CEO)", "Quản lý dự án", "Doanh nhân", "Luật sư", "Nhà môi giới chứng khoán", "Cảnh sát"],
    color: "accent-red"
  },
  I: {
    name: "Influence (Ảnh hưởng)",
    description: "Người thuộc nhóm I rất nhiệt tình, lạc quan, hòa đồng và có khả năng thuyết phục người khác. Họ thích giao tiếp, xây dựng mối quan hệ và truyền cảm hứng. Họ là trung tâm của các hoạt động xã hội và luôn mang lại năng lượng tích cực.",
    strengths: ["Nhiệt tình", "Lạc quan", "Giao tiếp tốt", "Sáng tạo", "Thích làm việc nhóm"],
    weaknesses: ["Thiếu tổ chức", "Hay nói, ít lắng nghe", "Sợ bị từ chối", "Dễ bị phân tâm"],
    careers: ["Chuyên viên Marketing/PR", "Nhân viên bán hàng", "Diễn viên/MC", "Nhà báo", "Tổ chức sự kiện", "Chuyên viên nhân sự"],
     color: "accent-yellow"
  },
  S: {
    name: "Steadiness (Kiên định)",
    description: "Người thuộc nhóm S có tính cách điềm tĩnh, kiên nhẫn, đáng tin cậy và luôn sẵn sàng hỗ trợ người khác. Họ thích môi trường ổn định, hòa bình và làm việc có kế hoạch. Họ là những người bạn, người đồng nghiệp tuyệt vời, luôn lắng nghe và giúp đỡ.",
    strengths: ["Kiên nhẫn", "Đáng tin cậy", "Biết lắng nghe", "Tận tâm", "Hòa giải tốt"],
    weaknesses: ["Ngại thay đổi", "Tránh xung đột", "Khó đưa ra quyết định nhanh", "Có thể quá nhún nhường"],
    careers: ["Chuyên viên tư vấn", "Giáo viên", "Y tá/Điều dưỡng", "Nhân viên chăm sóc khách hàng", "Thư ký", "Quản trị viên"],
    color: "accent-green"
  },
  C: {
    name: "Conscientiousness (Tuân thủ)",
    description: "Người thuộc nhóm C rất cẩn thận, chính xác, có óc phân tích và tuân thủ quy tắc. Họ thích làm việc với dữ liệu, các hệ thống và tập trung vào chất lượng. Họ đảm bảo mọi việc được thực hiện một cách đúng đắn và logic.",
    strengths: ["Cẩn thận", "Chính xác", "Có óc phân tích", "Có tổ chức", "Tuân thủ quy tắc"],
    weaknesses: ["Cầu toàn", "Hay chỉ trích (bản thân và người khác)", "Khó thích nghi với sự thay đổi", "Có thể quá chậm chạp"],
    careers: ["Kế toán/Kiểm toán", "Lập trình viên", "Nhà phân tích dữ liệu", "Nhà khoa học", "Kỹ sư chất lượng (QC)", "Kiến trúc sư"],
    color: "accent-blue"
  }
};
