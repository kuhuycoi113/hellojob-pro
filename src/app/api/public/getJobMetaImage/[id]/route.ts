import { NextRequest, NextResponse } from "next/server";
import { generateJobMetaDataImage } from "@/lib/meta-data-util";
import { getJobByCode } from "@/actions/job-action";
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const jobCode = id ?? null;
    if (!jobCode) {
      throw new Error("Missing jobCode parameter");
    }
    const job = await getJobByCode(jobCode);
    const buffer = await generateJobMetaDataImage(job);
    // const buffer = await makeTestImageBuffer();

    if (!buffer) {
      return new NextResponse("Image generation failed", { status: 500 });
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg", // hoặc webp tùy bạn
        "Content-Length": buffer.length.toString(),
        "Content-Disposition": "inline"
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return new NextResponse("Internal Server Error", { status: 500 }); // ✅ FIXED
  }
}
