import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    // ১️⃣ Body থেকে ডাটা নেওয়া
    const body = await req.json();
    const { programName, duration, date, contact, details } = body;

    if (!programName || !duration || !date || !contact || !details) {
      return new Response(
        JSON.stringify({ success: false, error: "সব ফিল্ড পূরণ করুন" }),
        { status: 400 }
      );
    }

    // ২️⃣ Dynamic Email Fetch
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/all-data/contactsection`,
      {
        cache: "no-store",
      }
    );
    const data = await res.json();

    if (!data.success || !data.groupedData?.contactsection?.data?.email) {
      return new Response(
        JSON.stringify({ success: false, error: "ইমেইল ঠিকমত পাওয়া যায়নি" }),
        { status: 500 }
      );
    }

    const useremail = data.groupedData.contactsection.data.email;
    console.log("useremail:", useremail);

    // ৩️⃣ Nodemailer সেটআপ
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: useremail,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: useremail,
      to: useremail,
      subject: `Appointment Request: ${programName}`,
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color:#047857;">নতুন অ্যাপয়েন্টমেন্ট অনুরোধ</h2>
      <p>আপনাকে জানানো হচ্ছে যে একজন নতুন অ্যাপয়েন্টমেন্ট অনুরোধ করেছেন। বিস্তারিত নিচে দেওয়া হলো:</p>
      <table style="width:100%; border-collapse: collapse; margin-top:20px;">
        <tr>
          <td style="padding:8px; font-weight:bold; background:#f0fdf4;">Program Name</td>
          <td style="padding:8px; background:#f9fafb;">${programName}</td>
        </tr>
        <tr>
          <td style="padding:8px; font-weight:bold; background:#f0fdf4;">দৈর্ঘ্য / সময়</td>
          <td style="padding:8px; background:#f9fafb;">${duration}</td>
        </tr>
        <tr>
          <td style="padding:8px; font-weight:bold; background:#f0fdf4;"></td>
          <td style="padding:8px; background:#f9fafb;">${date}</td>
        </tr>
        <tr>
          <td style="padding:8px; font-weight:bold; background:#f0fdf4;">যোগাযোগের মাধ্যম</td>
          <td style="padding:8px; background:#f9fafb;">${contact}</td>
        </tr>
        <tr>
          <td style="padding:8px; font-weight:bold; background:#f0fdf4;">বিস্তারিত</td>
          <td style="padding:8px; background:#f9fafb;">${details}</td>
        </tr>
      </table>
      <p style="margin-top:20px;">ধন্যবাদ,<br/>আপনার ওয়েবসাইট টিম</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: "অ্যাপয়েন্টমেন্ট পাঠানো হয়েছে!",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Send failed" }),
      { status: 500 }
    );
  }
}
