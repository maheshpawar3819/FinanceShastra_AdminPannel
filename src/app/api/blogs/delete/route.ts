import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { ResultSetHeader } from "mysql2";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const confirm_delete_blog = searchParams.get("confirm_delete_blog");

    // Validate `id`
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Valid Blog ID is required" },
        { status: 400 }
      );
    }

    // Validate confirmation parameter
    if (confirm_delete_blog !== "1") {
      return NextResponse.json(
        { error: "Delete confirmation required" },
        { status: 400 }
      );
    }

    // Perform deletion
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM blogs WHERE id = ?",
      [parseInt(id)]
    );

    // Check if the blog was deleted
    if (result.affectedRows > 0) {
      return NextResponse.json(
        { success: true, message: "Blog deleted successfully!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Blog not found or already deleted." },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Error deleting blog", details: error.message },
      { status: 500 }
    );
  }
}
