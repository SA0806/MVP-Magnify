//src/components/Table.jsx
import { useState } from "react"

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => {
    if (acc === null || acc === undefined) return null;

    // Handle arrays
    if (Array.isArray(acc)) {
      const index = parseInt(part);
      return acc[index] ?? null;
    }

    // Direct match
    if (acc[part] !== undefined) return acc[part];

    // FIX: underscore → dash (LLM mistake fix)
    const dashKey = part.replace(/_/g, "-");
    if (acc[dashKey] !== undefined) return acc[dashKey];

    // EXTRA: dash → underscore (just in case)
    const underscoreKey = part.replace(/-/g, "_");
    if (acc[underscoreKey] !== undefined) return acc[underscoreKey];

    return null;
  }, obj);
}

function Table({ data, columns }) {
  const [tableData] = useState(data)
  const [currentPage, setCurrentPage] = useState(0)

  const pageSize = 10

  const paginatedData = tableData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  const totalPages = Math.ceil(tableData.length / pageSize)

  if (!Array.isArray(tableData)) {
    return <div>Loading table...</div>
  }

  if (tableData.length === 0) {
    return <div>No data available</div>
  }

  return (
    <>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.label}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.label}>
                  {getNestedValue(row, col.field) ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* CLEAN PAGINATION */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage(p => Math.min(p + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </>
  )
}

export default Table

