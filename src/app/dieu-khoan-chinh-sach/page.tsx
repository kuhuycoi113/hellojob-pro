
import { type Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: 'Điều khoản & Chính sách',
  description: 'Quy chế hoạt động và các điều khoản sử dụng Sàn giao dịch thương mại điện tử HelloJob.',
};

export default function TermsPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-lg shadow-xl">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold font-headline text-primary">Điều khoản Chính sách</h1>
          </header>

          <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold text-lg">Nguyên tắc chung</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                <p>Công ty Cổ phần HelloJob là đơn vị chủ quản, trực tiếp quản lý và vận hành website https://hellojob.jp – Sàn giao dịch thương mại điện tử HelloJob (“Sàn TMĐT HelloJob”). Những thành viên của Sàn TMĐT HelloJob là những thương nhân, tổ chức, cá nhân có hoạt động kinh doanh hợp pháp được HelloJob công nhận và được phép sử dụng dịch vụ do HelloJob cung cấp.</p>
                <p>Nội dung đăng tải trên Sàn TMĐT HelloJob phải đáp ứng đầy đủ những quy định của pháp luật hiện hành, không vi phạm những trường hợp cấm theo quy định của pháp luật. Mọi đối tượng tham gia giao dịch trên website đều cần phải hiểu biết về trách nhiệm pháp lý và cam kết thực hiện đúng những Quy định của HelloJob.</p>
                <p>Tổ chức, cá nhân tham gia giao dịch trên Sàn TMĐT HelloJob có quyền thỏa thuận trên cơ sở tôn trọng quyền và lợi ích của các bên tham gia tuyển dụng, căn cứ trên Hợp đồng tuyển dụng và không trái quy định của pháp luật.</p>
                <p>Hoạt động đăng tin tuyển dụng trên Sàn TMĐT HelloJob đảm bảo tính minh bạch, công khai, đảm bảo quyền lợi của Ứng viên.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="font-bold text-lg">Quy định chung</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                <ul>
                  <li><strong>“HelloJob” hay “Công ty”</strong>: là Công ty Cổ phần HelloJob được thành lập và hoạt động theo Giấy chứng nhận đăng ký doanh nghiệp số 0109000738 do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp lần đầu ngày 25 tháng 11 năm 2019.</li>
                  <li><strong>Ứng viên (người lao động)</strong>: là người lao động Việt Nam ở trong và ngoài nước muốn tìm kiếm thông tin việc làm trong nước, thông tin việc làm xklđ hoặc các thông tin việc làm tại Nhật Bản đối với lao động đang ở Nhật Bản.</li>
                  <li><strong>Đối tác (nhà tuyển dụng)</strong>: là các doanh nghiệp, tổ chức sử dụng lao động trong nước, các doanh nghiệp, tổ chức hoạt động dịch vụ đưa người lao động đi làm việc tại nước ngoài (xkld) hoặc các công ty tuyển dụng, giới thiệu việc làm tại Nhật Bản.</li>
                  <li><strong>Thành viên</strong>: bao gồm Đối tác và Ứng viên trên sàn TMĐT HelloJob.</li>
                  <li><strong>Thành viên tham gia giao dịch trên HelloJob</strong> đều cần đăng ký 1 tài khoản để sử dụng, trong đó phải kê khai thông tin cá nhân có liên quan, được HelloJob kiểm duyệt, góp ý chỉnh sửa thông tin, hoàn thiện hồ sơ với Ứng viên và đăng tin tuyển dụng, thông tin Công ty theo đúng quy chuẩn của HelloJob với Đối tác.</li>
                  <li><strong>Hàng hóa/ dịch vụ</strong> được hiểu là những thông tin việc làm được đăng tải trên website https://hellojob.jp.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-bold text-lg">Dịch vụ & chức năng</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                  <ul>
                    <li>Thông tin định hướng nghề nghiệp, hoạt động, thanh niên Việt Nam;</li>
                    <li>Đào tạo – giảng dạy: nâng cao kỹ năng cá nhân, tổ chức, chương trình đào tạo hữu ích, địa điểm và đơn vị đào tạo;</li>
                    <li>Trang nghề: Cung cấp tất cả thông tin liên quan đến nghề mong muốn gồm: tin tức, tuyển dụng, hướng dẫn, vv…</li>
                    <li>Thông tin tuyển dụng – sàn nghề: thông tin nhu cầu tuyển dụng nghề từ các tổ chức, doanh nghiệp có nhu cầu kèm mô tả, thời điểm, thông tin liên hệ chi tiết;</li>
                    <li>Thông tin ứng viên – thành viên: mỗi thành viên sẽ có tài khoản quản trị riêng mô tả quá trình học tập, thành tích, năng lực, sở thích và mong muốn về nghề nghiệp;</li>
                    <li>Các tính năng tương tác trên hệ thống & người dùng: đánh giá – cho điểm từ người dùng với cá nhân, tổ chức, liên hệ (hệ thống email – tin nhắn nội bộ), diễn đàn riêng trao đổi, hệ thống thông báo theo nhóm, hệ thống kết bạn & tìm kiếm thông minh;</li>
                  </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="font-bold text-lg">Quy trình thanh toán</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                  <h4>a) Quy trình thanh toán</h4>
                  <p>Đối tác thực hiện thanh toán cho dịch vụ theo phương thức trả trước thông qua hệ thống thanh toán của Website, có thể lựa chọn các hình thức thanh toán như: chuyển khoản, e-banking. Thẻ ATM nội địa, Thẻ visa/mastercard quốc tế, Trung gian thanh toán, Ví điện tử... được tích hợp trên website. Đối tác sẽ tiến hành mua các gói dịch vụ trả trước theo các bước như sau:</p>
                  <ol>
                    <li><strong>Bước 1:</strong> Ấn Menu -&gt; chọn Mua gói dịch vụ để vào màn hình chọn gói dịch vụ.</li>
                    <li><strong>Bước 2:</strong> Chọn gói dịch vụ phù hợp -&gt; Nhập và kiểm tra các thông tin thanh toán.</li>
                    <li><strong>Bước 3:</strong> Tiến hành thanh toán trên hệ thống của Nhà cung cấp cổng thanh toán Onepay.</li>
                    <li><strong>Bước 4:</strong> Xác nhận giao dịch, đối với giao dịch thành công, hệ thống sẽ cộng điểm sử dụng tương ứng với gói dịch vụ đã thanh toán.</li>
                  </ol>
                  <p>Bảng tính điểm để sử dụng dịch vụ, và bảng giá các gói trả trước theo từng thời điểm sẽ được công bố công khai cụ thể và chi tiết trên website.</p>
                  <h4>b) Dùng điểm để sử dụng dịch vụ:</h4>
                  <p>Việc dùng điểm để sử dụng dịch vụ thực hiện theo các bước như sau:</p>
                  <ol>
                      <li><strong>Bước 1:</strong> Đối tác chọn xem chi tiết đơn hàng đã đăng tải -&gt; ấn vào Xem danh sách các ứng viên.</li>
                      <li><strong>Bước 2:</strong> Nhà tuyển dụng chọn "Chi Tiết" để xem xét các thông tin cơ bản của ứng viên quan tâm, trường hợp muốn sử dụng và mở các tính năng liên lạc, xem hồ sơ ứng viên chọn "Đồng ý".</li>
                      <li><strong>Bước 3:</strong> Hệ thống sẽ trừ điểm sử dụng, sau đó thông tin, phương thức liên lạc và hồ sơ ứng viên sẽ hiện ra.</li>
                  </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="font-bold text-lg">Trách nhiệm trong trường hợp phát sinh lỗi kỹ thuật</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                 <p>HelloJob cam kết nỗ lực đảm bảo sự an toàn và ổn định của toàn bộ hệ thống kỹ thuật. Trong trường hợp phát sinh lỗi kỹ thuật thì thành viên có thể email về địa chỉ sau: để được khắc phục trong thời gian sớm nhất, đảm bảo mọi giao dịch diễn ra trên Sàn giao dịch TMĐT.</p>
                 <p>Tuy nhiên, trong trường hợp phát sinh lỗi từ phía khách quan như lỗi đường truyền, thông tin lỗi không được truyền tải đến HelloJob hoặc những lỗi không phải do Ban Quản lý gây ra thì HelloJob sẽ không chịu trách nhiệm giải quyết.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="font-bold text-lg">Điều khoản áp dụng</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                 <p>Quy chế này có hiệu lực kể từ ngày ký.</p>
                 <p>HelloJob có quyền thay đổi Quy chế và thông báo lên website cho toàn bộ thành viên được biết.</p>
                 <p>Quy chế sẽ được bổ sung liên tục mà không cần thông báo trước. Thành viên tham gia bắt buộc phải tuân theo quy chế này.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="font-bold text-lg">Điều khoản cam kết</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                 <p>Mọi thành viên và đối tác khi tham gia giao dịch trên HelloJob đồng nghĩa với việc chấp thuận mọi điều khoản của Quy chế này.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border-b-0">
              <AccordionTrigger className="font-bold text-lg">Thông tin liên lạc</AccordionTrigger>
              <AccordionContent className="prose max-w-none">
                <p>Mọi thắc mắc liên hệ theo địa chỉ sau:</p>
                <address className="not-italic">
                  <strong>Sàn giao dịch Thương mại điện tử HelloJob</strong><br/>
                  Công ty/Tổ chức : Công ty Cổ phần HelloJob<br/>
                  Địa chỉ: Tầng 21 tòa Viwaseen số 48 Tố Hữu, Trung Văn, Nam Từ Liêm, Hà Nội<br/>
                  Tel: 038 666 7 999<br/>
                  Email: chairman@hellojob.jp
                </address>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </div>
    </div>
  );
}
