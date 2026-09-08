import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "本站不接收或存储留言，请前往小红书反馈板或通过邮件联系 Patrick。" },
    { status: 410 },
  );
}
