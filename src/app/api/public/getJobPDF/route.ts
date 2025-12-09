import puppeteer from 'puppeteer';
import { NextRequest, NextResponse } from 'next/server';
import { Cache } from "@/lib/server-cache";
const TTL = 1000 * 60 * 60 * 12; // 30 phút
export async function POST(req: NextRequest) {
  let browser;
  try {
    const { id, htmlContent, responseType }: {
      id: string,
      htmlContent: string | null,
      responseType: 'application/pdf' | 'image/jpeg' | 'image/png'
    } = await req.json();
    const now = Date.now();
    for (const [key, value] of Cache.entries()) {
      if (value.expireAt < now) Cache.delete(key);
    }
    const cachedKey = `${id}-${responseType}`;
    console.log(cachedKey)
    const cached = Cache.get(cachedKey);
    if (cached) {
      console.log('HIT');
      return new NextResponse(cached.buffer as any, {
        status: 200,
        headers: {
          'Content-Type': responseType,
        },
      })
    }
    if (!htmlContent) {
      return new NextResponse('Thiếu nội dung HTML', { status: 400 });
    }

    // Launch a headless browser with args for container environments
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
    const page = await browser.newPage();

    // Set the HTML content of the page
    const html = htmlContent.replace('<h1></h1>', '<h1 style="margin-top:30px">THÔNG BÁO ĐƠN HÀNG</h1>')
      .replace('<body>', '<body style="padding-bottom:30px">')
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate the PDF
    switch (responseType) {
      case 'application/pdf': {
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true, // Crucial for including CSS background colors
          margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
          }
        });
        try {
          if (!!browser) {
            browser.close();
          }
        } catch (error) {
          console.log(error);
        }
        // Return the PDF as a blob
        Cache.set(cachedKey, pdfBuffer, now + TTL);
        return new NextResponse(pdfBuffer as any, {
          status: 200,
          headers: {
            'Content-Type': responseType,
          },
        });
      }
      case 'image/png':
      case 'image/jpeg': {
        const type: any = responseType.split('/')[1] ?? 'jpeg';
        const imageBuffer = await page.screenshot({
          type: type,
          fullPage: true,
        });

        try {
          if (!!browser) {
            browser.close();
          }
        } catch (error) {
          console.log(error);
        }
        Cache.set(cachedKey, imageBuffer, now + TTL);
        return new NextResponse(imageBuffer as any, {
          status: 200,
          headers: {
            'Content-Type': responseType
          },
        });

      }
    }

  } catch (error) {
    console.error('Lỗi tạo PDF:', error);
    let errorMessage = 'Lỗi không xác định';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    try {
      if (!!browser) {
        browser.close();
      }
    } catch (error) {
      console.log(error);
    }
    return new NextResponse(`Lỗi server nội bộ: ${errorMessage}`, { status: 500 });
  }
}
