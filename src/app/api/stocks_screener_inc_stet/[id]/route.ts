import { NextResponse } from "next/server";
import pool from "@/utils/db";

// GET request to fetch stock details by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const stockId = Number(params.id);
    if (!stockId) {
      return NextResponse.json(
        { message: "Stock ID is required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `SELECT * FROM stocks_screener_incomeStatement WHERE id = ?`,
      [stockId]
    );

    if (!rows) {
      return NextResponse.json({ message: "Stock not found" }, { status: 404 });
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

// PUT request to update stock details by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const stockId = Number(params.id);
    if (!stockId) {
      return NextResponse.json(
        { message: "Stock ID is required" },
        { status: 400 }
      );
    }

    const {
      Symbol,
      Revenue,
      RevenueGrowth,
      GrossProfit,
      OperatingIncome,
      NetIncome,
      EBITDA,
      EPS_Diluted,
      EPSDilutedGrowth,
    } = await req.json();

    await pool.query(
      `UPDATE stocks_screener_incomeStatement 
      SET Symbol = ?, Revenue = ?, RevenueGrowth = ?, GrossProfit = ?, OperatingIncome = ?, 
          NetIncome = ?, EBITDA = ?, EPS_Diluted = ?, EPSDilutedGrowth = ? 
      WHERE id = ?`,
      [
        Symbol,
        Revenue,
        RevenueGrowth,
        GrossProfit,
        OperatingIncome,
        NetIncome,
        EBITDA,
        EPS_Diluted,
        EPSDilutedGrowth,
        stockId,
      ]
    );

    return NextResponse.json(
      { message: "Stock updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
