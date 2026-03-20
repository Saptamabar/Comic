import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const snapshot = await adminDb.collection("heroes").orderBy("minPoints", "asc").get();
        const heroes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(heroes);
    } catch (error: any) {
        console.error("Error fetching heroes:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
