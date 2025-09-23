// src/lib/visa-data.ts

const createSlug = (str: string) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-.]+/g, '');
};


export interface VisaType {
    name: string;
    slug: string;
}

export interface VisaDetail {
    name: string;
    slug: string;
}

export const japanJobTypes: VisaType[] = [
    { name: 'Thực tập sinh kỹ năng', slug: 'thuc-tap-sinh-ky-nang' },
    { name: 'Kỹ năng đặc định', slug: 'ky-nang-dac-dinh' },
    { name: 'Kỹ sư, tri thức', slug: 'ky-su-tri-thuc' }
];

export const visaDetailsByVisaType: { [key: string]: VisaDetail[] } = {
    'thuc-tap-sinh-ky-nang': [
        { name: 'Thực tập sinh 3 năm', slug: 'thuc-tap-sinh-3-nam' },
        { name: 'Thực tập sinh 1 năm', slug: 'thuc-tap-sinh-1-nam' },
        { name: 'Thực tập sinh 3 Go', slug: 'thuc-tap-sinh-3-go' }
    ],
    'ky-nang-dac-dinh': [
        { name: 'Đặc định đầu Việt', slug: 'dac-dinh-dau-viet' },
        { name: 'Đặc định đầu Nhật', slug: 'dac-dinh-dau-nhat' },
        { name: 'Đặc định đi mới', slug: 'dac-dinh-di-moi' }
    ],
    'ky-su-tri-thuc': [
        { name: 'Kỹ sư, tri thức đầu Việt', slug: 'ky-su-tri-thuc-dau-viet' },
        { name: 'Kỹ sư, tri thức đầu Nhật', slug: 'ky-su-tri-thuc-dau-nhat' }
    ]
};

export const conditionsByVisaDetail: { [key: string]: string[] } = {
  'thuc-tap-sinh-3-nam': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
  'thuc-tap-sinh-1-nam': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
  'thuc-tap-sinh-3-go': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Trình cục sớm', 'Có bảng lương'],
  'dac-dinh-dau-nhat': ['Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Trình cục sớm', 'Có bảng lương'],
  'dac-dinh-dau-viet': ['Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
  'dac-dinh-di-moi': ['Tuyển gấp', 'Nhóm ngành 1', 'Nhóm ngành 2', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Hỗ trợ Ginou 2', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nhận visa katsudo', 'Không nhận visa katsudo', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
  'ky-su-tri-thuc-dau-nhat': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Muốn về công ty trước khi ra visa', 'Muốn về công ty sau khi ra visa', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Nhận nhiều loại bằng', 'Nhận bằng Senmon', 'Yêu cầu mặc Kimono', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Trình cục sớm', 'Có bảng lương'],
  'ky-su-tri-thuc-dau-viet': ['Tuyển gấp', 'Nhà xưởng', 'Ngoài trời', 'Làm trên cao', 'Cặp đôi', 'Yêu cầu bằng lái', 'Nhận tuổi cao', 'Việc nhẹ', 'Việc nặng', 'Nghỉ T7, CN', 'Không yêu cầu kinh nghiệm', 'Nhân viên chính thức', 'Haken', 'Nhận visa gia đình', 'Nhận quay lại', 'Nhận tiếng yếu', 'Nhận trái ngành', 'Nhận thiếu giấy', 'Nhận nhiều loại bằng', 'Nhận bằng Senmon', 'Lương tốt', 'Tăng ca', 'Tăng lương định kỳ', 'Dễ cày tiền', 'Có thưởng', 'Nợ phí', 'Phí mềm', 'Hỗ trợ chỗ ở', 'Hỗ trợ về công ty', 'Chưa vé', 'Có vé', 'Công ty uy tín', 'Có người Việt', 'Đơn truyền thống', 'Bay nhanh', 'Trình cục sớm', 'Có bảng lương'],
};

export const allSpecialConditions = [...new Set(Object.values(conditionsByVisaDetail).flat())].map(name => ({ name, slug: createSlug(name) }));

export const workShifts = [
    { name: "Ca ngày (thường 08:00-17:00 hoặc 09:00-18:00)", slug: "ca-ngay" },
    { name: "Ca chiều/tối (thường 16:00-24:00 hoặc 17:00-01:00)", slug: "ca-chieu-toi" },
    { name: "Ca đêm (thường 24:00-08:00)", slug: "ca-dem" },
    { name: "Ca luân phiên (chia ca sáng, chiều và đêm; luân phiên tuần tháng)", slug: "ca-luan-phien" },
    { name: "Ca 2-2-3 (làm 2 ngày, nghỉ 2 ngày, làm 3 ngày và lặp lại)", slug: "ca-2-2-3" },
    { name: "Ca 4-3-3 (làm 4 ngày, nghỉ 3 ngày và tiếp tục 3 ngày nghỉ)", slug: "ca-4-3-3" },
    { name: "Nghỉ thứ 7, Chủ Nhật", slug: "nghi-t7-cn" },
    { name: "Nghỉ định kỳ trong tuần", slug: "nghi-dinh-ky" },
    { name: "Khác", slug: "khac" }
];

export const otherSkills = [
    { name: "Có bằng lái xe AT", slug: "co-bang-lai-xe-at" },
    { name: "Có bằng lái xe MT", slug: "co-bang-lai-xe-mt" },
    { name: "Có bằng lái xe tải cỡ nhỏ", slug: "co-bang-lai-xe-tai-co-nho" },
    { name: "Có bằng lái xe tải cỡ trung", slug: "co-bang-lai-xe-tai-co-trung" },
    { name: "Có bằng lái xe tải cỡ lớn", slug: "co-bang-lai-xe-tai-co-lon" },
    { name: "Có bằng lái xe buýt cỡ trung", slug: "co-bang-lai-xe-buyt-co-trung" },
    { name: "Có bằng lái xe buýt cỡ lớn", slug: "co-bang-lai-xe-buyt-co-lon" },
    { name: "Lái được máy xúc, máy đào", slug: "lai-duoc-may-xuc-may-dao" },
    { name: "Lái được xe nâng", slug: "lai-duoc-xe-nang" },
    { name: "Có bằng cầu", slug: "co-bang-cau" },
    { name: "Vận hành máy CNC", slug: "van-hanh-may-cnc" },
    { name: "Có bằng tiện, mài", slug: "co-bang-tien-mai" },
    { name: "Có bằng hàn", slug: "co-bang-han" },
    { name: "Có bằng cắt", slug: "co-bang-cat" },
    { name: "Có bằng gia công kim loại", slug: "co-bang-gia-cong-kim-loai" },
    { name: "Làm được giàn giáo", slug: "lam-duoc-gian-giao" },
    { name: "Thi công nội thất", slug: "thi-cong-noi-that" },
    { name: "Quản lý thi công xây dựng", slug: "quan-ly-thi-cong-xay-dung" },
    { name: "Quản lý khối lượng xây dựng", slug: "quan-ly-khoi-luong-xay-dung" },
    { name: "Thiết kế BIM xây dựng", slug: "thiet-ke-bim-xay-dung" },
    { name: "Đọc được bản vẽ kỹ thuật", slug: "doc-duoc-ban-ve-ky-thuat" },
    { name: "Có bằng thi công nội thất", slug: "co-bang-thi-cong-noi-that" }
];

export const dominantHands = [
    { name: "Tất cả", slug: "all" },
    { name: "Tay phải", slug: "tay-phai" },
    { name: "Tay trái", slug: "tay-trai" },
    { name: "Cả hai tay", slug: "ca-hai-tay" },
];

export const educationLevels = [
    { name: "Tất cả", slug: "all" },
    { name: "Không yêu cầu", slug: "khong-yeu-cau" },
    { name: "Tốt nghiệp THPT", slug: "tot-nghiep-thpt" },
    { name: "Tốt nghiệp Trung cấp", slug: "tot-nghiep-trung-cap" },
    { name: "Tốt nghiệp Cao đẳng", slug: "tot-nghiep-cao-dang" },
    { name: "Tốt nghiệp Đại học", slug: "tot-nghiep-dai-hoc" },
    { name: "Tốt nghiệp Senmon", slug: "tot-nghiep-senmon" },
];
