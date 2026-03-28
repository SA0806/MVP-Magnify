//src/App.jsx
import { useEffect, useState } from "react"
import { generateComponent } from "./generator/uiGenerator.jsx"
import { generateDesignFromLLM } from "./generator/llmGenerator"
import { resourceMap } from "./services/resourcemap"

function App() {
  const [GeneratedComponent, setGeneratedComponent] = useState(null)
  const [props, setProps] = useState({})

  useEffect(() => {
  async function buildUI() {
    const prompt = "Show study id and number of samples";

    const schema = resourceMap["studies"].schema;

    // LLM generates design
    const design = await generateDesignFromLLM({ prompt, schema }) || {
  component: "table",
  resource: "studies",
  columns: [
    { label: "ID", field: "id" }
  ]
};
    if (!design || !design.resource) {
  console.error("Invalid design from LLM:", design);
  return;
}

    const result = await generateComponent(design);

    setGeneratedComponent(() => result.component);
    setProps(result.props);
  }

  buildUI();
}, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>MGnify UI Generator MVP</h1>
      {!GeneratedComponent ? (
        <div>Loading data...</div>
      ) : (
        <GeneratedComponent {...props} />
      )}
    </div>
  )
}

export default App

