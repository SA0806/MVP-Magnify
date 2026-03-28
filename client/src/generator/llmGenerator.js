//src/generator/llmGenerator.js
export async function generateDesignFromLLM({ prompt, schema }) {
  const res = await fetch("http://localhost:3000/llm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt, schema })
  });

  const data = await res.json();
  return data;
}

