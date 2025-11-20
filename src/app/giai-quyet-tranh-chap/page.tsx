
import { type Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Handshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cơ chế giải quyết tranh chấp',
  description: 'Quy trình và cơ chế giải quyết các tranh chấp phát sinh trên Sàn giao dịch thương mại điện tử HelloJob.',
};

export default function DisputeResolutionPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-lg shadow-xl">
          <header className="text-center mb-10">
            <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
              <Handshake className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-headline text-primary">Cơ chế giải quyết tranh chấp</h1>
          </header>

          <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold text-lg">Nguyên tắc chung</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                <p>Cơ chế này áp dụng cho các đối tượng: HelloJob (Đơn vị chủ quản), Đơn vị cung cấp dịch vụ (Đối tác), và Khách hàng (Ứng viên).</p>
                <p>Nhằm mục đích giải quyết hiệu quả nhất các tranh chấp phát sinh, các bên liên quan có trách nhiệm tuân thủ đầy đủ các quy định tại cơ chế này. Các Bên có vai trò quan trọng và có trách nhiệm tích cực giải quyết sự việc. Đơn vị cung cấp dịch vụ cần có trách nhiệm cung cấp văn bản, tài liệu, giấy tờ, và các chứng cứ khác để chứng minh, làm rõ thông tin.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="font-bold text-lg">Hiệu lực của thỏa thuận</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                <p>Bản Thỏa Thuận Sử Dụng này có giá trị như Hợp Đồng dưới dạng hợp đồng điện tử. Bằng cách nhấn vào nút “Tôi đồng ý”, bạn hoàn toàn đồng ý và đã hiểu các điều khoản trong Hợp Đồng này và Hợp Đồng có hiệu lực kể từ thời điểm đó.</p>
                <p>Trong trường hợp một hoặc một số điều khoản của Bản Điều khoản chính sách này xung đột với các quy định của luật pháp và bị Tòa án tuyên là vô hiệu, điều khoản đó sẽ được chỉnh sửa cho phù hợp với quy định pháp luật hiện hành, và phần còn lại của Bản Điều khoản chính sách này vẫn giữ nguyên giá trị.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="font-bold text-lg">Quy trình giải quyết khiếu nại</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                <p>HelloJob tôn trọng và thực hiện nghiêm túc những quy định của pháp luật về bảo vệ quyền lợi của Ứng viên. Các thành viên cần cung cấp đầy đủ, chính xác, trung thực những thông tin liên quan đến nội dung công việc.</p>
                <p>Khi phát sinh tranh chấp, khiếu nại, các bên có trách nhiệm hỗ trợ tích cực giải quyết. Khách hàng có thể gửi khiếu nại tới:</p>
                <address className="not-italic bg-secondary p-4 rounded-md">
                  <strong>Công ty Cổ phần HelloJob</strong><br />
                  Địa chỉ: Tầng 21 tòa Viwaseen số 48 Tố Hữu, Trung Văn, Nam Từ Liêm, Hà Nội<br />
                  Tel: 02433886868<br />
                  Email: info@hellojob.jp
                </address>
                <p>Với trường hợp lỗi thuộc về phía Đối tác, HelloJob sẽ có biện pháp cảnh cáo, khóa tài khoản hoặc chuyển cho cơ quan pháp luật có thẩm quyền xử lý, đồng thời gỡ bỏ toàn bộ nội dung của Đối tác đó.</p>
                <p>Khi hai bên vẫn chưa thể thỏa thuận giải quyết được mâu thuẫn, một trong hai bên sẽ được quyền nhờ đến cơ quan pháp luật có thẩm quyền can thiệp.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="font-bold text-lg">Quyền và nghĩa vụ của Ban quản lý HelloJob</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                <h4>Quyền của Ban quản lý:</h4>
                <ul>
                  <li>Cung cấp dịch vụ sau khi thành viên hoàn thành các thủ tục và điều kiện bắt buộc.</li>
                  <li>Có quyền kiểm tra thông tin, từ chối, tạm ngừng hoặc chấm dứt quyền sử dụng dịch vụ của thành viên nếu có cơ sở chứng minh thông tin không chính xác hoặc vi phạm pháp luật.</li>
                  <li>Từ chối cung cấp dịch vụ nếu thành viên có hành vi lừa đảo, giả mạo, gây rối loạn thị trường.</li>
                  <li>Có quyền thay đổi quy chế này mà không cần báo trước.</li>
                </ul>
                <h4>Nghĩa vụ của Ban quản lý:</h4>
                <ul>
                  <li>Đăng ký và công bố công khai quy chế hoạt động của sàn TMĐT.</li>
                  <li>Yêu cầu người bán cung cấp thông tin đầy đủ và có cơ chế kiểm tra, giám sát.</li>
                  <li>Lưu trữ thông tin đăng ký và thường xuyên cập nhật.</li>
                  <li>Thường xuyên cập nhật thông tin từ Bộ LĐTBXH để phát hiện các đơn vị bị thu hồi giấy phép XKLĐ.</li>
                  <li>Thiết lập cơ chế giao kết hợp đồng trực tuyến.</li>
                  <li>Áp dụng biện pháp bảo mật thông tin và xử lý kịp thời các hành vi vi phạm.</li>
                  <li>Hỗ trợ cơ quan quản lý nhà nước và tích cực hỗ trợ khách hàng bảo vệ quyền lợi.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="font-bold text-lg">Quyền và trách nhiệm của Đối tác</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                <h4>Quyền của Đối tác:</h4>
                <ul>
                  <li>Được đăng thông tin tuyển dụng và tiến hành giao dịch sau khi được chấp thuận.</li>
                  <li>Được cấp tài khoản riêng để quản lý thông tin và giao dịch.</li>
                  <li>Được nhân viên HelloJob hướng dẫn sử dụng các công cụ và tính năng.</li>
                  <li>Có quyền đóng góp ý kiến cho HelloJob.</li>
                </ul>
                <h4>Trách nhiệm của Đối tác:</h4>
                <ul>
                  <li>Cung cấp đầy đủ và chính xác thông tin doanh nghiệp.</li>
                  <li>Cung cấp đầy đủ thông tin về công việc, giá cả, điều kiện giao dịch.</li>
                  <li>Không cung cấp dịch vụ thuộc danh mục cấm hoặc vi phạm sở hữu trí tuệ.</li>
                  <li>Cung cấp Giấy phép hoạt động dịch vụ đưa người lao động đi làm việc ở nước ngoài và thông báo ngay khi bị thu hồi.</li>
                  <li>Đảm bảo tính chính xác, trung thực của thông tin cung cấp.</li>
                  <li>Phối hợp phản hồi thông tin cho ứng viên.</li>
                  <li>Tuân thủ các quy định của pháp luật về thanh toán, quảng cáo, bảo vệ quyền lợi người tiêu dùng.</li>
                  <li>Chịu trách nhiệm về nội dung, hình ảnh và toàn bộ quá trình giao dịch.</li>
                  <li>Bảo mật tài khoản của mình và thông báo kịp thời khi có vi phạm.</li>
                  <li>Không sử dụng dịch vụ vào mục đích bất hợp pháp, lừa đảo, phá hoại hệ thống.</li>
                  <li>Không được sao chép, truyền bá dịch vụ của HelloJob khi chưa có sự đồng ý.</li>
                  <li>Không gây mất uy tín của HelloJob dưới mọi hình thức.</li>
                  <li>Thực hiện đầy đủ nghĩa vụ thuế theo quy định của pháp luật.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b-0">
              <AccordionTrigger className="font-bold text-lg">Quyền và trách nhiệm của Khách hàng (Ứng viên)</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                <h4>Quyền của Khách hàng:</h4>
                <ul>
                  <li>Được khởi tạo tài khoản để tham gia tìm việc và ứng tuyển.</li>
                  <li>Được cấp tên đăng ký và mật khẩu để sử dụng dịch vụ và quản lý tài khoản.</li>
                  <li>Được tiếp cận và tham gia các nội dung, chương trình hướng nghiệp.</li>
                  <li>Có quyền đóng góp ý kiến cho HelloJob.</li>
                </ul>
                <h4>Trách nhiệm của Khách hàng:</h4>
                <ul>
                  <li>Tự chịu trách nhiệm về bảo mật, lưu giữ tài khoản của mình.</li>
                  <li>Thông báo kịp thời cho HelloJob về các hành vi sử dụng trái phép, lạm dụng tài khoản.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
