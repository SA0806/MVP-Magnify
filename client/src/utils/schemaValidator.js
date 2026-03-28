//src/utils/schemaValidator.js
export function isValidField(schema, path) {
  const parts = path.split(".")
  let current = schema

  for (let part of parts) {
    // handle array index like "0"
    if (Array.isArray(current)) {
      current = current[0]
    }

    if (!current[part]) {
      return false
    }

    current = current[part]
  }

  return true
}

