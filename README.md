# psd-zoo

A comprehensive collection of PSD (Adobe Photoshop) test files covering a wide range of Photoshop features. Created for testing PSD parser implementations, particularly [qtpsd](https://github.com/signal-slot/qtpsd).

## Overview

337 PSD files organized into 19 categories:

| Directory | Description | Files |
|-----------|-------------|-------|
| [adjustment/](adjustment/) | Adjustment layers | 22 |
| [bevel/](bevel/) | Bevel & Emboss layer effects | 8 |
| [blend_mode/](blend_mode/) | Layer blend modes | 28 |
| [canvas/](canvas/) | Canvas sizes, orientations, and backgrounds | 15 |
| [channel/](channel/) | Alpha and spot color channels | 4 |
| [color_mode/](color_mode/) | Color modes and bit depths | 16 |
| [document/](document/) | Document properties (resolution, guides, ICC profiles, etc.) | 19 |
| [effect/](effect/) | Layer effects (shadows, glows, strokes, overlays, etc.) | 27 |
| [fill/](fill/) | Fill and gradient layers | 14 |
| [filter/](filter/) | Filter effects | 9 |
| [group/](group/) | Layer groups and nesting | 17 |
| [layer/](layer/) | Layer properties (opacity, transforms, visibility, etc.) | 44 |
| [layer_comp/](layer_comp/) | Layer compositions | 5 |
| [mask/](mask/) | Layer masks, vector masks, and clipping masks | 18 |
| [misc/](misc/) | Miscellaneous test files | 3 |
| [shape/](shape/) | Shape layers and paths | 15 |
| [smart/](smart/) | Smart objects and smart filters | 9 |
| [text/](text/) | Text layers and formatting | 47 |
| [text_warp/](text_warp/) | Text warp styles | 17 |

## Features Covered

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

See [scripts/README.md](scripts/README.md) for instructions on regenerating PSD files using Adobe Photoshop's COM automation.

## Notes

- Some scripts may produce failures for certain features depending on the Photoshop version
- No Japanese text is used; emoji text is included
- All files are saved in PSD format with layers and alpha channels preserved

## License

[CC0 1.0 Universal](LICENSE) - dedicated to the public domain.
