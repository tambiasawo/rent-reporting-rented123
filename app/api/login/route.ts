import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 1) Parse JSON from the incoming request
  const formData = await req.json();
  try {
    // 2) Fetch your WordPress endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_BASE_API}/authenticate/v1/check-user`,
      {
        method: "POST",
        headers: {
          // Make sure WP sees it as JSON
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-By": process.env.NEXT_PUBLIC_SECRET_HEADER as string, // process.env.SECRET_HEADER as string,
          "CF-Access-Client-Id": process.env
            .NEXT_PUBLIC_CF_ACCESS_CLIENT_ID as string,
          "CF-Access-Client-Secret": process.env
            .NEXT_PUBLIC_CF_ACCESS_CLIENT_SECRET as string,
        },
        // Must stringify the JSON when sending in fetch
        body: JSON.stringify(formData),
      }
    );

    // 3) Handle non-OK response
    if (!response.ok) {
      const errorBody = await response.json();
      return NextResponse.json(
        {
          message:
            errorBody.message ||
            "Something went wrong. Please try again later.",
        },
        { status: response.status || 500 }
      );
    }

    // 4) Parse the successful JSON and return it
    const result = await response.json();
    const res = NextResponse.json({
      success: true,
      user_data: result.user,
      user_metadata: result.usermeta,
    });

    res.cookies.set("myapp-token", "user-session-token", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (err) {
    console.error("Could not fetch user", err);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
