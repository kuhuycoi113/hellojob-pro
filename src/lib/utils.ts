import { CandidateProfile } from "@/ai/schemas";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import MAPPING_IMAGES from "@/lib/mapping_images.json";
import MAPPING_EXCLUDE_IMAGES from "@/lib/mapping_exclude_images.json";
import { japanJobTypes, visaDetailsByVisaType } from "./visa-data";
import { SearchFilters } from "@/components/job-search/search-results";
import { Role, User } from "@/contexts/AuthContext";
import { publicFeeLimits } from "./mock-data";
import { formatDate } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseMessengerInput = (input: string): string => {
  if (!input) return '';
  const trimmedInput = input.trim();
  try {
    if (trimmedInput.startsWith('http') || trimmedInput.includes('facebook.com') || trimmedInput.includes('m.me')) {
      const url = new URL(trimmedInput.startsWith('http') ? trimmedInput : `https://${trimmedInput}`);

      if (url.hostname.includes('facebook.com') || url.hostname.includes('m.facebook.com')) {
        const id = url.searchParams.get('id');
        if (id && /^\d+$/.test(id)) {
          return id; // Return numeric ID if found in profile.php
        }
        // For vanity URLs like facebook.com/username
        const pathParts = url.pathname.split('/').filter(part => part && part !== 'profile.php' && part !== 'people');
        if (pathParts.length > 0) {
          return pathParts[pathParts.length - 1];
        }
      }
      if (url.hostname.includes('m.me')) {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          return pathParts[pathParts.length - 1];
        }
      }
    }
  } catch (error) {
    // Not a valid URL, treat as a potential username
    console.warn("Could not parse Messenger input as URL, treating as username:", error);
  }
  // Fallback: treat as username, remove any URL-like parts
  return trimmedInput.split('/').pop() || trimmedInput;
};

export const parseZaloInput = (input: string): string => {
  if (!input) return '';
  const trimmedInput = input.trim();
  if (trimmedInput.includes('zalo.me/')) {
    const parts = trimmedInput.split('/');
    return parts.pop()?.replace(/\D/g, '') || '';
  }
  return trimmedInput.replace(/\D/g, '');
};

export const parseLineInput = (input: string): string => {
  if (!input) return '';
  const trimmedInput = input.trim();
  try {
    if (trimmedInput.startsWith('http') && trimmedInput.includes('line.me/')) {
      const url = new URL(trimmedInput);
      const pathParts = url.pathname.split('/');
      let potentialId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
      if (potentialId) {
        // Remove query parameters
        potentialId = potentialId.split('?')[0];
        // Remove leading ~ or @ if present
        return potentialId.replace(/^[~@]/, '');
      }
    }
  } catch (error) {
    console.warn("Could not parse Line input as URL, treating as ID:", error);
  }
  // Fallback to treat the whole input as an ID, removing potential URL parts and special characters
  return trimmedInput.split('/').pop()?.replace(/^[~@]/, '') || trimmedInput.replace(/^[~@]/, '');
};

export const formatSpecialCondition = (specialConditions: any) => {
  if (typeof specialConditions === "string") {
    specialConditions = specialConditions.split(", ");
  }
  return specialConditions ?? [];
};

export const getGenderLabel = (gender: any) => {
  if (gender === "MALE") {
    return "Nam";
  } else if (gender === "FEMALE") {
    return "Nữ";
  } else if (gender === "BOTH") {
    return "Nam/Nữ";
  } else {
    return "";
  }
};
export const generateBulletJobCrawl = (data: any) => {
  const { job, visa, career, languageLevel, numberRecruits, gender, workLocation, basicSalary } = data;
  let specialConditions = data.specialConditions;
  specialConditions = formatSpecialCondition(specialConditions);
  const details = [
    job ?? career,
    workLocation,
    languageLevel,
    numberRecruits ? `${numberRecruits} ${getGenderLabel(gender)}` : gender ? getGenderLabel(gender) : null,
    basicSalary ? `LCB ${formatSalaryForDisplay(basicSalary, formatVisa(visa))}` : null,
    specialConditions ? specialConditions.join(",") : null,
  ]
    .filter(Boolean)
    .join(", ");

  return details;
};

export const formatCurrency = (value?: string) => {
  if (!value) return 'N/A';
  return ('' + value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const visasForVndDisplay = [
  'Thực tập sinh 3 năm',
  'Thực tập sinh 1 năm',
  'Đặc định đi mới',
  'Kỹ sư, tri thức đầu Việt',
];
const JPY_VND_RATE = 180; // Example rate
const USD_VND_RATE = 26300; // Example rate
export const formatSalaryForDisplay = (salaryValue?: any, visaDetail?: string | any): string => {
  if (!salaryValue) return 'Liên hệ';

  const numericValue = parseInt(('' + salaryValue).replace(/[^0-9]/g, ''), 10);
  if (isNaN(numericValue)) return salaryValue;
  if (visaDetail && visasForVndDisplay.includes(visaDetail)) {
    const vndValue = numericValue * JPY_VND_RATE;
    const valueInMillions = vndValue / 1000000;

    if (valueInMillions % 1 === 0) {
      return `${valueInMillions.toLocaleString('vi-VN')}tr`;
    }

    const formattedVnd = valueInMillions.toLocaleString('vi-VN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
    return `${formattedVnd.replace('.', ',')}tr`;
  }

  return `${formatCurrency(salaryValue)} JPY`;
};

const controlledFeeVisas = [
  'Thực tập sinh 3 năm',
  'Thực tập sinh 1 năm',
  'Đặc định đi mới',
  'Kỹ sư, tri thức đầu Việt',
  'Đặc định đầu Việt'
];
export const getFeeDisplayInfo = (job: any, isSearchPage?: boolean, role?: Role) => {
  const { visa: visaDetail, fee, netFeeNoTicket, netFeeWithTuition } = job;
  if (role === 'admin') {
    if (fee > 100) {
      return { shouldShow: true, text: `Phí: $${formatCurrency(String(fee))}` };
    } else {
      return { shouldShow: false, text: `Phí: Liên hệ nguồn` };
    }
  }
  const feeLimit = publicFeeLimits[visaDetail as keyof typeof publicFeeLimits];
  const isControlled = controlledFeeVisas.includes(formatVisa(job.visa) || '');

  let feeValue: number | undefined;
  let feeLabel: string | undefined;
  if (netFeeWithTuition) {
    feeValue = parseInt(netFeeWithTuition);
    feeLabel = 'Phí và vé và học phí';
  } else if (fee) {
    feeValue = parseInt(fee);
    if (visaDetail?.includes('Thực tập sinh') && feeValue <= 500) {
      return { shouldShow: true, text: `Phí: Liên hệ` };
    }
    feeLabel = (visaDetail?.includes('Thực tập sinh')) ? 'Phí và vé không học phí' : 'Phí có vé';
  } else if (netFeeNoTicket) {
    feeValue = parseInt(netFeeNoTicket);
    feeLabel = 'Phí không vé';
  }

  if (!feeLabel || feeValue === undefined) {
    return { shouldShow: isControlled, text: `Phí: Liên hệ` };
  }

  if (isControlled && feeValue > feeLimit) {
    return { shouldShow: true, text: `Phí: Liên hệ` };
  }

  if (visaDetail && visasForVndDisplay.includes(visaDetail)) {
    const vndValue = feeValue * USD_VND_RATE;
    const valueInMillions = vndValue / 1000000;
    let formattedVnd: string;
    // Apply rounding only on search page
    if (isSearchPage && valueInMillions % 1 === 0) {
      formattedVnd = valueInMillions.toLocaleString('vi-VN');
    } else {
      formattedVnd = valueInMillions.toLocaleString('vi-VN', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      });
    }
    return { shouldShow: true, text: `Phí: ${formattedVnd.replace('.', ',')}tr` };
  }

  const visasForUsd = ['Đặc định đầu Việt'];
  if (visaDetail && visasForUsd.includes(visaDetail)) {
    return { shouldShow: true, text: `Phí: $${formatCurrency(String(feeValue))}` };
  }

  // Default fallback for other controlled visas or if logic doesn't match
  return { shouldShow: true, text: `Phí: $${formatCurrency(String(feeValue))}` };
};


export const convertTime = (time: any) => {
  const timestamp = Number(time);

  const isSeconds = timestamp.toString().length <= 10;

  const date = isSeconds ? new Date(timestamp * 1000) : new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${hours}:${minutes}, ${day}/${month}/${year}`;
  return formattedDate;
};



export const getJobImage = (job: string, career: string) => {
  let mappingImage = MAPPING_IMAGES.find((item) => item.newJobs.indexOf(job) > -1);
  if (!mappingImage) {
    mappingImage = MAPPING_IMAGES.find((item) => item.newJobs.indexOf(career) > -1);
  }
  if (!mappingImage) {
    return "/img/no-image.jpg";
  }
  if (mappingImage.images.length === 1) {
    return mappingImage.images[0];
  }
  let randomInt = Math.floor(Math.random() * mappingImage.images.length);
  while (MAPPING_EXCLUDE_IMAGES.indexOf(mappingImage.images[randomInt]) > -1) {
    randomInt = Math.floor(Math.random() * mappingImage.images.length);
  }
  return mappingImage.images[randomInt];
};
export const formatVisa = (visa: string | null) => {
  return visa?.replace('Tokutei', 'Đặc định') ?? null;
};
export const findVisaByVisaDetail = (visaDetail: string) => {
  if (!visaDetail) {
    return 'Không rõ';
  }
  visaDetail = visaDetail.replace('Tokutei', 'Đặc định');
  for (let visa of japanJobTypes) {
    const details = visaDetailsByVisaType[visa.slug];
    if (details.findIndex(detail => detail.name === visaDetail) > -1) {
      return visa.name;
    }
  }
  return visaDetail ?? 'Không rõ';
};


export async function exitInAppBrowser(url: string) {
  try {
    const standalone = window.navigator.standalone,
      userAgent = window.navigator.userAgent.toLowerCase(),
      safari = /safari/.test(userAgent),
      isIOS = /iphone|ipod|ipad/.test(userAgent);
    const isAndroid = /android/.test(userAgent),
      isWebView = /wv/.test(userAgent) || /webview/.test(userAgent),
      isPWA = window.matchMedia("(display-mode: standalone)").matches;

    // Kiểm tra WebView trên iOS (nếu không có `window.navigator.standalone`)
    if (isIOS) {
      if (!safari && !standalone) {
        try {
          // Try safari - 15, 17, 18
          const iosUrl = `x-safari-${url}`;
          window.location.href = iosUrl;
        } catch (error) {
          try {
            // Try safari old way
            const iosOldUrl = `com-apple-mobilesafari-tab:${url}`;
            window.location.href = iosOldUrl;
          } catch (error) {
            try {
              // Try google chrome
              const chromeUrl = `googlechrome://${url?.replace("https://", "")?.replace("http://", "")}`;
              window.location.href = chromeUrl;
            } catch (error) {
              try {
                // Try google chrome
                const firefoxUrl = ` firefox://open-url?url=${url}`;
                window.location.href = firefoxUrl;
              } catch (error) {
                try {
                  // Try google chrome
                  const firefoxUrl = ` firefox://open-url?url=${url}`;
                  window.location.href = firefoxUrl;
                } catch (error) {
                  const iosSearchUrl = `x-web-search://?cicd.aitracuuluat.vn`;
                  window.location.href = iosSearchUrl;
                }
              }
            }
          }
        }
        return true;
      }
    } else if (isAndroid) {
      if (!!isWebView) {
        try {
          // try chrome
          const androidIntent = `intent://${url.replace(
            "https://",
            ""
          )}#Intent;scheme=https;package=com.android.chrome;end;`;
          window.location.href = androidIntent;
        } catch (error) {
          try {
            // try chrome
            const chromeUrl = `googlechrome://navigate?url=${url}`;
            window.location.href = chromeUrl;
          } catch (error) {
            try {
              // try fireforx
              const firefoxUrl = ` firefox://open-url?url=${url}`;
              window.location.href = firefoxUrl;
            } catch (error) { }
          }
        }
        return true;
      }
    }

    return false; // Đang chạy trong trình duyệt đầy đủ
  } catch (error) {
    // console.log(error);
    return false;
  }
}

// Add helper function to format numbers with thousand separator using dot
export function formatNumberDot(num: number | string) {
  if (num === undefined || num === null) return "";
  const n = typeof num === "number" ? num : Number(num);
  if (isNaN(n)) return String(num);
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getBackUnit(visa: string) {
  return visa === "Tokutei đầu Nhật" || visa === "Kỹ sư đầu Nhật" ? "man" : "USD";
}

export function formatBackText(amount: number, visa: string) {
  const unit = getBackUnit(visa);
  if (unit === "man") {
    return `${formatNumberDot(amount)}`;
  }
  // USD: format 0k5
  if (typeof amount !== "number" || isNaN(amount)) return String(amount);
  if (amount < 1000) {
    return `0k${Math.round(amount / 100)}`;
  } else {
    const k = Math.floor(amount / 1000);
    const hundreds = Math.round((amount % 1000) / 100);
    return `${k}k${hundreds > 0 ? hundreds : ""}`;
  }
}

export function formatFee(input: any) {
  if (input > 3600) return "liên hệ";

  const k = Math.floor(input / 1000);
  const x = Math.floor((input % 1000) / 100); // Lấy phần trăm của "k" để làm số lẻ

  return `${k}k${x}`;
}


export function formatGender(input: any) {
  // if (!input?.length) {
  //   return null;
  // }
  // const validKeywords = ["nam", "nữ", "cả nam và nữ", "male", "female", "both", "MALE", "FEMALE", "BOTH"];

  // // Chuyển về chữ thường để so khớp không phân biệt hoa thường
  // const lowerInput = input.toLowerCase();

  // // Tìm tất cả từ hợp lệ có xuất hiện trong input
  // const result = validKeywords.filter(keyword => lowerInput.includes(keyword));

  // return result.join(", "); // hoặc trả về mảng `result` nếu bạn muốn giữ dạng array
  if (input === "MALE") {
    return "Nam";
  } else if (input === "FEMALE") {
    return "Nữ";
  } else if (input === "BOTH") {
    return "Cả nam và nữ";
  } else {
    return "";
  }
}


// xử lý các trường hợp tiền tệ
export function getSalaryUnitByNumber(input: any) {
  if (input > 10000) return "JPY";
  if (input > 500) return "yên/giờ";
  if (input < 100) return "man";
  return ""; // Không nằm trong các trường hợp trên
}


export function getVisaBadgeClassName(visa: string) {
  const formatedVisa = formatVisa(visa);

  let badgeClassName = 'transition-opacity opacity-100 ';
  if (formatedVisa === 'Thực tập sinh 1 năm') {
    badgeClassName += 'border-accent-green/70 bg-green-50 text-[#BDCF58]';
  } else if (formatedVisa === 'Thực tập sinh 3 Go') {
    badgeClassName += 'border-accent-green/70 bg-green-50 text-[#AFCC11]';
  } else if (formatedVisa === 'Đặc định đầu Nhật') {
    badgeClassName += 'border-accent-blue/70 bg-blue-50 text-[#009BDA]';
  } else if (formatedVisa === 'Đặc định đi mới') {
    badgeClassName += 'text-[#40B5E4]';
  } else if (formatedVisa === 'Kỹ sư, tri thức đầu Việt') {
    badgeClassName += 'border-accent-orange/70 bg-orange-50 text-[#F2B92A]';
  } else if (formatedVisa === 'Kỹ sư, tri thức đầu Nhật') {
    badgeClassName += 'border-accent-orange/70 bg-orange-50 text-[#F7B102]';
  } else if (formatedVisa?.includes("Thực tập sinh")) {
    badgeClassName += "border-accent-green/70 bg-green-50 text-accent-green";
  } else if (formatedVisa?.includes("Kỹ năng đặc định")) {
    badgeClassName += "border-accent-blue/70 bg-blue-50 text-accent-blue";
  } else if (formatedVisa?.includes("Kỹ sư, tri thức")) {
    badgeClassName += "border-accent-orange/70 bg-orange-50 text-orange-500";
  }
  return badgeClassName;
}

export function stringifyObject(obj: Record<string, any>): Record<string, string | Array<string> | null> {
  const result: Record<string, string | Array<string> | null> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value === null) {
        result[key] = null;
      } else if (value instanceof Date) {
        result[key] = formatDate(value, 'yyyy-MM-dd');
      } else if (value instanceof Array) {
        result[key] = value;
      } else {
        result[key] = String(value);
      }
    }
  }
  return result;
}

export const generateHtmlFromMarkdown = (visaDetail: string, details: { stt: string, hangMuc: string, noiDung: string }[] | null): string | null => {
  if (!details?.length || !visaDetail) return null;
  const visa = formatVisa(visaDetail);

  // Convert Markdown table to HTML table

  let tableHtml = '';
  const sttStyle = 'padding: 8px 6px; border: 1px solid #e5e7eb; text-align: center; background-color: #AFC536;';
  const cellStyle = 'padding: 8px 6px; border: 1px solid #e5e7eb;';
  details.forEach(({ stt, hangMuc, noiDung }, index) => {
    const desc = noiDung.replace(/(\*\*|__)(.*?)\1/g, "<b>$2</b>").replace(/\*(.*?)\*/g, "<i>$1</i>");
    tableHtml +=
      `<tr>
      <td style="${sttStyle}">${stt}</td>
      <td style="${cellStyle}">${hangMuc}</td>
      <td style="${cellStyle}">${desc}</td>
    </tr>`;
  });

  const fullHtml = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thông Báo Đơn Hàng: ${visa}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
          <style>
              body { font-family: 'Montserrat','Noto Sans JP', 'Arial', sans-serif; margin: 0; padding: 0; color: #111827; }
              .container { width: 100%; max-width: 794px; margin: auto; background-color: white; padding: 1rem 0 0; box-sizing: border-box; }
              h1, h2 { text-align: center; color: #111827; }
              h1 { font-size: 1.5rem; font-weight: bold; margin-bottom: 0;margin-top:0 }
              h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; margin-top:0 }
              table { width: 100%; border-collapse: collapse; font-size: 12pt;line-height:1.3rem }
              th, td { padding: 8px; border: 1px solid #e5e7eb; text-align: left; word-break: break-word; color: #111827; }
              th { background-color: #19A6DF; color: white; text-align: center; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1></h1>
              <h2>${visa}</h2>
              <table>
                  <thead>
                      <tr>
                          <th style="width:25px">STT</th>
                          <th style="width:100px">Hạng mục</th>
                          <th>Nội dung</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${tableHtml}
                      <tr>
                        <td colspan="3" style="background-color: #F2B92A; text-align: center; font-weight: bold;">MỌI THÔNG TIN KHÔNG CÓ TRONG ĐƠN HÀNG SẼ HỎI KHI PHỎNG VẤN</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </body>
      </html>
    `;

  return fullHtml;
};