// src/services/resourcemap.js
// MGnify MCP PoC — resource configuration store
//
// This file is the hand-written equivalent of what the MCP server will
// generate automatically via tool calls in the full GSoC implementation:
//
//   get_endpoint_schema()   → the "schema" field below
//   get_pagination_info()   → the "pagination" field below
//   get_fetch_pattern()     → the "fetcher" field below
//
// Having this as an explicit config demonstrates the abstraction layer
// described in proposal Section 4.2 — stable, human-reviewable, and
// updateable when the MGnify API evolves.

import { fetchStudies } from "./api";

export const resourceMap = {
  studies: {
    fetcher: fetchStudies,

    // Compact typed schema — mirrors what get_endpoint_schema() returns.
    // Field names use MGnify's actual hyphenated convention (e.g. samples-count).
    // This is the ground truth the LLM uses to generate correct field paths.
    schema: {
      id: "string",
      type: "string",
      attributes: {
        accession: "string",
        "bioproject-title": "string",
        "samples-count": "number",
        "last-update": "string",
        "is-public": "boolean",
        "study-abstract": "string",
      },
      relationships: {
        biomes: {
          data: [{ id: "string", type: "string" }],
        },
        samples: {
          data: [{ id: "string", type: "string" }],
        },
      },
    },

    // Pagination strategy — mirrors what get_pagination_info() returns.
    // MGnify uses JSON:API cursor-based pagination, not simple page offsets.
    pagination: {
      type: "cursor",
      nextField: "links.next",
      prevField: "links.prev",
    },

    // Relationship map — helps the LLM understand how to traverse related resources.
    relationMap: {
      biomes: {
        type: "biome",
        path: "relationships.biomes.data",
        idField: "id",
      },
      samples: {
        type: "sample",
        path: "relationships.samples.data",
        idField: "id",
      },
    },
  },

  // Stub for future extension — demonstrates the pattern is resource-agnostic
  samples: {
    fetcher: async () => ({ items: [], next: null, prev: null }),
    schema: {
      id: "string",
      attributes: {
        accession: "string",
        "sample-name": "string",
        biome: "string",
      },
    },
    pagination: { type: "cursor", nextField: "links.next", prevField: "links.prev" },
    relationMap: {},
  },
};