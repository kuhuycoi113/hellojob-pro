// ✅ Tối ưu và tái cấu trúc code chính cho việc tạo ảnh metadata job và recruitment

import { createCanvas, loadImage, registerFont } from 'canvas';
import {
    findVisaByVisaDetail,
    formatBackText,
    formatFee,
    formatGender,
    formatNumberDot,
    getJobImage,
    getSalaryUnitByNumber
} from './utils';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// Constants cho cấu hình JOB và RECRUITMENT
const JOB_KEYS = [
    { key: 'code', backgroundColor: 'rgba(0,0,0,.6)', color: '#fff' },
    { key: 'visa,workLocation', backgroundColor: '#fff', color: '#FF5A00' },
    { key: 'job,numberRecruits,interviewDay', backgroundColor: '#fff', color: '#0D8DC8' },
    { key: 'specialConditions', backgroundColor: '#fff', color: '#afc536' },
    { key: 'fee', backgroundColor: '#fff', color: '#000000' },
    { key: 'realSalary', backgroundColor: '#AFC536', color: '#fff' },
    { key: 'basicSalary', backgroundColor: '#fff', color: '#0d8dc8' }
];

const RECRUITMENT_KEYS = [
    { key: 'code', backgroundColor: '#fff', color: '#2D3C6E' },
    { key: 'visaType,workLocation', backgroundColor: '#fff', color: '#E75919' },
    { key: 'jobVisa', backgroundColor: '#fff', color: '#1D91CC' },
    { key: 'age,height,weight', backgroundColor: '#fff', color: '#B1C63D', joinChar: ' - ' },
    { key: 'back,quantity', backgroundColor: '#fff', color: '#1D91CC' },
    { key: 'basicSalary', backgroundColor: '#fff', color: '#1D91CC' }
];

export const generateJobMetaDataImage = async (job: any) => {
    try {

        const props = createCanvasBase();
        const { canvas, ctx, width, height, fontSize, font400, font700, maxTextWidth } = props;
        const startX = props.startX + 15;
        // Load ảnh nền
        let avatarUrl = job.avatar?.url ?? job.avatar ?? '/img/no-image.jpg';
        if (avatarUrl.endsWith('undefined')) {
            avatarUrl = getJobImage(job.job, job.career) ?? '/img/no-image.jpg';
        }
        await drawBackgroundImage(ctx, avatarUrl, width, height);

        // return canvas.toBuffer('image/jpeg');

        let startY = 50;
        for (const { key, backgroundColor, color } of JOB_KEYS) {
            const keys = key.split(',');
            ctx.font = font400;
            switch (key) {
                case 'code': {
                    ctx.font = `700 ${fontSize * 0.80}px 'Montserrat'`;
                    const text = job.code;
                    const textWidth = ctx.measureText(text).width;
                    drawRoundedRect(ctx, startX - 15, startY - 15, textWidth + 35 + fontSize, (fontSize + 30) * 0.85, 32, backgroundColor);
                    const flag = await loadImage(`${process.env.DOMAIN}/img/flags/png/jp.png?v=191`);
                    drawImage(ctx, flag, startX + 5, startY - 2, fontSize - 7, fontSize - 7);
                    drawText(ctx, breakLine(ctx, text, maxTextWidth - fontSize - 5), color, startX + fontSize + 5, startY + 30);
                    break;
                }
                case 'realSalary': {
                    const value = keys.map(k => job[k] && job[k]).filter(Boolean).join(', ');
                    if (value) {
                        const text = `Thực lĩnh: ${formatNumberDot(value)} ${getSalaryUnitByNumber(job[key])}`;
                        let textWidth = ctx.measureText(text).width;
                        let basicSalaryWidth = 0;
                        if (job['basicSalary']) {
                            basicSalaryWidth = ctx.measureText(`Lương cơ bản: ${formatNumberDot(job['basicSalary'])} ${getSalaryUnitByNumber(job['basicSalary'])}`)?.width;
                        }
                        textWidth = textWidth > basicSalaryWidth ? textWidth : basicSalaryWidth;
                        const percent = Math.min(1, job['realSalary'] / job['basicSalary']);
                        drawRoundedRect(ctx, startX - 15, startY - 15, textWidth + 30, fontSize + 30, 10, 'rgba(175, 197, 54, 0.5)');
                        drawRoundedRect(ctx, startX - 15, startY - 15, (textWidth + 30) * percent, fontSize + 30, 10, backgroundColor);
                        drawText(ctx, breakLine(ctx, text, maxTextWidth), color, startX, startY + 39);
                    }
                    break;
                }
                case 'fee': {
                    const parts = buildFeeParts(job, color, font400, font700);
                    const fullText = parts.map(p => p.text).join('');
                    const textWidth = ctx.measureText(fullText).width;
                    if (textWidth > 0) {
                        drawRoundedRect(ctx, startX - 15, startY - 15, textWidth + 70, fontSize + 30, 10, '#fff');
                        let offsetX = startX;
                        for (const p of parts) {
                            ctx.font = p.font;
                            drawText(ctx, p.text, p.color, offsetX, startY + 39);
                            offsetX += ctx.measureText(p.text).width;
                        }
                        ctx.font = font400;
                    }
                    break;
                }
                case 'basicSalary': {
                    const firstText = 'Lương cơ bản: ';
                    const secondText = `${formatNumberDot(job['basicSalary'])} ${getSalaryUnitByNumber(job['basicSalary'])}`;
                    const firstTextWidth = ctx.measureText(firstText).width;
                    ctx.font = font700;
                    const secondTextWidth = ctx.measureText(secondText).width;
                    ctx.font = font400;
                    const textWidth = firstTextWidth + secondTextWidth;
                    drawRoundedRect(ctx, startX - 15, startY - 15, textWidth + 30, fontSize + 30, 10, backgroundColor);
                    drawText(ctx, breakLine(ctx, firstText, maxTextWidth), color, startX, startY + 39);
                    ctx.font = font700;
                    drawText(ctx, breakLine(ctx, secondText, maxTextWidth), color, startX + firstTextWidth, startY + 39);
                    break;
                }
                default: {
                    const text = keys.map(k => {
                        if (k === 'numberRecruits') return `${formatGender(job.gender)}`;
                        if (k === 'interviewDay') {
                            return job[k]?.replaceAll('-', '/') ?? null;
                        }
                        if (k === 'basicSalary') return `Lương cơ bản: ${formatNumberDot(job['basicSalary'])} ${getSalaryUnitByNumber(job['basicSalary'])}`;
                        return job[k];
                    }).filter(Boolean).join(', ');
                    if (text) {
                        const textWidth = ctx.measureText(text).width;
                        drawRoundedRect(ctx, startX - 15, startY - 15, textWidth + 30, fontSize + 30, 10, backgroundColor);
                        drawText(ctx, breakLine(ctx, text, maxTextWidth), color, startX, startY + 39);
                    }
                }
            }
            startY += 80;
        }

        return canvas.toBuffer('image/jpeg');
    } catch (err) {
        console.error(err);
        return null;
    }
};

// ⬇️ Helper Functions
const createCanvasBase = (baseWidth = 1200, baseHeight = 600) => {
    const width = Math.round(baseWidth);
    const height = Math.round(baseHeight);
    const scale = 2;
    const fontSize = 46;
    const canvas = createCanvas(width * scale, height * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.antialias = 'subpixel';
    ctx.patternQuality = 'bilinear';
    ctx.quality = 'best';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // const thinPath = path.resolve(__dirname, './fonts/Montserrat-Thin.ttf');
    // const extraLightPath = path.resolve(__dirname, './fonts/Montserrat-ExtraLight.ttf');
    const regularPath = path.resolve(__dirname, './fonts/Montserrat-Regular.ttf');
    const boldPath = path.resolve(__dirname, './fonts/Montserrat-Bold.ttf');

    console.log('Registering fonts:', {
        // thin: fs.existsSync(thinPath),
        // extraLight: fs.existsSync(extraLightPath),
        regular: fs.existsSync(regularPath),
        bold: fs.existsSync(boldPath),
    });

    // Register each file with numeric weight under family "Montserrat"
    // and also register an alias family as a fallback if weight mapping fails.
    try {
        // if (fs.existsSync(thinPath)) {
        //     registerFont(thinPath, { family: 'Montserrat', weight: '100', style: 'normal' });
        //     registerFont(thinPath, { family: 'Montserrat-Thin', weight: '400', style: 'normal' });
        // }
        // if (fs.existsSync(extraLightPath)) {
        //     registerFont(extraLightPath, { family: 'Montserrat', weight: '200', style: 'normal' });
        //     registerFont(extraLightPath, { family: 'Montserrat-ExtraLight', weight: '400', style: 'normal' });
        // }
        if (fs.existsSync(regularPath)) {
            registerFont(regularPath, { family: 'Montserrat', weight: '400', style: 'normal' });
            registerFont(regularPath, { family: 'Montserrat-Regular', weight: '400', style: 'normal' });
        }
        if (fs.existsSync(boldPath)) {
            registerFont(boldPath, { family: 'Montserrat', weight: '700', style: 'normal' });
            registerFont(boldPath, { family: 'Montserrat-Bold', weight: '400', style: 'normal' });
        }
    } catch (e) {
        console.warn('registerFont failed:', e);
    }

    // preferred font strings (use quoted family)
    // const font100 = `100 ${fontSize}px 'Montserrat'`;
    // const font200 = `200 ${fontSize}px 'Montserrat'`;
    const font400 = `400 ${fontSize}px 'Montserrat'`;
    const font700 = `700 ${fontSize}px 'Montserrat'`;

    // fallback font strings that reference explicit alias families if mapping fails
    // const font200Fallback = `${fontSize}px 'Montserrat-ExtraLight'`;
    // const font700Fallback = `${fontSize}px 'Montserrat-Bold'`;

    // set a default font (try preferred first, if not working you can switch to fallback)
    ctx.font = font400; // use "200 46px 'Montserrat'"

    return {
        canvas,
        ctx,
        width,
        height,
        fontSize,
        // return both preferred and fallback strings so calling code can choose:
        font400,
        font700,
        // font700Fallback,
        startX: 85,
        maxTextWidth: 1000
    };
};

const buildFeeParts = (job: any, color: string, font200: string, font700: string) => {
    const parts: { text: string; color: string; font: string }[] = [];
    const feeText = job.totalFee ?? job.fee ? formatFee(job.totalFee ?? job.fee) : null;
    const backText = job.back ? formatBackText(job.back, job.visa) : null;
    const quantityText = job.quantity ? `${job.quantity / 1000000}tr` : null;

    if (feeText) {
        parts.push({ text: 'Phí ', color, font: font200 });
        parts.push({ text: `${feeText}`, color: '#AFC536', font: font700 });
    }
    // if (backText) {
    //     if (parts.length) parts.push({ text: ', ', color, font: font200 });
    //     parts.push({ text: 'Back ', color, font: font200 });
    //     parts.push({ text: backText, color: '#FF5A00', font: font700 });
    // }
    // if (quantityText) {
    //     if (parts.length) parts.push({ text: ', ', color, font: font200 });
    //     parts.push({ text: 'Chỉ tiêu ', color: font200, font: font200 });
    //     parts.push({ text: quantityText, color: '#FF5A00', font: font700 });
    // }
    return parts;
};

const breakLine = (ctx: any, text: string, maxWidth: number) => {
    const original = text;
    while (ctx.measureText(text).width > maxWidth) {
        text = text.substring(0, text.length - 1);
    }
    return text + (text.length < original.length ? '...' : '');
};

const drawText = (ctx: any, text: string, color: string, x: number, y: number) => {
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
};

const drawRoundedRect = (ctx: any, x: number, y: number, w: number, h: number, r: number, bg: string) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fillStyle = bg;
    ctx.fill();
};

const drawImage = async (ctx: any, img: any, x: number, y: number, w: number, h: number) => {
    await ctx.drawImage(img, x, y, w, h);
};

const drawBackgroundImage = async (ctx: any, url: string, w: number, h: number) => {
    let img;
    try {
        img = await loadImage(url);
    } catch (e) {
        img = await loadImage(`${process.env.NEXT_PUBLIC_URL}/img/no-image.jpg`);
    }
    const dim = getScaledDimension(img.width, img.height, w, h);
    drawImage(ctx, img, (w - dim.width) / 2, (h - dim.height) / 2, dim.width, dim.height);
};

const getScaledDimension = (ow: number, oh: number, tw: number, th: number) => {
    const ratio = Math.max(tw / ow, th / oh);
    return { width: ow * ratio, height: oh * ratio };
};


export const generateJobMetaDataJobsImage = async (jobs: any[], total: number): Promise<any> => {
    try {

        let {
            canvas,
            ctx,
            width,
            height,
            fontSize,
            font400,
            font700,
        } = createCanvasBase(1200, 1200 * 317 / 563);

        const cols = 2;
        const rows = 2;
        const cardWidth = (width - 10) / cols;
        const cardHeight = (height - 10) / rows;

        const titleFontSize = 35;
        const salaryFontSize = 35;
        const titleFont = `400 ${titleFontSize}px Montserrat`;
        const salaryFont = `700 ${salaryFontSize}px Montserrat`;
        await drawRoundedRect(ctx, 0, 0, width, height, 0, '#fff')

        for (let index = 0; index < 4; index++) {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = (col * (cardWidth + 10));
            const y = (row * (cardHeight + 10));

            // ctx.save();
            // ctx.translate(x, y);
            let job;
            if (index < jobs?.length) {
                job = jobs[index];
            }
            let avatarUrl;
            if (!!job) {
                avatarUrl = job.avatar ?? `${process.env.NEXT_PUBLIC_URL}/img/no-image.jpg`;
                if (avatarUrl.endsWith('undefined')) {
                    avatarUrl = getJobImage(job.job, job.career) ?? `${process.env.NEXT_PUBLIC_URL}/img/no-image.jpg`;
                }
            } else {
                avatarUrl = `${process.env.NEXT_PUBLIC_URL}/img/no-image.jpg?v=121`;
            }
            let img;
            try {
                const response = await fetch(avatarUrl);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                // const buffer = await sharp(avatarUrl)
                //     .toFormat('jpeg')
                //     .toBuffer();
                const output = await sharp(buffer)
                    .resize(cardWidth, cardHeight, {
                        fit: 'cover', // crop ảnh cho đúng khung
                        position: 'center' // có thể là 'top', 'left', 'right', 'bottom', 'entropy', v.v.
                    })
                    .toFormat('jpeg') // hoặc .resize(), .crop(), etc
                    .toBuffer();
                img = await loadImage(output);
            } catch (e) {
                console.log(e)
                img = await loadImage(`${process.env.NEXT_PUBLIC_URL}/metadata/opengraph-image.jpg`);
            }
            // ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, sWidth, sHeight);
            await drawImage(ctx, img, x, y, cardWidth, cardHeight);

            // await drawBackgroundImage(ctx, avatarUrl, cardWidth, cardHeight);

            // Draw title (jobName + gender)
            if (!!job) {
                ctx.font = titleFont;
                ctx.fillStyle = '#0d8dc8';
                let visa = job.visa?.replace('Tokutei', 'Đặc định');
                if (visa?.length > 0) {
                    visa = breakLine(ctx, visa, 450);
                    const visaMetrics = ctx.measureText(visa);
                    let visaWidth = visaMetrics.width;
                    const visaHeight = titleFontSize + 35;
                    // Draw white rounded rect background behind title
                    drawRoundedRect(ctx, 60 + x, (cardHeight - salaryFontSize * 6.5 - 40) + y, visaWidth + 30, visaHeight, 16, '#fff');
                    ctx.fillStyle = '#0d8dc8';
                    ctx.fillText(visa, 75 + x, (cardHeight - salaryFontSize * 5.5 - 28) + y);
                }
                let title = `${job.job ?? job.career}`;
                if (!!job.workLocation) {
                    title = breakLine(ctx, title, 220);
                    title += ', ';
                    title += job.workLocation;
                    title = breakLine(ctx, title, 450);
                } else if (job.numberRecruits || job.gender) {
                    title = breakLine(ctx, title, 200);
                    title += ', ';
                    if (job.numberRecruits) {
                        title += job.numberRecruits + ' ';
                    }
                    if (!!job.gender) {
                        let formatedGender = formatGender(job.gender);
                        if (formatedGender === 'Cả nam và nữ') {
                            formatedGender = 'Người'
                        }
                        title += formatedGender;
                    }
                    title = breakLine(ctx, title, 450);
                }

                const titleMetrics = ctx.measureText(title);
                let titleWidth = titleMetrics.width;
                const titleHeight = titleFontSize + 35;
                // Draw white rounded rect background behind title
                drawRoundedRect(ctx, 60 + x, (cardHeight - salaryFontSize * 3 - 80) + y, titleWidth + 30, titleHeight, 16, '#fff');
                ctx.fillStyle = '#0d8dc8';
                ctx.fillText(title, 75 + x, (cardHeight - salaryFontSize * 2 - 68) + y);

                // Draw salary
                if (!!job['basicSalary'] || !!job['realSalary']) {
                    let salary = `Lương:`;
                    if (!!job['basicSalary']) {
                        salary += ` ${formatNumberDot(job['basicSalary'])} ${getSalaryUnitByNumber(job['basicSalary'])}`;
                    } else {
                        salary += ` ${formatNumberDot(job['realSalary'])} ${getSalaryUnitByNumber(job['realSalary'])}`;
                    }
                    ctx.font = font700;
                    ctx.fillStyle = '#FF5A00';
                    const salaryMetrics = ctx.measureText(salary);
                    const salaryWidth = salaryMetrics.width;
                    const salaryHeight = salaryFontSize + 35;
                    ctx.font = salaryFont;

                    drawRoundedRect(ctx, 60 + x, (cardHeight - salaryFontSize - 70) + y, salaryWidth - 80, salaryHeight, 16, '#fff');
                    ctx.fillStyle = '#FF5A00';
                    ctx.fillText(salary, 75 + x, (cardHeight - 58) + y);
                }
            }


            // Draw translucent overlay if it's the last block and total > 4
            if (index === 3 && total > 4) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.fillRect(x, y, cardWidth, cardHeight);
                ctx.font = font700;
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = `700 90px Montserrat`;
                ctx.fillText(`+${total - 3}`, cardWidth / 2 + x, cardHeight / 2 + y);
                ctx.textAlign = 'start';
                ctx.textBaseline = 'alphabetic';
            }
        }

        return {
            canvas,
            ctx,
            width,
            height,
            fontSize,
            font400,
            font700
        };
    } catch (err) {
        return null;
    }
};