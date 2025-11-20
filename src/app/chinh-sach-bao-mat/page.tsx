
import { type Metadata } from 'next';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Chính sách bảo mật',
    description: 'Chính sách bảo mật thông tin cá nhân của thành viên trên Sàn giao dịch thương mại điện tử HelloJob.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-secondary">
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-lg shadow-xl">
                    <header className="text-center mb-10">
                        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                            <ShieldCheck className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold font-headline text-primary">Chính sách bảo mật</h1>
                    </header>

                    <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="font-bold text-lg">Cam kết bảo mật</AccordionTrigger>
                            <AccordionContent className="prose max-w-none">
                                <p>Thông tin cá nhân của thành viên trên HelloJob.jp được Chúng tôi cam kết bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của Sàn giao dịch HelloJob. Việc thu thập và sử dụng thông tin của mỗi thành viên chỉ được thực hiện khi có sự đồng ý của khách hàng đó trừ những trường hợp pháp luật có quy định khác.</p>
                                <p>Không sử dụng, không chuyển giao, cung cấp hay tiết lộ cho bên thứ 3 nào về thông tin cá nhân của thành viên khi không có sự cho phép đồng ý từ thành viên.</p>
                                <p>Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến mất mát dữ liệu cá nhân thành viên, Chúng tôi sẽ có trách nhiệm thông báo vụ việc cho cơ quan chức năng điều tra xử lý kịp thời và thông báo cho thành viên được biết.</p>
                                <p>Bảo mật tuyệt đối mọi thông tin giao dịch trực tuyến của thành viên bao gồm thông tin hóa đơn kế toán chứng từ số hóa tại khu vực dữ liệu trung tâm an toàn cấp 1 của HelloJob.jp.</p>
                                <p>Ban Quản lý HelloJob.jp yêu cầu các cá nhân khi đăng ký là thành viên, phải cung cấp đầy đủ thông tin cá nhân có liên quan như: Họ và tên, địa chỉ liên lạc, email, số chứng minh nhân dân, số điện thoại… và chịu trách nhiệm về tính pháp lý của những thông tin trên. Ban Quản lý HelloJob không chịu trách nhiệm cũng như không giải quyết mọi khiếu nại có liên quan đến quyền lợi của thành viên đó nếu xét thấy tất cả thông tin cá nhân của thành viên đó cung cấp khi đăng ký ban đầu là không chính xác.</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger className="font-bold text-lg">Mục đích và phạm vi thu thập thông tin</AccordionTrigger>
                            <AccordionContent className="prose max-w-none">
                                <p>Việc thu thập dữ liệu chủ yếu trên Sàn giao dịch HelloJob bao gồm: Họ tên, ngày sinh, giới tính, địa chỉ email, số điện thoại, địa chỉ khách hàng (thành viên). Đây là các thông tin mà HelloJob cần thành viên cung cấp bắt buộc khi đăng ký sử dụng dịch vụ để Chúng tôi liên hệ xác nhận khi khách hàng đăng ký sử dụng dịch vụ trên website nhằm đảm bảo quyền lợi cho cho các thành viên.</p>
                                <p>Các thành viên sẽ tự chịu trách nhiệm về bảo mật và lưu giữ mọi hoạt động sử dụng dịch vụ của mình. Ngoài ra, thành viên có trách nhiệm thông báo kịp thời cho Sàn giao dịch HelloJob về những hành vi sử dụng trái phép, lạm dụng, vi phạm bảo mật, lưu giữ tên đăng ký và mật khẩu của bên thứ ba để có biện pháp giải quyết phù hợp.</p>
                                <p>Nếu tại bất kỳ thời điểm nào, bạn có câu hỏi về cách chúng tôi thu thập thông tin, bạn có thể liên hệ với Nhân viên Bảo vệ Dữ liệu ("DPO") của chúng tôi qua email: <strong>info@hellojob.jp</strong>.</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger className="font-bold text-lg">Phạm vi sử dụng thông tin</AccordionTrigger>
                            <AccordionContent className="prose max-w-none">
                                <p>Sàn TMĐT HelloJob sử dụng thông tin thành viên cung cấp để:</p>
                                <ul>
                                    <li>Cung cấp các dịch vụ đến thành viên;</li>
                                    <li>Gửi các thông báo về các hoạt động trao đổi thông tin giữa thành viên với Sàn TMĐT HelloJob;</li>
                                    <li>Ngăn ngừa các hoạt động phá hủy tài khoản người dùng của thành viên hoặc các hoạt động giả mạo thành viên;</li>
                                    <li>Liên lạc và giải quyết với thành viên trong những trường hợp đặc biệt.</li>
                                </ul>
                                <p>Chúng tôi không sử dụng thông tin cá nhân của thành viên ngoài mục đích xác nhận và liên hệ có liên quan đến giao dịch tại Sàn TMĐT HelloJob.</p>
                                <p>Trong trường hợp có yêu cầu của pháp luật: Sàn giao dịch HelloJob có trách nhiệm hợp tác cung cấp thông tin cá nhân thành viên khi có yêu cầu từ cơ quan tư pháp bao gồm: Viện kiểm sát, tòa án, cơ quan công an điều tra liên quan đến hành vi vi phạm pháp luật nào đó của khách hàng. Ngoài ra, không ai có quyền xâm phạm vào thông tin cá nhân của thành viên.</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4">
                            <AccordionTrigger className="font-bold text-lg">Cách chúng tôi thu thập thông tin</AccordionTrigger>
                            <AccordionContent className="prose max-w-none">
                                <p>Phần lớn thông tin cá nhân được thu thập trực tiếp từ bạn khi bạn:</p>
                                <ul>
                                    <li>Tạo một tài khoản hoặc đăng nhập qua mạng xã hội.</li>
                                    <li>Để lại thông tin để nhận tư vấn (ví dụ: họ tên, số điện thoại).</li>
                                    <li>Hoàn thành các biểu mẫu liên hệ hoặc yêu cầu bản tin.</li>
                                    <li>Tham gia các cuộc thi, khảo sát, hoặc các hoạt động quảng cáo khác.</li>
                                </ul>
                                <p>Ngoài ra, chúng tôi cũng thu thập thông tin bổ sung một cách tự động để đảm bảo hiệu suất dịch vụ:</p>
                                <p><strong>Cookies và công nghệ tương tự:</strong> Cho phép chúng tôi theo dõi hành vi duyệt web của bạn như liên kết được nhấp, trang đã xem, và các tương tác khác. Dữ liệu này bao gồm địa chỉ IP, loại trình duyệt, loại thiết bị, và thời gian sử dụng Dịch vụ. Để biết thêm thông tin, vui lòng truy cập Chính sách cookie của chúng tôi.</p>
                                <p><strong>Dữ liệu được tổng hợp:</strong> Chúng tôi có thể nhận dữ liệu về bạn từ các nguồn khác như cơ sở dữ liệu công khai hoặc các bên thứ ba để cập nhật và phân tích hồ sơ, xác định khách hàng mới và cung cấp các dịch vụ phù hợp.</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5">
                            <AccordionTrigger className="font-bold text-lg">Sử dụng, Chia sẻ & Bảo mật Dữ liệu</AccordionTrigger>
                            <AccordionContent className="prose max-w-none">
                                <h4>Cách chúng tôi sử dụng thông tin</h4>
                                <p>Chúng tôi chỉ sử dụng dữ liệu cho các mục đích đã được cho phép, cần thiết để cung cấp dịch vụ, hoặc theo yêu cầu của pháp luật, nhằm:</p>
                                <ul>
                                    <li>Cải thiện và tối ưu hóa hoạt động và hiệu suất Dịch vụ của chúng tôi.</li>
                                    <li>Chẩn đoán các vấn đề và xác định rủi ro về bảo mật, lỗi hoặc các cải tiến cần thiết.</li>
                                    <li>Phát hiện và ngăn chặn hành vi gian lận và lạm dụng Dịch vụ và hệ thống của chúng tôi.</li>
                                </ul>
                                <h4>Chia sẻ với các bên thứ ba đáng tin cậy</h4>
                                <p>Chúng tôi có thể chia sẻ thông tin cá nhân của bạn với các công ty liên kết, đối tác tích hợp dịch vụ, và các nhà cung cấp dịch vụ bên thứ ba đáng tin cậy để thực hiện các dịch vụ thay mặt chúng tôi (xử lý thanh toán, phân tích dữ liệu, giao tiếp, quản lý quan hệ khách hàng, v.v.). Các bên này đã đồng ý không chia sẻ, sử dụng hoặc giữ lại thông tin cá nhân của bạn cho bất kỳ mục đích nào khác.</p>
                                <h4>Tuân thủ các yêu cầu pháp lý</h4>
                                <p>Chúng tôi hợp tác và có thể tiết lộ thông tin của bạn cho chính phủ hoặc cơ quan thi hành luật khi tin rằng điều đó là cần thiết để phản hồi các khiếu nại, quy trình pháp lý, bảo vệ tài sản và quyền của chúng tôi hoặc của bên thứ ba, bảo vệ an toàn cộng đồng, hoặc ngăn chặn hoạt động bất hợp pháp.</p>
                                <h4>Cách chúng tôi bảo mật, lưu trữ và giữ lại dữ liệu của bạn</h4>
                                <p>Chúng tôi tuân thủ các tiêu chuẩn được chấp nhận rộng rãi để lưu trữ và bảo vệ dữ liệu cá nhân, bao gồm cả việc sử dụng mã hóa. Chúng tôi chỉ lưu giữ dữ liệu trong thời gian cần thiết để cung cấp dịch vụ và cho các mục đích kinh doanh hợp pháp hoặc theo yêu cầu của pháp luật.</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-6">
                            <AccordionTrigger className="font-bold text-lg">Quyền của bạn & Sở hữu trí tuệ</AccordionTrigger>
                            <AccordionContent className="prose max-w-none">
                                <h4>Cách bạn có thể truy cập, cập nhật hoặc xóa dữ liệu</h4>
                                <p>Để dễ dàng truy cập, xem, cập nhật, xóa hoặc chuyển thông tin cá nhân của bạn, vui lòng đăng nhập vào Tài khoản của bạn và truy cập phần “Trang cá nhân”. Nếu bạn không thể, vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>
                                <p>Nếu bạn yêu cầu xóa thông tin cá nhân, yêu cầu đó sẽ chỉ được thực hiện khi dữ liệu không còn cần thiết cho Dịch vụ đã mua hoặc các yêu cầu lưu trữ hồ sơ hợp pháp của chúng tôi.</p>
                                <h4>Thương hiệu và bản quyền</h4>
                                <p>Mọi quyền sở hữu trí tuệ (đã đăng ký hoặc chưa đăng ký), nội dung thông tin và tất cả các thiết kế, văn bản, đồ họa, phần mềm, hình ảnh, video, âm nhạc, âm thanh, biên dịch phần mềm, mã nguồn và phần mềm cơ bản đều là tài sản của chúng tôi. Toàn bộ nội dung của Website được bảo vệ bởi luật sở hữu trí tuệ của Việt Nam và các công ước quốc tế.</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-7">
                            <AccordionTrigger className="font-bold text-lg">Miễn trừ trách nhiệm</AccordionTrigger>
                            <AccordionContent className="prose max-w-none">
                                <p>Chúng tôi không chịu trách nhiệm về các thiết bị, máy móc mà bạn dùng để truy cập vào Sàn TMĐT HelloJob. Bạn phải tự trang bị và tự chịu mọi trách nhiệm, phí tổn phát sinh trong quá trình sử dụng.</p>
                                <p>Chúng tôi không đảm bảo việc loại trừ hoàn toàn các yếu tố gây hại như hành vi cố ý từ bên thứ ba hoặc virus, cũng như không đảm bảo dịch vụ không có sự cố. Nếu bạn bị thiệt hại do việc sử dụng thông tin, dịch vụ của Sàn TMĐT HelloJob, đây là sự rủi ro của bạn và bạn sẽ phải tự khắc phục những tổn thất đó.</p>
                                <p>Chúng tôi có quyền ngừng cung cấp dịch vụ bất cứ lúc nào và không chịu trách nhiệm đối với mọi thiệt hại, mất mát, tổn thất mà bạn phải chịu trừ khi do lỗi cố ý của HelloJob gây ra.</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-8" className="border-b-0">
                            <AccordionTrigger className="font-bold text-lg">Thông tin liên hệ</AccordionTrigger>
                            <AccordionContent className="prose max-w-none">
                                <p>Nếu bạn có bất kỳ câu hỏi, quan ngại hoặc khiếu nại nào về Chính sách về quyền riêng tư, bạn có thể liên hệ với Phòng Bảo vệ Dữ liệu qua email theo địa chỉ <strong>info@hellojob.jp</strong>.</p>
                                <p>Ngoài ra, bạn có thể liên hệ với chúng tôi bằng một trong các cách sau:</p>
                                <address className="not-italic">
                                    <strong>Qua đường bưu điện:</strong> Người nhận: Công ty cổ phần HelloJob. Tầng 21, Tòa nhà Viwaseen, Số 48 Tố Hữu, Phường Trung Văn, Quận Nam Từ Liêm, Thành phố Hà Nội, Việt Nam<br />
                                    <strong>Qua điện thoại:</strong> (+84) 038 666 7 999
                                </address>
                                <p>Chúng tôi sẽ phản hồi mọi yêu cầu, câu hỏi hoặc mối quan ngại trong vòng hai mươi tư (24) giờ.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}