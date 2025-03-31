import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // 1) Parse JSON from the incoming request
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id"); // Get the token from the query parameters

  try {
    // 2) Fetch your WordPress endpoint
    const response = await fetch(
      `https://rented123.com/wp-json/authenticate/v1/check-user-subscription/?user_id=${userId}`
    );

    // 3) Handle non-OK response

    if (!response.ok) {
      const errorBody = await response.json();
      return NextResponse.json(
        {
          message:
            errorBody.message ||
            "Could not verify subscription. Please try again later.",
          success: false,
        },
        { status: response.status || 500 }
      );
    }

    // 4) Parse the successful JSON and return it
    const result = await response.json();
    const res = NextResponse.json({
      success: true,
      subscription_id: result.subscription_id,
    });

    return res;
  } catch (err) {
    console.error("Could not verify subscription", err);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
