export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${id}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host":
            "ytstream-download-youtube-videos.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();

      return Response.json(
        {
          error,
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}