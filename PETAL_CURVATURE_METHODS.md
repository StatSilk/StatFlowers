# Petal Lab: curvature method comparison

Published preview: https://statsilk.github.io/StatFlowers/petal-lab.html

## Color legend
- Blue: simplified flat baseline.
- Orange: original procedural shape in default mode; directional tangent-change proxy in heatmap mode.
- Green: curvature-controlled heuristic shape in default mode; cotangent-weighted discrete mean-curvature magnitude in heatmap mode.

In default shape-comparison mode, orange uses the original procedural surface and green uses a deliberately more strongly cupped, rim-folded surface. This is a heuristic shape change, not a physical deformation obtained by solving curvature equations. In heatmap mode, orange and green use the **same procedural petal mesh**; only the curvature estimation differs. The two estimates are normalized independently and must not be interpreted as comparable absolute units.

## Method
For a triangle mesh, each triangle contributes cotangents of its interior angles to weights on opposite edges. For vertex `i`, the discrete Laplace-Beltrami estimate is

`Delta x_i ≈ (1 / (2 A_i)) Σ_j (cot α_ij + cot β_ij) (x_j - x_i)`

with barycentric vertex area `A_i`. The mean-curvature magnitude is estimated as `|Delta x_i| / 2`. The implementation computes the equivalent `|Σ_j weights * (x_j-x_i)| / (4 A_i)`. It handles mesh boundaries with the available incident faces; boundaries and degenerate triangles are a source of numerical error.

This is an in-project JavaScript implementation of the standard cotangent discretization, **not an integration of geometry-processing-js or libigl**. That makes the experiment dependency-light but still requires numerical validation against known surfaces.

## References
- Meyer, M., Desbrun, M., Schröder, P., & Barr, A. H. (2003). Discrete differential-geometry operators for triangulated 2-manifolds. In *Visualization and Mathematics III*. https://doi.org/10.1007/978-3-662-05105-4_2
- Crane, K., Weischedel, C., & Wardetzky, M. (2013). Geodesics in Heat: A New Approach to Computing Distance Based on Heat Flow. *ACM Transactions on Graphics*, 32(5). (Background on discrete mesh operators; not a validation of the petal model.)
- geometry-processing-js: https://github.com/GeometryCollective/geometry-processing-js
- Three.js: https://threejs.org/docs/

## Validation still required
1. Numerically test a plane (near-zero interior mean curvature) and sphere (approximately inverse radius).
2. Inspect boundary artifacts and sensitivity to mesh resolution.
3. Compare with measured petal scans and actual production meshes.
4. Benchmark interactive rendering on mobile.

The growth animation remains illustrative, and no physically based tissue-growth simulation or collision handling is claimed.
