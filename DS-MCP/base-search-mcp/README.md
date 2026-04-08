# base-search-mcp

MCP (Model Context Protocol) server for searching and retrieving Base knowledge (FPF/SPF/ZP).

Enables Claude to:
- Search FPF-Spec.md by keyword or pattern code
- Retrieve SPF templates (pack structure)
- Check FPF version and sync status
- Automatically fetch relevant patterns when needed

## Installation

1. Copy this directory to `DS-MCP/base-search-mcp/`
2. Register in Cursor settings (Claude's MCP config)
3. Restart Cursor

## Usage from Claude

### Example 1: Search FPF by keyword

```
Claude calls: search_fpf(query="Role Method Work distinction")
Returns: Excerpt from FPF § A.7 with context
```

### Example 2: Get specific pattern

```
Claude calls: get_fpf_pattern(code="A.7")
Returns: Full definition section + examples + anti-patterns
```

### Example 3: Search SPF

```
Claude calls: search_spf(query="bounded-context", section="pack-template")
Returns: SPF pack-template/01-contract/01A-bounded-context.md
```

### Example 4: Get SPF template

```
Claude calls: get_spf_template(section="03-methods")
Returns: Method card template structure
```

## Tools

### search_fpf
- Query by keyword: `"distinction"`, `"bounded context"`
- Query by code: `"A.7"`, `"B.5"`, `"Part G"`
- Returns: Top 3 results (configurable via `limit`)

### search_spf
- Query: `"pack-template"`, `"bounded-context"`, `"failure-modes"`, etc
- Section filter: `"pack-template"`, `"process"`, `"spec"`, `"docs"`
- Returns: File names and excerpts

### get_fpf_pattern
- Code: `"A.7"`, `"A.1.1"`, `"B.5"`, `"Part G"`, etc
- Returns: Full definition section from FPF-Spec.md

### get_spf_template
- Section: `"00-manifest"`, `"01-contract"`, `"02-entities"`, `"03-methods"`, `"04-products"`, `"05-failures"`, `"06-sota"`, `"07-map"`
- Returns: Template file content

### list_fpf_parts
- No parameters
- Returns: Table of all FPF Parts with 1-line descriptions

### get_sync_status
- No parameters
- Returns: FPF version (from FPF-VERSION.txt), last sync date (from SYNC-LOG.md)

## Implementation Notes

**Backend:** Python (currently stub, needs implementation)

**Data sources:**
- FPF: `c:\Users\admin\IWE\Base\FPF\FPF-Spec.md` (search via grep/ripgrep)
- SPF: `c:\Users\admin\IWE\Base\SPF\` (recursive file listing + grep)
- Version: `c:\Users\admin\IWE\Base\FPF-VERSION.txt` and `SYNC-LOG.md`

**Caching:** None yet (can add to speed up searches)

**Error handling:** Return `{error: "Not found"}` if query matches nothing

## Integration with Layer A+B

- **Layer A (Rules):** When Rules suggest "check A.7 in Base", Claude calls MCP
- **Layer B (Skill):** base-text-lint calls MCP to fetch patterns during analysis
- **Layer C (MCP):** Provides data, never makes decisions

## TODO

- [ ] Implement Python backend (`src/server.py`)
- [ ] Add grep/ripgrep-based search
- [ ] Register MCP in Cursor settings
- [ ] Cache FPF-Spec (large file)
- [ ] Add unit tests
- [ ] Performance optimization (if needed)

---

*Created: 2026-04-03*
*Status: Ready for implementation*
