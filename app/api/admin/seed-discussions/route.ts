import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Discussion from "@/lib/models/Discussion";
import Problem from "@/lib/models/Problem";
import User from "@/lib/models/User";

export async function GET() {
    try {
        await connectDB();
        
        const problem = await Problem.findOne();
        const user = await User.findOne();

        if (!problem || !user) {
            return NextResponse.json({ error: "Need at least one problem and one user" }, { status: 400 });
        }

        const SEED_DISCUSSIONS = [
            {
                problemId: problem._id,
                userId: user._id,
                userName: "Rume_Admin",
                content: "Remember to consider the edge cases where the target sum is formed by the same number if duplicates are allowed (though not in this specific problem).",
            },
            {
                problemId: problem._id,
                userId: user._id,
                userName: "Code_Ninja",
                content: "The hash map approach is much more efficient than the nested loop approach. O(n) vs O(n^2).",
            }
        ];

        await Discussion.insertMany(SEED_DISCUSSIONS);

        return NextResponse.json({ success: true, message: "Sample discussions seeded!" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
