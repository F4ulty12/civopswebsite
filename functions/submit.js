export async function onRequestPost(context) {
  const data = await context.request.json();
  const webhookURL = context.env.DISCORD_WEBHOOK_URL;

  if (!webhookURL) {
    return new Response("Missing webhook", { status: 500 });
  }

  let embed = {
    title: "New Submission",
    color: 3447003,
    timestamp: new Date().toISOString(),
    fields: []
  };

  // Suggestion
  if (data.type === "suggestion") {
    embed.title = "💡 New Suggestion";
    embed.fields = [
      { name: "Name", value: data.name || "Anonymous" },
      { name: "Category", value: data.category || "N/A" },
      { name: "Suggestion", value: data.text || "N/A" }
    ];
  }

  // Commendation
  else if (data.type === "commendation") {
    embed.title = "🏅 New Commendation";
    embed.fields = [
      { name: "From", value: data.name || "Anonymous" },
      { name: "Who", value: data.who || "N/A" },
      { name: "Role", value: data.role || "N/A" },
      { name: "Reason", value: data.reason || "N/A" }
    ];
  }

  // Report
  else if (data.type === "report") {
    embed.title = "🔒 Private Report";
    embed.color = 15158332;
    embed.fields = [
      { name: "Reported User", value: data.who || "N/A" },
      { name: "Role", value: data.role || "N/A" },
      { name: "Details", value: data.reason || "N/A" },
      { name: "Evidence", value: data.evidence || "None" }
    ];
  }

  await fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [embed]
    })
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
