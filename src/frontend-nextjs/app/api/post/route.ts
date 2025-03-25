export async function GET(request: Request) {
    const testObject = [{ id: 1, name: "Test!" }];

    return new Response(JSON.stringify(testObject), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
