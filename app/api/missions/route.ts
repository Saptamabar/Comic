import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const snapshot = await adminDb.collection("missions").orderBy("orderIndex", "asc").get();
        const missions = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((m: any) => m.type === "explorations");
            
        return NextResponse.json(missions);
    } catch (error: any) {
        console.error("Error fetching missions:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
