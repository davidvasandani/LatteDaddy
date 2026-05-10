# LatteDaddy App Logo — Design Spec

**Date:** 2026-05-10
**Status:** Approved (pending user review of this document)

## Purpose

Add a recognizable app icon and splash mark to LatteDaddy so the TestFlight build presents a finished product on the home screen and during launch. Replace the placeholder/missing-asset state that was created when icon references were stripped from `app.json` to unblock the initial EAS build.

## Concept

A single cream-colored curl on a coffee-brown→amber gradient, evoking one wisp of steam rising from a latte. Abstract geometric form (not a literal cup or bean) chosen to read modern and distinctive at 60×60px on the iOS home screen.

## Visual Specification

| Attribute | Value |
|---|---|
| Canvas | 1024×1024 px square, full-bleed (iOS rounds corners) |
| Background | Linear gradient, top-left `#D2691E` → bottom-right `#F2A65A` |
| Mark color | Cream `#FAF6F0` |
| Mark form | Single quadratic Bézier curl, ~270° counter-clockwise arc, opens toward upper-right |
| Stroke | Rounded-cap, ~80px at base tapering to ~30px at tip |
| Composition | Centered visually, with optical balance favoring slight upper-right rise |

## Deliverables

| File | Dimensions | Purpose |
|---|---|---|
| `assets/icon.png` | 1024×1024 | Primary iOS app icon |
| `assets/splash-icon.png` | 1024×1024 | Splash screen mark (Expo positions/scales it) |
| `assets/adaptive-icon.png` | 1024×1024 | Android adaptive foreground (mark only, transparent background — Android composes brown background separately) |
| `scripts/generate-logo.py` | — | Pillow script that deterministically regenerates all three assets so future tweaks are reproducible |

## App Config Changes (`app.json`)

Restore the following keys (stripped during the initial build fix):

```json
"icon": "./assets/icon.png",
"splash": {
  "image": "./assets/splash-icon.png",
  "resizeMode": "contain",
  "backgroundColor": "#D88B3D"
},
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#D2691E"
  },
  "package": "me.vasandani.lattedaddy"
}
```

Splash `backgroundColor` is `#D88B3D` — the gradient midpoint — so the splash fills cleanly until the mark loads.

## Generation Approach

Python + Pillow, no AI image generation. Deterministic and easy to iterate. The script:

1. Creates a 1024×1024 canvas
2. Paints the gradient by interpolating between the two anchor colors across the diagonal
3. Draws the curl using `ImageDraw.line()` with a variable-width path approximated by multiple short segments (PIL doesn't natively support tapered strokes — we synthesize taper by drawing decreasing-radius circles along the path)
4. Saves three PNG variants:
   - `icon.png` — full composition
   - `splash-icon.png` — same as icon (Expo handles splash framing)
   - `adaptive-icon.png` — transparent background, mark only, centered in safe zone (66% of canvas)

The script is committed alongside the assets, so any future tweak (rotation angle, stroke thickness, palette shift) is a one-line edit and a re-run.

## Validation

1. `git push origin main` triggers the existing CI/CD pipeline
2. EAS Build produces a new IPA (auto-incremented build number)
3. EAS Submit pushes to App Store Connect; Apple processes
4. New build appears in TestFlight on phone within ~10 min
5. Manual verification: home-screen icon visible, splash shows brown gradient briefly on launch, app loads normally

## Out of Scope

- Wordmark / typography ("LatteDaddy" text logo for in-app headers, marketing materials)
- Notification icons (separate spec)
- App Store screenshots, marketing assets
- iOS dark-mode icon variant (would require `userInterfaceStyle: "automatic"` + multiple icon variants in Xcode — defer)

## Risks

- **Pillow tapered stroke approximation**: may look slightly jagged at the tip. Mitigation: oversample (render at 2048×2048 then downscale with LANCZOS) to anti-alias.
- **Android adaptive icon safe zone**: the foreground gets cropped to a circle/squircle. Mitigation: keep the mark within the central 66% safe zone.
- **Splash background color mismatch**: the splash shows a solid color (`#D88B3D`) before the icon image loads. Mitigation: chose the gradient midpoint so the transition into the icon is smooth.
