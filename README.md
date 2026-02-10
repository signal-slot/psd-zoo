# psd-zoo

A comprehensive collection of PSD (Adobe Photoshop) test files covering a wide range of Photoshop features. Created for testing PSD parser implementations, particularly [qtpsd](https://github.com/signal-slot/qtpsd).

## Overview

337 PSD files covering:

- **Color modes**: RGB, CMYK, Grayscale, Lab, Bitmap, Indexed, Multichannel, Duotone
- **Bit depths**: 8-bit, 16-bit, 32-bit
- **Blend modes**: All 27 blend modes (Normal through Luminosity, including Darker/Lighter Color)
- **Layer types**: Raster, Text, Shape, Adjustment, Fill, Smart Object, Group
- **Layer effects**: Drop Shadow, Inner Shadow, Outer Glow, Inner Glow, Bevel & Emboss (all styles), Satin, Color Overlay, Gradient Overlay, Stroke (inside/outside/center)
- **Text features**: Fonts (Regular/Bold/Italic), alignment, warp styles (14 types), paragraph formatting, superscript/subscript, faux bold/italic, mixed styles/sizes/colors, vertical text, anti-aliasing modes
- **Masks**: Layer masks, vector masks, dual masks, feathered masks, disabled masks
- **Adjustments**: Brightness, Levels, Curves, Hue/Saturation, Color Balance, Photo Filter, Gradient Map, Posterize, Threshold, Invert, Black & White, Vibrance, Exposure, Selective Color, Channel Mixer
- **Filters**: Gaussian Blur, Motion Blur, Unsharp Mask, Noise, Median, Radial Blur, Twirl, Spherize, Emboss
- **Smart filters**: Single and stacked smart filters on smart objects
- **Shapes**: Rectangle, Ellipse, Rounded Rectangle, Triangle, Line, Polygon, with stroke and fill
- **Paths**: Saved paths, bezier curves, multiple paths
- **Channels**: Alpha channels, spot color channels, saved selections
- **Canvas**: Various sizes (1x1 to 4000x4000), resolutions (72-600 DPI), orientations
- **Other**: Layer comps, guides, color tags, clipping masks, linked layers, artboards, ICC profiles (sRGB, Adobe RGB, ProPhoto RGB), blend-if, knockout, layer transforms

## Fonts

All text layers use open-source fonts only:
- **Roboto-Regular**
- **Roboto-Bold**
- **Roboto-Italic**

Install these fonts before regenerating PSD files:
https://fonts.google.com/specimen/Roboto

## Regenerating PSD Files

### Prerequisites

1. **Adobe Photoshop 2026** (or compatible version) installed and running
2. **Roboto fonts** installed (Regular, Bold, Italic)
3. **Windows** with PowerShell (scripts use COM automation)

### Quick Start

```powershell
# Start Photoshop first, then run:
powershell -ExecutionPolicy Bypass -File run_all.ps1
```

### Running Individual Scripts

```powershell
# Run a specific generation script
powershell -ExecutionPolicy Bypass -File run_all.ps1 -Script gen_batch3.jsx
```

### Manual Execution

```powershell
# Connect to Photoshop via COM
$ps = New-Object -ComObject Photoshop.Application

# Execute a JSX script
$ps.DoJavascriptFile("C:\path\to\psd-zoo\gen_batch1.jsx")
```

## Generation Scripts

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
| `gen_batch3.jsx` | Batch 3: feathered masks, gradients, alpha channels, transforms, adjustments (posterize, threshold, invert, B&W) |
| `gen_batch4.jsx` | Batch 4: vertical text, shapes, smart objects, clipping chains, layer comps, 300 DPI, CMYK |
| `gen_batch5.jsx` | Batch 5: styled layers, effects (satin, stroke, glow), multicolor text, ICC profiles, transparency |
| `run_all.ps1` | PowerShell runner script for executing all JSX scripts via COM automation |

## Notes

- Some scripts may produce failures for certain features depending on the Photoshop version
- No Japanese text is used; emoji text is included
- All files are saved in PSD format with layers and alpha channels preserved
- The `gen_test.jsx` script is a minimal test for verifying COM connectivity

## License

The PSD files and generation scripts are provided for testing purposes.
