# Mathematical Petal Geometry Experiment (v0.2 candidate)

Prototype: `petal-lab.html` on branch `experiment/mathematical-petal-geometry`. The released studio on `main` is unchanged.

## Hypothesis and design
A two-parameter petal surface `S(t,u)` can produce more convincing cupping, longitudinal bending and twisting than a planar baseline, while retaining real-time browser interaction. The lab shows the deliberately planar baseline at left and a curved candidate at right. Controls include cupping, bend, twist, edge undulation, seeded low-frequency variation, bloom stage and mesh resolution. A rose-like 9-petal whorl and tulip-like 6-tepal whorl provide preliminary visual tests.

## Measurements
The prototype reports mesh triangle count and synchronous geometry rebuild time. These are rough, device-dependent diagnostic measurements, not GPU benchmarks. The animation is regenerated on the CPU. Inspect visual results at bud, half-open and fully open stages on desktop and mobile. Check for mesh intersections and rendering stalls manually.

## Limitations and open problems
- The planar baseline is a simplified control, **not** the actual v0.1 production rose/tulip geometry. A true production A/B comparison remains to be built.
- The displayed curvature coloring uses finite differences of tangent directions as a *qualitative proxy*, not validated Gaussian or mean curvature.
- Bloom stage interpolates geometry and does **not** model plant tissue growth, mechanics, water pressure, or development.
- Correlated variation is deterministic but not empirically estimated from measured flowers.
- The whorl prototype does not enforce nonintersecting petals; geometry and occlusion must be reviewed before production integration.
- The diagnostic FPS display counts JavaScript animation callbacks, **not** actual GPU rendering frames. It must not be interpreted as a GPU benchmark.
- Three.js is loaded via CDN and requires an internet connection.

## Research references
1. Prusinkiewicz, P., & Lindenmayer, A. (1990). *The Algorithmic Beauty of Plants*. Springer. https://algorithmicbotany.org/papers/abop/abop.pdf (procedural plant geometry and development; conceptual background, not validation of this surface).
2. Vogel, H. (1979). A better way to construct the sunflower head. *Mathematical Biosciences*, 44(3–4), 179–189. https://doi.org/10.1016/0025-5564(79)90080-4 (phyllotaxis; relevant to the existing composite flower model, not the rose/tulip petal surface).
3. Three.js documentation: BufferGeometry and MeshStandardMaterial. https://threejs.org/docs/ (implementation API).
4. Floraison: https://github.com/Wally869/Floraison (independent conceptual reference, no code copied).

## Next validation gate
Compare screenshots of real rose and tulip specimens at multiple stages, test mobile interactions and memory usage, add genuine production geometry to the left-hand comparison, and reject or revise parameterizations that create obvious crossings. Only then integrate into the main studio.
