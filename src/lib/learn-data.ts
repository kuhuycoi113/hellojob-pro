
export type CourseLesson = {
  title: string;
  duration: string;
  videoId: string;
};

export type Course = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  'data-ai-hint': string;
  instructor: {
    name: string;
    avatar: string;
    'data-ai-hint': string;
    title: string;
  };
  stats: {
    students: number;
    rating: number;
    lessons: number;
    level: string;
    likes: number;
    comments: number;
  };
  curriculum: CourseLesson[];
};

export const courses: Course[] = [
  {
    id: 'tieng-nhat-giao-tiep',
    title: 'Tiếng Nhật giao tiếp cho người đi làm (Minna no Nihongo)',
    category: 'Ngoại ngữ',
    description: 'Khóa học được thiết kế đặc biệt cho người lao động, bám sát giáo trình Minna no Nihongo uy tín, tập trung vào các mẫu câu giao tiếp và từ vựng chuyên ngành thường dùng trong môi trường nhà máy Nhật Bản.',
    image: '/img/tieng_nhat_giao_tiep.jpg',
    'data-ai-hint': 'Japanese language class',
    instructor: {
      name: 'Dung Mochi',
      avatar: 'https://placehold.co/100x100.png',
      'data-ai-hint': 'Japanese teacher',
      title: 'Giáo viên tiếng Nhật',
    },
    stats: {
      students: 1258,
      rating: 4.8,
      lessons: 25,
      level: 'N5',
      likes: 512,
      comments: 78,
    },
    curriculum: [
      { title: 'Bài 1: Giới thiệu bản thân', duration: '15:20', videoId: 'e-kFz1d4kE8' },
      { title: 'Bài 2: Cái này, cái đó, cái kia', duration: '18:45', videoId: 'zUo2N2pG0qI' },
      { title: 'Bài 3: Địa điểm, nơi chốn', duration: '20:10', videoId: '5p2sVqGgE_I' },
      { title: 'Bài 4: Động từ và thời gian', duration: '22:55', videoId: 'zFzOqkUG4Ow' },
      { title: 'Bài 5: Di chuyển', duration: '19:30', videoId: 'V92_uXn2o5o' },
    ]
  },
  {
    id: 'van-hoa-ung-xu-cong-ty-nhat',
    title: 'Văn hoá ứng xử trong công ty Nhật',
    category: 'Văn hóa & Xã hội',
    description: 'Nắm vững các quy tắc ứng xử nơi công sở Nhật Bản, từ cách chào hỏi, trao đổi danh thiếp đến văn hóa báo cáo "Hou-Ren-Sou".',
    image: '/img/van_hoa_ung_xu.jpg',
    'data-ai-hint': 'Japanese office workers bowing',
    instructor: {
        name: 'Tanaka Kenji',
        avatar: 'https://placehold.co/100x100.png',
        'data-ai-hint': 'Japanese manager',
        title: 'Quản lý Nhân sự',
    },
    stats: {
        students: 950,
        rating: 4.7,
        lessons: 10,
        level: 'Mọi cấp độ',
        likes: 430,
        comments: 62,
    },
    curriculum: [
      { title: 'Bài 1: Nguyên tắc nền tảng trong công ty Nhật', duration: '12:30', videoId: 'placeholder01' },
      { title: 'Bài 2: Chào hỏi và giao tiếp hằng ngày', duration: '14:05', videoId: 'placeholder02' },
      { title: 'Bài 3: Ứng xử trong giờ làm việc', duration: '10:15', videoId: 'placeholder03' },
      { title: 'Bài 4: Văn hoá báo cáo – liên lạc – thảo luận (Ho-Ren-So)', duration: '15:45', videoId: 'placeholder04' },
      { title: 'Bài 5: Ứng xử với cấp trên & đồng nghiệp', duration: '13:20', videoId: 'placeholder05' },
      { title: 'Bài 6: Ứng xử trong các cuộc họp', duration: '11:50', videoId: 'placeholder06' },
      { title: 'Bài 7: Ứng xử trong các buổi tiệc công ty (Nomikai)', duration: '12:00', videoId: 'placeholder07' },
      { title: 'Bài 8: Những lỗi người Việt thường mắc & cách khắc phục', duration: '16:10', videoId: 'placeholder08' },
      { title: 'Bài 9: Bài tập tình huống thực tế', duration: '18:00', videoId: 'placeholder09' },
      { title: 'Bài 10: Kết nối & hội nhập lâu dài', duration: '9:30', videoId: 'placeholder10' },
    ]
  },
  {
    id: 'ky-nang-thang-tien',
    title: 'Kỹ năng để Thăng tiến tại Nhật Bản',
    category: 'Phát triển sự nghiệp',
    description: 'Tìm hiểu về tư duy kaizen, kỹ năng quản lý và những yếu tố then chốt giúp bạn không chỉ hoàn thành công việc mà còn thăng tiến.',
    image: '/img/ky_nang_thang_tien.jpg',
    'data-ai-hint': 'career growth ladder',
    instructor: {
        name: 'Lê Minh Cường',
        avatar: '/img/ky_nang_thang_tien.jpg',
        'data-ai-hint': 'career coach',
        title: 'Chuyên gia Hướng nghiệp',
    },
    stats: {
        students: 720,
        rating: 4.8,
        lessons: 10,
        level: 'Nâng cao',
        likes: 388,
        comments: 55,
    },
    curriculum: [
      { title: 'Bài 1: Tư duy thăng tiến trong môi trường Nhật', duration: '15:00', videoId: 'placeholder11' },
      { title: 'Bài 2: Kỹ năng giao tiếp chuyên nghiệp', duration: '18:30', videoId: 'placeholder12' },
      { title: 'Bài 3: Ho-Ren-So nâng cao: Báo cáo & Quản lý', duration: '16:45', videoId: 'placeholder13' },
      { title: 'Bài 4: Kỹ năng làm việc nhóm & Lãnh đạo', duration: '17:20', videoId: 'placeholder14' },
      { title: 'Bài 5: Kỹ năng giải quyết vấn đề & Kaizen', duration: '20:10', videoId: 'placeholder15' },
      { title: 'Bài 6: Quản lý thời gian & Kỷ luật cá nhân', duration: '14:00', videoId: 'placeholder16' },
      { title: 'Bài 7: Xây dựng hình ảnh & uy tín cá nhân', duration: '12:50', videoId: 'placeholder17' },
      { title: 'Bài 8: Kỹ năng hội nhập & mở rộng quan hệ', duration: '13:15', videoId: 'placeholder18' },
      { title: 'Bài 9: Khả năng học tập & phát triển dài hạn', duration: '19:00', videoId: 'placeholder19' },
      { title: 'Bài 10: Những sai lầm cần tránh khi muốn thăng tiến', duration: '11:30', videoId: 'placeholder20' },
    ]
  },
];
