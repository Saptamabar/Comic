import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const docRef = await adminDb.collection("web_settings").doc("homepage").get();
        if (docRef.exists) {
            return NextResponse.json(docRef.data());
        }
        return NextResponse.json({});
    } catch (error: any) {
        console.error("Error fetching web_settings:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
