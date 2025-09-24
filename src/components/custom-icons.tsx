

'use client';

import { cn } from "@/lib/utils";
import Image from "next/image";

export const ZaloIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 262 263" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M131 0C58.649 0 0 58.649 0 131C0 203.351 58.649 262 131 262C203.351 262 262 203.351 262 131C262 58.649 203.351 0 131 0ZM197.838 170.368L173.962 194.244C171.139 197.067 167.247 197.68 163.639 196.223L126.541 182.903C125.129 182.413 123.824 181.711 122.625 180.892L74.832 144.37C71.748 142.029 70.832 137.989 72.585 134.577L84.975 111.758C86.728 108.347 90.722 106.889 94.276 108.347L131.374 121.612C132.786 122.102 134.091 122.748 135.29 123.623L183.083 160.145C186.167 162.486 187.083 166.526 185.33 169.937L197.838 170.368Z" fill="#0068FF"/>
    </svg>
)

export const MessengerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 512 512" {...props}>
        <path fill="currentColor" d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.09 25.08 134.9 67.27 181.65c-4.48 25.07-14.14 74.1-23.4 103.4c-3.37 10.7-1.12 23.03 8.44 30.5c11.08 8.4 25.13 5.46 33.6-4.5c1.4-1.62 10.1-11.93 25-30.8c26.35 10.37 55.37 16.14 85.64 16.14c140.03 0 248.55-102.34 248.55-240.57C505.1 110.34 396.58 8 256.55 8zM172.5 256.5c-19.33 0-35-15.67-35-35s15.67-35 35-35s35 15.67 35 35s-15.67 35-35 35zm68 0c-19.33 0-35-15.67-35-35s15.67-35 35-35s35 15.67 35 35s-15.67 35-35 35zm100 0c-19.33 0-35-15.67-35-35s15.67-35 35-35s35 15.67 35 35s-15.67 35-35 35z" />
    </svg>
);

export const LineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
        <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248s248-111 248-248S393 8 256 8zm-2.4 399.2c-74 0-134-51.2-134-114.4c0-50.8 33.2-94.8 79.6-110.4c-20.8-31.6-32.8-69.6-32.8-109.6c0-10.8 1-21.2 2.8-31.2h169.6c2 10.4 3.2 21.2 3.2 32.4c0 40-12.4 78-33.2 109.6c46.4 15.6 79.6 59.6 79.6 110.4c-0.4 63.2-60.4 114.4-134.4 114.4zm-64.8-114.4c0 30.4 28.8 55.2 64.8 55.2s64.8-24.8 64.8-55.2s-28.8-55.2-64.8-55.2s-64.8 24.8-64.8 55.2zm-20-132.8c12.4 20 28.8 37.6 48.4 51.6c-27.2-2.8-51.6-12-71.2-24.8c10.4-20.4 26.8-37.6 46.4-50.4c-2 2-3.6 4-5.6 6zm100-34.4h-30.4c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h30.4c4.4 0 8 3.6 8 8v32c0 4.4-3.6 8-8 8zm40.8-21.6c-19.6 12.8-44 22-71.2 24.8c19.6-14 36-31.6 48.4-51.6c-2 2.4-4 4-5.6 6c10.4 12.8 26.8 30.4 46.4 50.4c-19.6 12.8-44.4 22.4-71.6 24.8c27.6-2.4 52-11.6 71.6-24.8z"/>
    </svg>
);


export const JpgIcon = ({className, ...props}: React.SVGProps<SVGSVGElement>) => (
    <svg className={cn("w-6 h-6", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#FFDDC2"/>
        <path d="M6 7H7.5L9 11L10.5 7H12V17H10.5V11L9 15H7.5L6 11V17H4.5V7H6Z" fill="#FF6B00"/>
        <path d="M14.5 17C16.9853 17 19 14.9853 19 12.5C19 10.0147 16.9853 8 14.5 8C12.0147 8 10 10.0147 10 12.5C10 14.9853 12.0147 17 14.5 17ZM14.5 15.5C16.1569 15.5 17.5 14.1569 17.5 12.5C17.5 10.8431 16.1569 9.5 14.5 9.5C12.8431 9.5 11.5 10.8431 11.5 12.5C11.5 14.1569 12.8431 15.5 14.5 15.5Z" fill="#FF6B00"/>
        <path d="M20 7H22V15.5H20V7Z" fill="#FF6B00"/>
    </svg>
);

export const PdfIcon = ({className, ...props}: React.SVGProps<SVGSVGElement>) => (
    <svg className={cn("w-6 h-6", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#FFC2C2"/>
        <path d="M6.5 7H11C12.3807 7 13.5 8.11929 13.5 9.5V9.5C13.5 10.8807 12.3807 12 11 12H8V7" stroke="#FF0000" strokeWidth="1.5"/>
        <path d="M8 12V17" stroke="#FF0000" strokeWidth="1.5"/>
        <path d="M15.5 17C17.433 17 19 15.433 19 13.5V10.5C19 8.567 17.433 7 15.5 7C13.567 7 12 8.567 12 10.5V13.5C12 15.433 13.567 17 15.5 17Z" stroke="#FF0000" strokeWidth="1.5"/>
        <path d="M22 7V17H20.5" stroke="#FF0000" strokeWidth="1.5"/>
    </svg>
);

export const VnFlagIcon = (props: React.SVGProps<SVGSVGElement> & { width?: number, height?: number }) => (
  <Image src="/img/vietnamflag.png" alt="Vietnam Flag" width={props.width || 20} height={props.height || 20} className={props.className} />
);

export const JpFlagIcon = (props: React.SVGProps<SVGSVGElement> & { width?: number, height?: number }) => (
    <Image src="/img/japanflag.png" alt="Japan Flag" width={props.width || 20} height={props.height || 20} className={props.className} />
);

export const EnFlagIcon = (props: React.SVGProps<SVGSVGElement> & { width?: number, height?: number }) => (
    <Image src="/img/britishflag.png" alt="English Flag" width={props.width || 20} height={props.height || 20} className={props.className} />
);

export const PayPayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M21.1716 19.31H16.2216L10.0216 2.45996H15.0916L18.6916 14.86L22.2916 2.45996H27.2416L21.1716 19.31Z" fill="#D90000"/>
        <path d="M36.088 19.31H31.138L24.938 2.45996H30.008L33.608 14.86L37.208 2.45996H42.158L36.088 19.31Z" fill="#D90000"/>
        <path d="M52.0129 2.45996H44.6029V19.31H49.4929V10.22L53.9429 19.31H59.5929L53.5829 8.28996L58.9929 2.45996H52.0129Z" fill="#D90000"/>
    </svg>
);

export const LinePayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M0 0H40V20H0V0Z" fill="#00B900"/>
        <path d="M7.74 5.9H9.76V14.1H7.74V5.9ZM11.1 5.9H13.12V12.4H16.14V5.9H18.16V14.1H11.1V5.9ZM23.33 5.9C24.89 5.9 25.99 6.79 25.99 8.35V11.65C25.99 13.21 24.89 14.1 23.33 14.1H20V5.9H23.33ZM23.33 12.4H22.02V7.6H23.33C24.03 7.6 24.43 7.9 24.43 8.64V11.36C24.43 12.1 24.03 12.4 23.33 12.4ZM32.06 5.9H34.4L31.32 10.3L34.52 14.1H32.14L30.2 11.26L28.26 14.1H25.9L28.98 9.76L26.24 5.9H28.62L30.2 8.34L32.06 5.9Z" fill="white"/>
    </svg>
);
