---
name: base-text-lint
description: Lint text against FPF/SPF patterns (distinctions, bounded context, methods, work products, failure modes)
argument-hint: "[text or section to analyze]"
---

# Base-Text-Lint Skill

Analyze text through FPF/SPF lens: $ARGUMENTS

## Procedure

### Step 1. Load FPF reference

Read `memory/fpf-reference.md` and load:
- A.7 (Strict Distinctions): Role, Method, Work, Scenario, Tool, Object, Model, Data, Representation
- A.1.1 (Bounded Context): term definition scope
- A.3.1/A.3.2 (Method): action vs description
- A.15.1 (Work Products): artifacts
- B.4 (Evolution Loop)
- B.5 (ADI Reasoning Cycle)
- Part G (SoTA)

### Step 2. Fast lint (30 sec per section)

For each paragraph or logical unit:

| Aspect | Check | Status |
|--------|-------|--------|
| **Distinctions** | Are Role, Method, Work clear and separate? | ✅/⚠️/❌ |
| **Bounded Context** | Are key terms defined locally? | ✅/⚠️/❌ |
| **Method form** | Is method "how-to" (action) not "what-is" (description)? | ✅/⚠️/❌ |
| **Work Product** | What artifact does this create? How verify? | ✅/⚠️/❌ |
| **ADI Cycle** | Does argument follow Abduction→Deduction→Induction? | ✅/⚠️/❌ |

### Step 3. Detailed findings

For each ⚠️ or ❌, write:

```
Finding #{N}: [Title]

Location: [paragraph/section]
Issue: [what violates FPF]
FPF code: [A.7, B.5, etc]
Example from text: "[quote]"
Recommendation: [how to fix using FPF language]
```

### Step 4. Output format

Present as structured report:

```
# Base-Text-Lint Report

**Text analyzed:** [section name]
**Date:** YYYY-MM-DD
**Lint level:** Basic / Standard / Deep

## Summary
- ✅ Distinctions: X issues
- ⚠️ Bounded Context: Y issues  
- ❌ Method form: Z issues

## Findings (sorted by severity)

### 🔴 CRITICAL

#### Finding 1: [Title]
- FPF: A.7
- Text: "[quote]"
- Issue: [explanation]
- Fix: [using FPF language]

### 🟡 WARNING

#### Finding 2: [Title]
...

## Lint Stats

| Category | Violations | FPF codes |
|----------|-----------|-----------|
| Distinctions | 2 | A.7 (2×) |
| Bounded Context | 1 | A.1.1 |
| Method form | 0 | — |
| Work Products | 0 | — |
| Reasoning | 1 | B.5 |
| **TOTAL** | **4** | — |

```

---

## Usage

**Command:** `/base-lint` or explicitly invoke

**Examples:**

- User: "check my article paragraph 1"
- You: runs this skill, outputs report

- User: "lint the Aufhebung method definition"
- You: applies Step 2-3, shows findings

---

## Special handling for philosophy

If text contains **philosophical claims**:
1. Ask: "Is this hermeneutic (descriptive) or normative (prescriptive)?"
2. Check FPF E.4 (Constitution)
3. Flag if confused

If text contains **method**:
1. Verify B.5 (ADI cycle): Abduction clear? Deduction valid? Induction confirmed?
2. Check A.3.1: "What is the action, step by step?"

If text evolves concepts:
1. Check B.4 (Evolution loop)
2. Ask: "What triggers change? Is it adaptive?"

---

*Base-Text-Lint v1 — 2026-04-03*
