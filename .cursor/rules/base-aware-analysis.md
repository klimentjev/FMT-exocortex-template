# Base-Aware Text Analysis

When analyzing philosophical, methodological, or domain knowledge text:

## Trigger: User shows text or asks to analyze/review

### Pre-Analysis (always)

1. Load mental model from `memory/fpf-reference.md`:
   - **A.7: Strict Distinction** — Role ≠ Method ≠ Work ≠ Scenario ≠ Tool
   - **A.1.1: Bounded Context** — terms defined locally
   - **A.3.1 / A.3.2: Method Definition** — action vs description
   - **A.15.1: Work Products** — artifacts and verification

2. If text claims to be domain knowledge (Pack):
   - Check structure against `Base/SPF/pack-template/`
   - Bounded context? Distinctions? Methods? Failure modes?

### During Analysis

**Check these patterns:**

| Pattern | FPF Code | Check | Example |
|---------|----------|-------|---------|
| **Distinction clarity** | A.7 | Are Role, Method, Work clearly separated? | "Aufhebung is a method (action), not a description (object)" |
| **Bounded context** | A.1.1 | Terms defined locally? Scope clear? | "Within philosophy discourse, Aufhebung means..." |
| **Method vs Description** | A.3.1 | Is it "how to do" or "what is"? | "The method is: (1) identify contradiction, (2) resolve through synthesis" |
| **Work product** | A.15.1 | What artifact does this create? How verify? | "Work product: logical schema; verify by: applying to examples" |
| **Failure modes** | FPF C | What errors are common? | "Error: confuse Aufhebung with synthesis" |
| **Object vs Model** | A.7 | Real thing vs representation? | "Aufhebung (object) vs logical model of it (model)" |

### Output Format

When you find issues or patterns:

**Instead of:** "This is unclear"
**Write:** "This violates FPF A.7 — you mixed Role (thinking subject) and Method (process of thinking). Separate them: Role describes WHO (subject), Method describes HOW (process)"

**Instead of:** "Structure seems wrong"
**Write:** "Missing SPF A.1.1 (Bounded Context). Define: what are your domain boundaries? When does Aufhebung apply, when not?"

**Include FPF codes** in all recommendations: `(FPF A.7)`, `(SPF A.1.1)`, `(FPF B.5)`

### Special Rules for Philosophy Text

- **Hermeneutic vs Normative distinction** (FPF E.4):
  - Hermeneutics: interpret what exists (descriptive)
  - Normative: prescribe form for appropriation (prescriptive)
  - Check: which one is the text doing? Are they confused?

- **Reasoning cycle** (FPF B.5):
  - Abduction (hypothesis) → Deduction (logical proof) → Induction (verify)
  - Does argument follow this? Or jump steps?

- **Evolution loop** (FPF B.4):
  - Can the method adapt? What triggers evolution?
  - Check: is method rigid or adaptive?

### When User Explicitly Asks for Base Analysis

If user says: "check this through Base" or "run /base-lint" → use Skill base-text-lint

---

*Rules active: always for text analysis. Reference this when unsure about philosophical claims.*
