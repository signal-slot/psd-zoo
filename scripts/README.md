# PSD Generation Scripts

Scripts for generating the PSD test files using Adobe Photoshop's COM automation.

## Prerequisites

1. **Adobe Photoshop 2026** (or compatible version) installed and running
2. **Roboto fonts** installed (Regular, Bold, Italic): https://fonts.google.com/specimen/Roboto
3. **Windows** with PowerShell (scripts use COM automation)

## Quick Start

```powershell
# Start Photoshop first, then run:
powershell -ExecutionPolicy Bypass -File run_all.ps1
```

## Running Individual Scripts

```powershell
# Run a specific generation script
powershell -ExecutionPolicy Bypass -File run_all.ps1 -Script gen_batch3.jsx
```

## Scripts

| Script | Description |
|--------|-------------|
| `create_psd.jsx` | Initial PSD files: bit depths, opacity, blend modes, groups, effects, masks, adjustments, text |
| `create_psd_remaining.jsx` | Additional blend modes and basic features |
| `create_all_psd.jsx` | Comprehensive set: layer properties, text formatting, shapes, smart objects |
| `create_remaining2.jsx` | Remaining layer variations |
| `create_final.jsx` | Final initial batch |
| `create_emoji.jsx` | Emoji text layer |
| `gen_text.jsx` | Text layer variations: alignment, caps, baseline, scaling, anti-aliasing |
| `gen_fill.jsx` | Fill layers: gradients (linear, radial, angle, diamond, reflected), pattern, solid color |
| `gen_adj.jsx` | Adjustment layers: all types with various parameters |
| `gen_extra1.jsx` | Extra features: layer transforms, paths, complex layouts |
| `gen_shapes.jsx` | Shape variations: rectangles, ellipses, strokes, path operations |
| `gen_deep.jsx` | Deep nesting, many layers, stress tests, mask variants |
| `gen_effects2.jsx` | More effects: satin, bevel styles, glow variants, drop shadow options |
| `gen_text2.jsx` | More text: warp styles, paragraph formatting, mixed fonts, hyphenation |
| `gen_misc2.jsx` | Miscellaneous: blend-if, knockout, layer comps, guides, color modes |
| `gen_adj2.jsx` | More adjustments: channel mixer, fill layers, per-channel adjustments |
| `gen_more.jsx` | Additional: smart filters, ICC profiles, 32-bit, gradient masks, vector masks |
| `gen_batch1.jsx` | Batch 1: group masks, rasterized layers, paths, filters, text formatting, bevel techniques |
| `gen_batch2.jsx` | Batch 2: rounded rects, artboards, indexed/multichannel modes, color tags, smart filter stack |
| `gen_batch3.jsx` | Batch 3: feathered masks, gradients, alpha channels, transforms, adjustments |
| `gen_batch4.jsx` | Batch 4: vertical text, shapes, smart objects, clipping chains, layer comps, 300 DPI, CMYK |
| `gen_batch5.jsx` | Batch 5: styled layers, effects, multicolor text, ICC profiles, transparency |
| `gen_test.jsx` | Minimal test for verifying COM connectivity |
| `run_all.ps1` | PowerShell runner script for executing all JSX scripts via COM automation |
