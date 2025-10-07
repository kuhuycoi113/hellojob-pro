
'use client';

/**
 * @fileoverview Tool to generate SEO keyword ideas for handbook articles.
 * This script is intended for internal use by content creators.
 * To use, open the browser's developer console and run `generateKeywords()`.
 * The output will be logged to the console for easy copying.
 */

import { visaDetailsByVisaType, japanJobTypes, allSpecialConditions } from './visa-data';
import { industriesByJobType, allIndustries } from './industry-data';
import { japanRegions } from './location-data';

// --- TEMPLATES FOR KEYWORD GENERATION ---

// General templates that can be combined with almost any industry or visa type
const generalTemplates = [
    "hướng dẫn xin visa {topic}",
    "thủ tục {topic} mới nhất",
    "kinh nghiệm phỏng vấn {topic}",
    "lương {topic} tại nhật",
    "công việc ngành {topic} là gì",
    "có nên đi {topic} không",
    "điều kiện đi {topic}",
    "so sánh {topic} và {topic2}",
    "top công ty {topic} uy tín",
    "chi phí đi {topic} hết bao nhiêu",
];

// Location-based templates
const locationTemplates = [
    "việc làm {topic} tại {location}",
    "chi phí sinh hoạt ở {location}",
    "cộng đồng người Việt ở {location}",
    "top công ty {topic} tại {location}",
];

// --- HELPER FUNCTIONS ---

function applyTemplate(template: string, replacements: { [key: string]: string }): string {
    let result = template;
    for (const key in replacements) {
        result = result.replace(`{${key}}`, replacements[key]);
    }
    return result;
}

function generateCombinations(list1: string[], list2: string[]): string[][] {
    if (!list1.length || !list2.length) return [];
    const combinations: string[][] = [];
    for (const item1 of list1) {
        for (const item2 of list2) {
            if (item1 !== item2) { // Avoid comparing the same thing
                combinations.push([item1, item2]);
            }
        }
    }
    return combinations;
}


// --- CORE GENERATION LOGIC ---

/**
 * Generates SEO keywords based on predefined data.
 * @returns An object containing categorized keyword lists.
 */
export function generateKeywords() {
    const keywords = {
        generalByVisa: new Set<string>(),
        generalByIndustry: new Set<string>(),
        locationBased: new Set<string>(),
        comparison: new Set<string>(),
        longTail: new Set<string>(),
    };

    const allVisaDetails = Object.values(visaDetailsByVisaType).flat();
    const allVisaNames = [...japanJobTypes.map(v => v.name), ...allVisaDetails.map(d => d.name.vi)];
    const allIndustryNames = allIndustries.map(i => i.name.vi);
    const allRegionNames = japanRegions.map(r => r.name);

    // 1. General keywords by Visa Type
    for (const visa of allVisaNames) {
        for (const template of generalTemplates) {
            if (!template.includes("{topic2}")) {
                keywords.generalByVisa.add(applyTemplate(template, { topic: visa }));
            }
        }
    }

    // 2. General keywords by Industry
    for (const industry of allIndustryNames) {
        for (const template of generalTemplates) {
            if (!template.includes("{topic2}")) {
                 keywords.generalByIndustry.add(applyTemplate(template, { topic: industry }));
            }
        }
    }
    
    // 3. Location-based keywords
    for (const industry of allIndustryNames) {
        for (const location of allRegionNames) {
            for (const template of locationTemplates) {
                keywords.locationBased.add(applyTemplate(template, { topic: industry, location }));
            }
        }
    }

    // 4. Comparison keywords
    const visaComparisonPairs = generateCombinations(japanJobTypes.map(v => v.name), japanJobTypes.map(v => v.name));
    for (const [topic1, topic2] of visaComparisonPairs) {
        keywords.comparison.add(applyTemplate("so sánh {topic} và {topic2}", { topic: topic1, topic2: topic2 }));
    }

    // 5. Long-tail keywords from special conditions
    const longTailTopics = ['việc làm', 'đơn hàng'];
    for (const topic of longTailTopics) {
        for (const condition of allSpecialConditions) {
            keywords.longTail.add(`${topic} ${condition.name.toLowerCase()}`);
            for (const industry of allIndustryNames.slice(0,5)) { // Limit combinations
                 keywords.longTail.add(`${topic} ${industry.toLowerCase()} ${condition.name.toLowerCase()}`);
            }
        }
    }


    const output = {
        "----- Từ khóa chung theo VISA -----": Array.from(keywords.generalByVisa),
        "----- Từ khóa chung theo NGÀNH NGHỀ -----": Array.from(keywords.generalByIndustry),
        "----- Từ khóa theo ĐỊA ĐIỂM -----": Array.from(keywords.locationBased),
        "----- Từ khóa SO SÁNH -----": Array.from(keywords.comparison),
        "----- Từ khóa ĐUÔI DÀI (Long-tail) -----": Array.from(keywords.longTail),
    };

    console.log("=====================================================================");
    console.log(" COPY VÀ DÁN DANH SÁCH TỪ KHÓA SEO VÀO FILE EXCEL/GOOGLE SHEETS");
    console.log("=====================================================================");
    
    // Log each category separately
    for (const [category, keywordList] of Object.entries(output)) {
        console.log(`\n\n${category}`);
        console.log(keywordList.join('\n'));
    }

    const total = Object.values(output).reduce((sum, list) => sum + list.length, 0);
    console.log(`\n\n=====================================================================`);
    console.log(` TỔNG CỘNG: ${total} từ khóa đã được tạo. `);
    console.log(`=====================================================================`);

    return output;
}

// You can make this function available in the browser console for easy access
if (typeof window !== 'undefined') {
  (window as any).generateKeywords = generateKeywords;
}

