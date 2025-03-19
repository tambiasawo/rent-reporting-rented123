import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 1) Parse JSON from the incoming request
  const formData = await req.json();

  try {
    // 2) Fetch your WordPress endpoint
    const response = await fetch(
      `https://rented123.com/wp-json/authenticate/v1/check-user`,
      {
        method: "POST",
        headers: {
          // Make sure WP sees it as JSON
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Must stringify the JSON when sending in fetch
        body: JSON.stringify(formData),
      }
    );

    // 3) Handle non-OK response
    if (!response.ok) {
      const errorBody = await response.json();
      console.log({ errorBody });
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
    console.log({ result });

    const res = NextResponse.json({
      success: true,
      user_data: result.user,
      user_metadata: result.usermeta,
    });

    res.cookies.set("myapp-token", "some-session-token", {
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
