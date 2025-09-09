
export type BarrettValue = {
  id: number;
  name: string;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7;
};

export const barrettLevels: { [key: number]: { name: string; description: string; workplaceFit: string, twColor: string } } = {
  1: {
    name: 'Cấp độ 1: Sống còn (Survival)',
    description: 'Tập trung vào sự an toàn, an ninh và sức khỏe. Các giá trị này đảm bảo sự ổn định về thể chất và tài chính.',
    workplaceFit: 'Bạn phù hợp với môi trường làm việc có quy định rõ ràng, phúc lợi tốt và đảm bảo an toàn lao động.',
    twColor: 'bg-red-500 border-red-500'
  },
  2: {
    name: 'Cấp độ 2: Mối quan hệ (Relationship)',
    description: 'Tập trung vào cảm giác thân thuộc, sự hòa hợp và giao tiếp. Các giá trị này xây dựng các mối quan hệ tích cực.',
    workplaceFit: 'Bạn phù hợp với môi trường làm việc có tinh thần đồng đội cao, giao tiếp cởi mở và sự tôn trọng lẫn nhau.',
    twColor: 'bg-orange-500 border-orange-500'
  },
  3: {
    name: 'Cấp độ 3: Lòng tự trọng (Self-Esteem)',
    description: 'Tập trung vào sự tự hào, được công nhận và hiệu suất. Các giá trị này thúc đẩy sự xuất sắc và thành tựu cá nhân.',
    workplaceFit: 'Bạn phù hợp với môi trường làm việc có cơ hội thể hiện năng lực, được công nhận thành tích và có lộ trình thăng tiến rõ ràng.',
    twColor: 'bg-yellow-500 border-yellow-500'
  },
  4: {
    name: 'Cấp độ 4: Chuyển hóa (Transformation)',
    description: 'Tập trung vào sự độc lập, khả năng thích ứng và phát triển cá nhân. Đây là giai đoạn chuyển đổi từ lợi ích cá nhân sang lợi ích chung.',
    workplaceFit: 'Bạn phù hợp với môi trường làm việc linh hoạt, khuyến khích học hỏi, đổi mới và trao quyền tự chủ.',
    twColor: 'bg-green-500 border-green-500'
  },
  5: {
    name: 'Cấp độ 5: Gắn kết nội bộ (Internal Cohesion)',
    description: 'Tập trung vào việc xây dựng một cộng đồng vững mạnh dựa trên các giá trị và tầm nhìn chung. Các giá trị này tạo ra sự tin tưởng và minh bạch.',
    workplaceFit: 'Bạn phù hợp với môi trường làm việc có văn hóa doanh nghiệp mạnh mẽ, nơi mọi người cùng chia sẻ một mục đích chung.',
    twColor: 'bg-blue-500 border-blue-500'
  },
  6: {
    name: 'Cấp độ 6: Tạo nên sự khác biệt (Making a Difference)',
    description: 'Tập trung vào việc hợp tác và tạo ra tác động tích cực. Các giá trị này mở rộng sự kết nối ra bên ngoài tổ chức.',
    workplaceFit: 'Bạn phù hợp với các công ty có các mối quan hệ đối tác chiến lược và cam kết tạo ra sự thay đổi tích cực cho cộng đồng.',
    twColor: 'bg-indigo-500 border-indigo-500'
  },
  7: {
    name: 'Cấp độ 7: Phụng sự (Service)',
    description: 'Tập trung vào sự cống hiến cho xã hội và thế hệ tương lai. Các giá trị này thể hiện trách nhiệm xã hội và sự khiêm tốn.',
    workplaceFit: 'Bạn phù hợp với các tổ chức phi lợi nhuận hoặc các doanh nghiệp có sứ mệnh phụng sự xã hội và phát triển bền vững.',
    twColor: 'bg-purple-500 border-purple-500'
  },
};

export const barrettValues: BarrettValue[] = [
  // Level 1: Survival
  { id: 1, name: 'An toàn tài chính', level: 1 },
  { id: 2, name: 'Sức khỏe', level: 1 },
  { id: 3, name: 'An toàn', level: 1 },
  { id: 4, name: 'Tự chủ', level: 1 },
  { id: 5, name: 'Kiểm soát', level: 1 },

  // Level 2: Relationship
  { id: 6, name: 'Hòa hợp', level: 2 },
  { id: 7, name: 'Tôn trọng', level: 2 },
  { id: 8, name: 'Tình bạn', level: 2 },
  { id: 9, name: 'Sự công bằng', level: 2 },
  { id: 10, name: 'Giao tiếp cởi mở', level: 2 },

  // Level 3: Self-Esteem
  { id: 11, name: 'Thành tựu', level: 3 },
  { id: 12, name: 'Hiệu quả', level: 3 },
  { id: 13, name: 'Sự xuất sắc', level: 3 },
  { id: 14, name: 'Sự công nhận', level: 3 },
  { id: 15, name: 'Chuyên nghiệp', level: 3 },

  // Level 4: Transformation
  { id: 16, name: 'Học hỏi', level: 4 },
  { id: 17, name: 'Khả năng thích ứng', level: 4 },
  { id: 18, name: 'Can đảm', level: 4 },
  { id: 19, name: 'Trách nhiệm cá nhân', level: 4 },
  { id: 20, name: 'Sự độc lập', level: 4 },

  // Level 5: Internal Cohesion
  { id: 21, name: 'Niềm tin', level: 5 },
  { id: 22, name: 'Sự chính trực', level: 5 },
  { id: 23, name: 'Đam mê', level: 5 },
  { id: 24, name: 'Sáng tạo', level: 5 },
  { id: 25, name: 'Sự minh bạch', level: 5 },

  // Level 6: Making a Difference
  { id: 26, name: 'Hợp tác', level: 6 },
  { id: 27, name: 'Hướng đến khách hàng', level: 6 },
  { id: 28, name: 'Phát triển bền vững', level: 6 },
  { id: 29, name: 'Sự kết nối', level: 6 },
  { id: 30, name: 'Hướng dẫn/Cố vấn', level: 6 },

  // Level 7: Service
  { id: 31, name: 'Cống hiến', level: 7 },
  { id: 32, name: 'Lòng trắc ẩn', level: 7 },
  { id: 33, name: 'Khiêm tốn', level: 7 },
  { id: 34, name: 'Tầm nhìn dài hạn', level: 7 },
  { id: 35, name: 'Đạo đức', level: 7 },
];
