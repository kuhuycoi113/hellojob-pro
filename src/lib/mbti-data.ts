export type MbtiDimension = 'EI' | 'SN' | 'TF' | 'JP';

export type MbtiQuestion = {
  id: number;
  text: string;
  dimension: MbtiDimension;
  direction: 1 | -1; // 1 for the first letter (e.g., E), -1 for the second (e.g., I)
};

export const mbtiQuestions: MbtiQuestion[] = [
  // EI Dimension
  { id: 1, text: 'Bạn cảm thấy tràn đầy năng lượng hơn sau khi giao tiếp với nhiều người.', dimension: 'EI', direction: 1 },
  { id: 2, text: 'Bạn thích các hoạt động đơn độc hơn là các sự kiện xã hội.', dimension: 'EI', direction: -1 },
  { id: 3, text: 'Trong các cuộc thảo luận, bạn thường là người nói nhiều hơn là lắng nghe.', dimension: 'EI', direction: 1 },
  { id: 4, text: 'Bạn cần một khoảng thời gian yên tĩnh cho riêng mình để "sạc lại pin".', dimension: 'EI', direction: -1 },
  { id: 5, text: 'Bạn dễ dàng bắt chuyện với người lạ.', dimension: 'EI', direction: 1 },

  // SN Dimension
  { id: 6, text: 'Bạn tập trung vào thực tế và những gì đang xảy ra hơn là các khả năng trong tương lai.', dimension: 'SN', direction: 1 },
  { id: 7, text: 'Bạn bị hấp dẫn bởi những ý tưởng và khái niệm trừu tượng.', dimension: 'SN', direction: -1 },
  { id: 8, text: 'Bạn tin tưởng vào kinh nghiệm thực tế hơn là những linh cảm.', dimension: 'SN', direction: 1 },
  { id: 9, text: 'Bạn thường suy nghĩ về ý nghĩa sâu xa và các mô hình ẩn sau sự vật.', dimension: 'SN', direction: -1 },
  { id: 10, text: 'Khi giải quyết vấn đề, bạn thích làm theo các bước cụ thể, đã được kiểm chứng.', dimension: 'SN', direction: 1 },

  // TF Dimension
  { id: 11, text: 'Bạn đưa ra quyết định dựa trên logic và sự thật khách quan hơn là cảm xúc cá nhân.', dimension: 'TF', direction: 1 },
  { id: 12, text: 'Bạn luôn xem xét cảm xúc của người khác trước khi đưa ra quyết định.', dimension: 'TF', direction: -1 },
  { id: 13, text: 'Bạn coi trọng sự công bằng và nhất quán hơn là sự hòa hợp.', dimension: 'TF', direction: 1 },
  { id: 14, text: 'Bạn dễ dàng đồng cảm và đặt mình vào vị trí của người khác.', dimension: 'TF', direction: -1 },
  { id: 15, text: 'Bạn thấy việc nói ra sự thật phũ phàng quan trọng hơn là giữ gìn cảm xúc của mọi người.', dimension: 'TF', direction: 1 },

  // JP Dimension
  { id: 16, text: 'Bạn thích có kế hoạch rõ ràng và tuân thủ nó hơn là hành động tùy hứng.', dimension: 'JP', direction: 1 },
  { id: 17, text: 'Bạn thích giữ các lựa chọn của mình mở và linh hoạt với những thay đổi bất ngờ.', dimension: 'JP', direction: -1 },
  { id: 18, text: 'Bạn cảm thấy hài lòng khi hoàn thành công việc và gạch nó ra khỏi danh sách.', dimension: 'JP', direction: 1 },
  { id: 19, text: 'Bạn xem deadline như một gợi ý hơn là một điều bắt buộc phải tuân theo.', dimension: 'JP', direction: -1 },
  { id: 20, text: 'Ngôi nhà và nơi làm việc của bạn rất gọn gàng và có tổ chức.', dimension: 'JP', direction: 1 },
];

export const mbtiProfiles: { [key: string]: any } = {
  ISTJ: {
    name: 'Người Thanh tra (The Inspector)',
    description: 'Thực tế, có trách nhiệm và đáng tin cậy. Họ tôn trọng sự thật, logic và làm việc chăm chỉ để hoàn thành nhiệm vụ.',
    careers: ['Kế toán', 'Kiểm toán', 'Quản trị viên cơ sở dữ liệu', 'Kỹ sư', 'Công chức'],
  },
  ISFJ: {
    name: 'Người Bảo vệ (The Protector)',
    description: 'Tận tâm, ấm áp và có trách nhiệm. Họ rất quan tâm đến việc chăm sóc người khác và tạo ra một môi trường hài hòa.',
    careers: ['Y tá/Điều dưỡng', 'Giáo viên', 'Nhân viên công tác xã hội', 'Quản lý nhân sự'],
  },
  INFJ: {
    name: 'Người Cố vấn (The Counselor)',
    description: 'Sâu sắc, có tầm nhìn và giàu lòng trắc ẩn. Họ tìm kiếm ý nghĩa trong các mối quan hệ và luôn nỗ lực giúp đỡ người khác phát huy tiềm năng.',
    careers: ['Nhà tâm lý học', 'Nhà văn', 'Chuyên viên tư vấn', 'Nghệ sĩ'],
  },
  INTJ: {
    name: 'Nhà Kiến tạo (The Mastermind)',
    description: 'Chiến lược, logic và có óc phân tích. Họ có khả năng nhìn thấy các mô hình và xây dựng các kế hoạch dài hạn phức tạp.',
    careers: ['Nhà khoa học', 'Chiến lược gia kinh doanh', 'Lập trình viên', 'Luật sư'],
  },
  ISTP: {
    name: 'Người Thợ thủ công (The Craftsman)',
    description: 'Linh hoạt, thực tế và giỏi xử lý các vấn đề tức thời. Họ thích tìm hiểu cách mọi thứ hoạt động và sử dụng công cụ để giải quyết vấn đề.',
    careers: ['Kỹ sư cơ khí', 'Phi công', 'Lính cứu hỏa', 'Thợ sửa chữa chuyên nghiệp'],
  },
  ISFP: {
    name: 'Người Nghệ sĩ (The Artist)',
    description: 'Dịu dàng, nhạy cảm và sống cho hiện tại. Họ có con mắt thẩm mỹ và thích thể hiện bản thân qua các hình thức sáng tạo.',
    careers: ['Nhà thiết kế đồ họa', 'Nhạc sĩ', 'Đầu bếp', 'Nhà thiết kế thời trang'],
  },
  INFP: {
    name: 'Người Hòa giải (The Mediator)',
    description: 'Lý tưởng hóa, sáng tạo và được dẫn dắt bởi các giá trị cá nhân. Họ muốn tạo ra một thế giới tốt đẹp hơn.',
    careers: ['Nhà văn', 'Nhà hoạt động xã hội', 'Chuyên viên tư vấn', 'Nhà tâm lý học'],
  },
  INTP: {
    name: 'Nhà Tư duy (The Thinker)',
    description: 'Logic, sáng tạo và thích khám phá các lý thuyết phức tạp. Họ bị cuốn hút bởi các ý tưởng và luôn tìm kiếm sự hiểu biết.',
    careers: ['Nhà khoa học', 'Giáo sư đại học', 'Nhà phân tích hệ thống', 'Triết gia'],
  },
  ESTP: {
    name: 'Người Năng động (The Dynamo)',
    description: 'Hướng ngoại, thực tế và thích hành động. Họ sống trong hiện tại và nhanh chóng nắm bắt cơ hội để giải quyết vấn đề.',
    careers: ['Doanh nhân', 'Nhân viên bán hàng', 'Nhà môi giới', 'Nhân viên cứu hộ'],
  },
  ESFP: {
    name: 'Người Trình diễn (The Performer)',
    description: 'Sôi nổi, hòa đồng và yêu thích sự chú ý. Họ mang lại niềm vui và năng lượng cho mọi người xung quanh.',
    careers: ['Diễn viên', 'MC', 'Tổ chức sự kiện', 'Hướng dẫn viên du lịch'],
  },
  ENFP: {
    name: 'Người Truyền cảm hứng (The Champion)',
    description: 'Nhiệt tình, sáng tạo và có khả năng kết nối con người. Họ luôn nhìn thấy tiềm năng và truyền cảm hứng cho người khác.',
    careers: ['Chuyên viên Marketing/PR', 'Nhà báo', 'Chuyên gia nhân sự', 'Doanh nhân xã hội'],
  },
  ENTP: {
    name: 'Người Nhìn xa (The Visionary)',
    description: 'Thông minh, nhanh trí và thích tranh luận. Họ bị cuốn hút bởi những ý tưởng mới và thích khám phá các khả năng.',
    careers: ['Luật sư', 'Nhà phát minh', 'Doanh nhân', 'Chuyên gia tư vấn chiến lược'],
  },
  ESTJ: {
    name: 'Người Giám sát (The Supervisor)',
    description: 'Thực tế, có tổ chức và quyết đoán. Họ xuất sắc trong việc quản lý con người và các hệ thống để đạt được kết quả.',
    careers: ['Quản lý dự án', 'Giám đốc vận hành (COO)', 'Sĩ quan quân đội', 'Thẩm phán'],
  },
  ESFJ: {
    name: 'Người Chăm sóc (The Provider)',
    description: 'Hòa đồng, tận tâm và thích giúp đỡ người khác một cách thiết thực. Họ là trung tâm của các cộng đồng.',
    careers: ['Quản lý nhân sự', 'Giáo viên', 'Chuyên viên chăm sóc khách hàng', 'Tổ chức sự kiện'],
  },
  ENFJ: {
    name: 'Người Dẫn dắt (The Protagonist)',
    description: 'Lôi cuốn, truyền cảm hứng và có khả năng lãnh đạo bẩm sinh. Họ muốn tạo ra sự thay đổi tích cực cho cộng đồng.',
    careers: ['Chính trị gia', 'Giáo viên', 'Giám đốc bán hàng', 'Nhà ngoại giao'],
  },
  ENTJ: {
    name: 'Nhà Lãnh đạo (The Commander)',
    description: 'Quyết đoán, có tầm nhìn và là nhà lãnh đạo bẩm sinh. Họ giỏi trong việc xác định mục tiêu và huy động nguồn lực để đạt được chúng.',
    careers: ['Giám đốc điều hành (CEO)', 'Luật sư', 'Nhà tư vấn quản lý', 'Lãnh đạo quân sự'],
  },
};
