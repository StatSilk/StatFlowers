# Differential-growth petal experiment

Preview: https://statsilk.github.io/StatFlowers/petal-lab.html

## Model comparison

- **Orange:** existing procedural petal surface, with direct bending/cupping controls.
- **Green:** same starting surface with a spatially varying material growth-stretch field.
- **Heatmap mode:** curvature estimator comparison on identical procedural geometry, separate from the shape comparison.

The green model integrates a longitudinal stretch factor over the petal's base-to-tip material coordinate, using midpoint quadrature. Its transverse width is multiplied by a separate growth-stretch factor. The different stretches are embedded into a cupped surface using a bounded heuristic response.

The longitudinal stretch is

`lambda_s(q,u) = 1 + a (0.35 + 0.65 q)(1 - 0.28 u²)`

and the transverse stretch is

`lambda_u(t,u) = 1 + b (0.3 + 0.7 t)(1 - 0.18 u²)`.

Here `a` and `b` are user-controlled, stage-dependent growth amplitudes. The accumulated longitudinal material coordinate is `T(t,u) = integral_0^t lambda_s(q,u) dq`, numerically approximated using 12 midpoint intervals.

These formulas are **our experimental parameterization**, not equations copied from or fitted to a published botanical study. Their conceptual basis is differential growth and the geometry of growing sheets. This is a kinematic demonstration, not a physical thin-shell equilibrium solver. In particular, the displayed embedding does not enforce an exact target metric or solve strain compatibility.

## Scientific grounding

- Sharon, E., Roman, B., Marder, M., Shin, G.-S., & Swinney, H. L. (2002). Buckling cascades in free sheets. *Nature*, 419, 579–579. https://doi.org/10.1038/419579a
- Dervaux, J., & Ben Amar, M. (2008). Morphogenesis of growing soft tissues. *Physical Review Letters*, 101, 068101. https://doi.org/10.1103/PhysRevLett.101.068101
- Prusinkiewicz, P., & Lindenmayer, A. (1990). *The Algorithmic Beauty of Plants*. https://algorithmicbotany.org/papers/abop/abop.pdf
- Meyer, M., Desbrun, M., Schröder, P., & Barr, A. H. (2003). Discrete differential-geometry operators for triangulated 2-manifolds. https://doi.org/10.1007/978-3-662-05105-4_2

## Open source status

Three.js is used for rendering. The growth field and numerical integration are implemented in-project. **PlantGL, L-Py and geometry-processing-js have not been integrated.** A library-based thin-shell solver remains future work.

## Limitations and validation

The growth coefficients are illustrative and uncalibrated; no measurements of rose or tulip tissues were used. The geometry does not solve mechanical force balance, contact, or collisions, and no claims about predictive plant growth are warranted. The model is intended to test whether spatially varying growth is a useful control framework.

Next: compare stage-matched photographs or scans, test sensitivity to resolution, and consider integrating a physically based sheet solver if realism gains justify the mobile performance cost.
