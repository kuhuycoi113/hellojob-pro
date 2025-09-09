
export type HandbookArticle = {
  slug: string;
  type: 'article' | 'video' | 'post' | 'image-story'; // Phân loại nội dung
  title: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  dataAiHint: string;
  excerpt: string;
  videoUrl?: string; // URL cho video
  content?: {
    slug: string;
    title: string;
    body: string;
  }[];
};

export const articles: HandbookArticle[] = [
  {
    slug: 'tokutei-ginou-la-gi',
    type: 'article',
    title: 'Kỹ năng đặc định (Tokutei Ginou) là gì? Toàn bộ thông tin cần biết 2024',
    category: 'Kỹ năng đặc định',
    author: 'HelloJob Team',
    readTime: '8 phút',
    image: '/img/bai_viet1.jpg',
    dataAiHint: 'tokyo city japan',
    excerpt: 'Tokutei Ginou là một loại visa lao động mới của Nhật Bản, mở ra cơ hội lớn cho người lao động Việt Nam. Hãy cùng tìm hiểu chi tiết về điều kiện, quyền lợi và các ngành nghề tuyển dụng.',
    content: [
      {
        slug: 'gioi-thieu',
        title: 'Giới thiệu về visa Kỹ năng đặc định',
        body: `
          <p>Visa Kỹ năng đặc định (特定技能 - Tokutei Ginou) là một loại tư cách lưu trú mới dành cho lao động người nước ngoài tại Nhật Bản, được chính phủ Nhật Bản triển khai từ tháng 4 năm 2019. Mục đích chính của chương trình này là để giải quyết tình trạng thiếu hụt lao động trầm trọng trong một số ngành công nghiệp cụ thể của Nhật Bản.</p>
          <p>Chương trình này được chia thành 2 loại chính:</p>
          <ul>
            <li><strong>Kỹ năng đặc định loại 1 (Tokutei Ginou 1):</strong> Dành cho lao động có trình độ kỹ năng và kiến thức chuyên môn nhất định, có thể làm việc ngay mà không cần qua đào tạo nhiều. Thời gian lưu trú tối đa là 5 năm và không được bảo lãnh gia đình.</li>
            <li><strong>Kỹ năng đặc định loại 2 (Tokutei Ginou 2):</strong> Dành cho lao động có kỹ năng tay nghề cao, chuyên nghiệp. Sau khi hoàn thành chương trình loại 1, lao động có thể thi chuyển lên loại 2 để được ở lại Nhật Bản lâu dài, có cơ hội xin vĩnh trú và bảo lãnh người thân sang sinh sống.</li>
          </ul>
        `
      },
      {
        slug: 'dieu-kien-tham-gia',
        title: 'Điều kiện tham gia chương trình',
        body: `
          <p>Để tham gia chương trình Kỹ năng đặc định, người lao động cần đáp ứng các điều kiện cơ bản sau:</p>
          <ol>
            <li><strong>Độ tuổi:</strong> Đủ 18 tuổi trở lên.</li>
            <li><strong>Kỳ thi năng lực tiếng Nhật:</strong> Đạt chứng chỉ năng lực tiếng Nhật JLPT cấp độ N4 trở lên hoặc các kỳ thi tương đương như JFT-Basic.</li>
            <li><strong>Kỳ thi kỹ năng tay nghề:</strong> Vượt qua kỳ thi đánh giá kỹ năng chuyên môn (技能測定試験) cho ngành nghề mà mình đăng ký. Kỳ thi này được tổ chức tại Nhật Bản và một số quốc gia khác, bao gồm cả Việt Nam.</li>
            <li><strong>Sức khỏe:</strong> Đảm bảo đủ điều kiện sức khỏe để làm việc tại Nhật Bản, không mắc các bệnh truyền nhiễm theo quy định.</li>
          </ol>
          <p>Đối với các bạn Thực tập sinh kỹ năng đã hoàn thành chương trình 3 năm hoặc 5 năm, có thể được miễn một số kỳ thi khi chuyển đổi sang visa Tokutei Ginou nếu ngành nghề tương đồng.</p>
        `
      },
      {
        slug: 'quyen-loi',
        title: 'Quyền lợi của người lao động',
        body: `
          <p>Tham gia chương trình Kỹ năng đặc định mang lại nhiều quyền lợi hấp dẫn cho người lao động:</p>
          <ul>
            <li><strong>Mức lương:</strong> Mức lương của lao động Tokutei Ginou được quy định tương đương hoặc cao hơn so với người Nhật cùng vị trí, đảm bảo thu nhập ổn định và xứng đáng.</li>
            <li><strong>Chế độ đãi ngộ:</strong> Hưởng đầy đủ các chế độ bảo hiểm xã hội, bảo hiểm y tế, bảo hiểm thất nghiệp như người Nhật.</li>
            <li><strong>Cơ hội chuyển việc:</strong> Người lao động được phép chuyển việc trong cùng một ngành nghề nếu có lý do chính đáng và được công ty mới chấp nhận.</li>
            <li><strong>Phát triển dài hạn:</strong> Có cơ hội phát triển sự nghiệp lâu dài tại Nhật, đặc biệt khi chuyển lên được visa loại 2.</li>
          </ul>
        `
      },
    ],
  },
  {
    slug: 'meo-phong-van-video',
    type: 'video',
    title: '3 Mẹo phỏng vấn ONLINE qua video với nhà tuyển dụng Nhật',
    category: 'Kinh nghiệm phỏng vấn',
    author: 'Dung Mochi',
    readTime: '1 phút',
    image: 'https://placehold.co/400x600.png',
    dataAiHint: 'online job interview',
    excerpt: 'Tác phong, ánh sáng và cách trả lời là 3 yếu tố quyết định sự thành công của buổi phỏng vấn online. Xem ngay video để không bỏ lỡ cơ hội!',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
   {
    slug: 'kinh-nghiem-phong-van-tokutei',
    type: 'article',
    title: '5 Kinh nghiệm phỏng vấn Tokutei Ginou chắc chắn đậu',
    category: 'Kinh nghiệm phỏng vấn',
    author: 'HelloJob Team',
    readTime: '7 phút',
    image: '/img/bai_viet2.jpg',
    dataAiHint: 'job interview japan',
    excerpt: 'Buổi phỏng vấn là bước quyết định để bạn có được công việc mơ ước tại Nhật. Hãy chuẩn bị thật kỹ với 5 kinh nghiệm quý báu được đúc kết từ các chuyên gia.',
    content: [
      {
        slug: 'chuan-bi-ky-luong',
        title: 'Chuẩn bị kỹ lưỡng trước phỏng vấn',
        body: '<p>Tìm hiểu kỹ về công ty, ngành nghề ứng tuyển. Chuẩn bị câu trả lời cho các câu hỏi thường gặp và luyện tập giới thiệu bản thân (Jikoshoukai) thật trôi chảy.</p>'
      },
      {
        slug: 'tac-phong-chuyen-nghiep',
        title: 'Tác phong chuyên nghiệp',
        body: '<p>Trang phục lịch sự, thái độ khiêm tốn, lễ phép và luôn đúng giờ là những yếu tố cực kỳ quan trọng trong văn hóa Nhật Bản.</p>'
      }
    ]
  },
  {
    slug: 'chi-phi-sinh-hoat-o-nhat',
    type: 'article',
    title: 'Chi phí sinh hoạt ở Nhật Bản hết bao nhiêu một tháng?',
    category: 'Cuộc sống ở Nhật',
    author: 'Mai Linh',
    readTime: '6 phút',
    image: '/img/bai_viet3.jpg',
    dataAiHint: 'japanese food market',
    excerpt: 'Lập kế hoạch tài chính là bước quan trọng trước khi đến Nhật. Bài viết này sẽ phân tích chi tiết các khoản chi phí sinh hoạt hàng tháng bạn cần chuẩn bị.',
    content: [
      {
        slug: 'cac-khoan-chi-phi-chinh',
        title: 'Các khoản chi phí chính',
        body: '<p>Chi phí sinh hoạt hàng tháng tại Nhật Bản có thể dao động tùy thuộc vào thành phố bạn sống và phong cách chi tiêu của bạn. Tuy nhiên, các khoản chính bao gồm:</p><ul><li>Tiền thuê nhà</li><li>Tiền ăn uống</li><li>Tiền đi lại</li><li>Tiền điện, nước, gas, internet</li><li>Thuế và bảo hiểm</li><li>Chi phí cá nhân khác</li></ul>'
      },
      {
        slug: 'chi-phi-trung-binh',
        title: 'Chi phí trung bình tại các thành phố lớn',
        body: '<p>Tại các thành phố lớn như Tokyo, Osaka, chi phí thuê nhà và sinh hoạt sẽ cao hơn đáng kể so với các vùng nông thôn. Một người độc thân sống ở Tokyo có thể tốn khoảng 120,000 - 150,000 yên/tháng. Trong khi đó ở các tỉnh lẻ, con số này có thể chỉ khoảng 80,000 - 100,000 yên.</p>'
      }
    ]
  },
   {
    slug: 'cach-chuyen-tien-nhat-viet',
    type: 'video',
    title: 'Hướng dẫn chuyển tiền từ Nhật về Việt Nam an toàn, phí thấp',
    category: 'Cuộc sống ở Nhật',
    author: 'HelloJob Team',
    readTime: '2 phút',
    image: 'https://placehold.co/400x600.png',
    dataAiHint: 'money transfer app',
    excerpt: 'Tổng hợp các cách chuyển tiền phổ biến và uy tín nhất dành cho người lao động tại Nhật Bản.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    slug: 'van-hoa-lam-viec-nhat-ban',
    type: 'post',
    title: 'Văn hóa làm việc tại công ty Nhật: Hou-Ren-Sou và những điều cần biết',
    category: 'Cuộc sống ở Nhật',
    author: 'Akira Lê',
    readTime: '5 phút',
    image: '/img/bai_viet4.jpg',
    dataAiHint: 'japanese office meeting',
    excerpt: 'Hiểu rõ về Hourensou (Báo cáo - Liên lạc - Thảo luận) và các quy tắc ngầm trong văn hóa công sở sẽ giúp bạn hòa nhập nhanh chóng và làm việc hiệu quả hơn tại Nhật.'
  },
  {
    slug: 'meo-viet-jikoshoukai',
    type: 'post',
    title: 'Mẹo viết và trình bày Jikoshoukai (tự giới thiệu bản thân) ấn tượng',
    category: 'Kinh nghiệm phỏng vấn',
    author: 'Dung Mochi',
    readTime: '6 phút',
    image: '/img/bai_viet5.jpg',
    dataAiHint: 'person writing resume',
    excerpt: 'Jikoshoukai là phần không thể thiếu trong bất kỳ buổi phỏng vấn nào tại Nhật. Cùng học cách xây dựng một bài giới thiệu bản thân ngắn gọn, súc tích và ghi điểm với nhà tuyển dụng.'
  },
  {
    slug: 'luu-y-khi-tim-viec-tokutei',
    type: 'post',
    title: '5 Lưu ý vàng khi tự tìm việc Tokutei Ginou tại Nhật',
    category: 'Kinh nghiệm phỏng vấn',
    author: 'HelloJob Team',
    readTime: '4 phút',
    image: '/img/bai_viet1.jpg',
    dataAiHint: 'person searching job online',
    excerpt: 'Tránh những sai lầm phổ biến và tăng cơ hội thành công của bạn với những lời khuyên hữu ích này khi tự mình tìm kiếm cơ hội việc làm Kỹ năng đặc định.'
  },
  {
    slug: 'cac-app-ho-tro-cuoc-song-nhat',
    type: 'post',
    title: 'Top 5 ứng dụng không thể thiếu cho cuộc sống ở Nhật',
    category: 'Cuộc sống ở Nhật',
    author: 'Mai Linh',
    readTime: '3 phút',
    image: '/img/bai_viet2.jpg',
    dataAiHint: 'smartphone apps japan',
    excerpt: 'Từ ứng dụng tàu điện đến từ điển và khuyến mãi, đây là những công cụ sẽ giúp cuộc sống của bạn tại Nhật Bản trở nên dễ dàng và tiết kiệm hơn rất nhiều.'
  },
  {
    slug: 'so-sanh-tts-vs-tokutei',
    type: 'article',
    title: 'So sánh Thực tập sinh và Kỹ năng đặc định: Nên chọn chương trình nào?',
    category: 'Thủ tục & Visa',
    author: 'HelloJob Team',
    readTime: '9 phút',
    image: '/img/bai_viet5.jpg',
    dataAiHint: 'crossroads sign japan',
    excerpt: 'Thực tập sinh (TTS) và Kỹ năng đặc định (Tokutei Ginou) là hai con đường phổ biến để sang Nhật làm việc. Bài viết này sẽ phân tích ưu, nhược điểm của từng loại visa để bạn có lựa chọn phù hợp nhất.',
    content: [
      {
        slug: 'muc-dich',
        title: 'Về mục đích chương trình',
        body: '<p>Chương trình TTS tập trung vào việc "đào tạo kỹ năng", chuyển giao công nghệ. Trong khi đó, Tokutei Ginou có mục đích chính là "bù đắp thiếu hụt lao động" cho Nhật Bản.</p>'
      }
    ]
  },
  {
    slug: 'xin-visa-vinh-tru',
    type: 'article',
    title: 'Điều kiện xin visa vĩnh trú tại Nhật Bản năm 2024',
    category: 'Thủ tục & Visa',
    author: 'HelloJob Team',
    readTime: '10 phút',
    image: '/img/bai_viet4.jpg',
    dataAiHint: 'permanent resident card japan',
    excerpt: 'Visa vĩnh trú là mục tiêu của nhiều người nước ngoài muốn sinh sống và làm việc lâu dài tại Nhật. Bài viết sẽ cập nhật những điều kiện mới nhất bạn cần đáp ứng.',
    content: [
      {
        slug: 'thoi-gian-luu-tru',
        title: 'Yêu cầu về thời gian lưu trú',
        body: '<p>Theo nguyên tắc, bạn cần phải sinh sống liên tục tại Nhật Bản ít nhất 10 năm. Tuy nhiên, có một số trường hợp được xét duyệt ưu tiên với thời gian ngắn hơn, ví dụ như người có đóng góp lớn cho Nhật Bản hoặc vợ/chồng của người Nhật.',
      }
    ]
  },
  {
    slug: 'khoanh-khac-hoa-anh-dao',
    type: 'image-story',
    title: 'Khoảnh khắc mùa hoa anh đào ở công viên Ueno',
    category: 'Cuộc sống ở Nhật',
    author: 'Han',
    readTime: '1 phút',
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'cherry blossoms ueno park',
    excerpt: 'Một buổi chiều dạo bước dưới những tán hoa anh đào nở rộ tại công viên Ueno, Tokyo. Một trải nghiệm không thể nào quên.',
  },
  {
    slug: 'buoi-sang-o-chua-kiyomizu',
    type: 'image-story',
    title: 'Bình minh trên chùa Kiyomizu-dera, Kyoto',
    category: 'Cuộc sống ở Nhật',
    author: 'Ken',
    readTime: '1 phút',
    image: '/img/kyoto-o.jpg',
    dataAiHint: 'kiyomizu-dera temple sunrise',
    excerpt: 'Khoảnh khắc bình yên và hùng vĩ khi những tia nắng đầu tiên chiếu rọi ngôi chùa cổ kính Kiyomizu-dera ở Kyoto.',
  }
];
