import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const postData = await request.json();

    const { gRecaptchaToken } = postData;

    // console.log(gRecaptchaToken, "gRecaptchaToken")

    let res;

    const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;
    // console.log(formData, "FOMRDATA")
    try {
        res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            cache: "no-store",
            next: { tags: ["admin"] },
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.status}`);
        }

        const responseData = await res.json();

        if (responseData.success && responseData.score > 0.5) {
            // console.log("responseData.score:", responseData.score);

            return NextResponse.json({
                success: true,
                score: responseData.score,
            });
        } else {
            return NextResponse.json({ success: false });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ success: false });
    }
}
