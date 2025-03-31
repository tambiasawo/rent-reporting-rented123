import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const response = await fetch(
      "https://7c8ctvqarg.execute-api.us-west-2.amazonaws.com/submit-tenant-data",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    console.log({ responseData, response });
    if (response.ok)
      return NextResponse.json({
        success: response.ok,
        message: responseData.message,
      });
    else {
      return NextResponse.json({
        success: false,
        message: "An error occured",
      });
    }
  } catch (err) {
    console.error("Lambda error:", err);
    //res.status(500).json({ error: "Failed to call Lambda" });
  }
}
