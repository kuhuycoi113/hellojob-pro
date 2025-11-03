import { NextRequest, NextResponse } from "next/server";
import { pagingJobsV2 } from "@/lib/elasticsearch";
import { generateJobMetaDataJobsImage } from "@/lib/meta-data-util";
import { Pager } from "@/class/pager.class";
import { convertQueryParamsToJobFilter } from "@/lib/util";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParamObj = Object.fromEntries(searchParams.entries());
    const pager = new Pager();
    pager.filter = convertQueryParamsToJobFilter(queryParamObj);
    pager.displayPerPage = 4;
    const queryResponse = await pagingJobsV2(pager);
    const totalJob = queryResponse.hits.total.value;
    const jobs = queryResponse.hits.hits.map((item: any) => ({ ...item._source }));
    const {canvas} = await generateJobMetaDataJobsImage(jobs, totalJob);
    if (!canvas) {
      return new NextResponse("Image generation failed", { status: 500 });
    }
    const buffer=canvas.toBuffer('image/jpeg')
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
