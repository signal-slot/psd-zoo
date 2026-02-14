# psd-zoo

A comprehensive collection of PSD (Adobe Photoshop) test files covering a wide range of Photoshop features. Created for testing PSD parser implementations, particularly [qtpsd](https://github.com/signal-slot/qtpsd).

## Overview

457+ PSD files organized into 19 categories:

| Directory | Description | Files |
|-----------|-------------|-------|
| [adjustment/](adjustment/) | Adjustment layers | 38 |
| [bevel/](bevel/) | Bevel & Emboss layer effects | 12 |
| [blend_mode/](blend_mode/) | Layer blend modes | 28 |
| [canvas/](canvas/) | Canvas sizes, orientations, and backgrounds | 15 |
| [channel/](channel/) | Alpha and spot color channels | 4 |
| [color_mode/](color_mode/) | Color modes and bit depths | 24 |
| [document/](document/) | Document properties (resolution, guides, ICC profiles, etc.) | 22 |
| [effect/](effect/) | Layer effects (shadows, glows, strokes, overlays, contours) | 59 |
| [fill/](fill/) | Fill and gradient layers | 25 |
| [filter/](filter/) | Filter effects | 9 |
| [group/](group/) | Layer groups, nesting, and group effects | 22 |
| [layer/](layer/) | Layer properties (opacity, fill opacity, blend-if, etc.) | 55 |
| [layer_comp/](layer_comp/) | Layer compositions | 7 |
| [mask/](mask/) | Layer masks, vector masks, compound masks | 23 |
| [misc/](misc/) | Miscellaneous test files | 3 |
| [shape/](shape/) | Shape layers, paths, and path operations | 22 |
| [smart/](smart/) | Smart objects, smart filters, and filter blend | 13 |
| [text/](text/) | Text layers and formatting | 58 |
| [text_warp/](text_warp/) | Text warp styles | 17 |

## Features Covered

- **Color modes**: RGB, CMYK, Grayscale, Lab, Bitmap, Indexed, Multichannel, Duotone
- **Bit depths**: 8-bit, 16-bit, 32-bit
- **Blend modes**: All 27 blend modes (Normal through Luminosity, including Darker/Lighter Color)
- **Layer types**: Raster, Text, Shape, Adjustment, Fill, Smart Object, Group
- **Layer effects**: Drop Shadow, Inner Shadow, Outer Glow, Inner Glow, Bevel & Emboss (all styles including Pillow/Stroke Emboss), Satin (with contour), Color Overlay, Gradient Overlay (with offset), Stroke (inside/outside/center, solid/gradient/pattern fill), custom contour curves (ShpC/CrPt), gloss contour, multiple effect instances (dropShadowMulti/innerShadowMulti VlLs), effect noise, layer conceals, global angle override, effect scale, channel restrictions, gradient glow, uncommon blend modes in effects
- **Text features**: Fonts (Regular/Bold/Italic), alignment, warp styles (14 types), paragraph formatting, superscript/subscript, faux bold/italic, mixed styles/sizes/colors, vertical text, anti-aliasing modes, per-character tracking, baseline shift, area text (paragraph text with bounds), full justification, auto kerning (optical/metrics), hyphenation, paragraph spacing
- **Masks**: Layer masks, vector masks, dual masks, feathered masks, disabled masks, compound vector masks, vector mask feather, mask density, vector mask density, combined vector+raster masks with different density/feather
- **Adjustments**: Brightness, Levels (with output levels), Curves (multi-point), Hue/Saturation (colorize, per-color), Color Balance (per-tonal-range), Photo Filter (custom color), Gradient Map (5+ stops, Lab color stops), Posterize, Threshold, Invert, Black & White (with tint), Vibrance, Exposure, Selective Color (relative/absolute), Channel Mixer (RGB/monochrome), stacked multiple adjustments
- **Filters**: Gaussian Blur, Motion Blur, Unsharp Mask, Noise, Median, Radial Blur, Twirl, Spherize, Emboss
- **Smart filters**: Single and stacked smart filters, filter blend mode/opacity, filter mask density/feather
- **Shapes**: Rectangle, Ellipse, Rounded Rectangle (uniform/asymmetric corners), Triangle, Line, Polygon, path operations (add, subtract, intersect), vector stroke (line cap, join, custom dash), gradient fill shape, pattern fill shape
- **Paths**: Saved paths, bezier curves, multiple paths, compound paths
- **Channels**: Alpha channels, spot color channels, saved selections
- **Canvas**: Various sizes (1x1 to 4000x4000), resolutions (72-600 DPI), orientations
- **Gradients**: Linear, Radial, Angle, Reflected, Diamond, 10-stop spectral, reverse/dither, offset position, transparency stops, custom scale, noise gradients (ClNs: RGB/HSB/Lab), HSBC/Lab color stops
- **Other**: Layer comps (visibility/position/appearance), guides, color tags, clipping masks (multi-layer), linked/embedded smart objects, artboards, ICC profiles (sRGB, Adobe RGB, ProPhoto RGB), blend-if (split/feathered), fill opacity, knockout (deep/shallow), layer transforms, group effects, pass-through vs normal group blend, advanced blending (blend interior, blend clipped, transparency shapes layer, layer mask hides effects), Grayscale/CMYK/Lab documents with effects

## Fonts

All text layers use open-source fonts only:
- **Roboto-Regular**
- **Roboto-Bold**
- **Roboto-Italic**

Install these fonts before regenerating PSD files:
https://fonts.google.com/specimen/Roboto

## Regenerating PSD Files

See [scripts/README.md](scripts/README.md) for instructions on regenerating PSD files using Adobe Photoshop's COM automation.

## Notes

- Some scripts may produce failures for certain features depending on the Photoshop version
- No Japanese text is used; emoji text is included
- All files are saved in PSD format with layers and alpha channels preserved

## License

[CC0 1.0 Universal](LICENSE) - dedicated to the public domain.
