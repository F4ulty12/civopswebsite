export async function onRequestPost(context) {
  const data = await context.request.json();

  const webhookURL = context.env.DISCORD_WEBHOOK_URL;

  let embed = {
    title: "New Submission",
    color: 5814783,
    fields: [],
    timestamp: new Date().toISOString()
  };

  // Suggestion
  if (data.type === "suggestion") {
    embed.title = "💡 New Suggestion";
    embed.fields = [
      { name: "Name", value: data.name || "Anonymous" },
      { name: "Category", value: data.category },
      { name: "Suggestion", value: data.text }
    ];
  }

  // Commendation
  if (data.type === "commendation") {
    embed.title = "🏅 New Commendation";
    embed.fields = [
      { name: "From", value: data.name || "Anonymous" },
      { name: "Who", value: data.who },
      { name: "Role", value: data.role },
      { name: "Reason", value: data.reason }
    ];
  }

  // Report
  if (data.type === "report") {
    embed.title = "🔒 Private Report";
    embed.fields = [
      { name: "Reported User", value: data.who },
      { name: "Role", value: data.role },
      { name: "Details", value: data.reason },
      { name: "Evidence", value: data.evidence || "None" }
    ];
  }

  await fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] })
  });

  return new Response("OK", { status: 200 });
}
