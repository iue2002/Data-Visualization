import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

type EndpointParams = {
  params: Promise<{ endpoint?: string[] }>;
};

export async function GET(
  request: NextRequest,
  { params }: EndpointParams
) {
  const { endpoint } = await params;
  const path = (endpoint || []).join("/");
  const searchParams = request.nextUrl.search;
  
  try {
    const url = `${BACKEND_URL}/api/${path}${searchParams}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "代理请求失败", details: String(error) },
      { status: 502 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: EndpointParams
) {
  const { endpoint } = await params;
  const path = (endpoint || []).join("/");
  
  try {
    const body = await request.json();
    const url = `${BACKEND_URL}/api/${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "代理请求失败", details: String(error) },
      { status: 502 }
    );
  }
}
