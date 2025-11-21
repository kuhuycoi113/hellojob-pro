import { NextRequest, NextResponse } from "next/server";
import { generateJobMetaDataJobsImage } from "@/lib/meta-data-util";
import { generateJobFilter } from "@/lib/job-filter-util";
import { getJobs } from "@/actions/jobs-action";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { newFilters, sortOption } = generateJobFilter(searchParams);
    const { docs: jobs, total: totalJob } = await getJobs(newFilters, sortOption, 1, 4);
    const { canvas } = await generateJobMetaDataJobsImage(jobs, totalJob);
    if (!canvas) {
      return new NextResponse("Image generation failed", { status: 500 });
    }
    const buffer = canvas.toBuffer('image/jpeg')
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg", // hoặc webp tùy bạn
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return new NextResponse("Internal Server Error", { status: 500 }); // ✅ FIXED
  }
}
