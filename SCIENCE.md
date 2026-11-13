# Scientific basis, assumptions and limitations

StatFlowers is an **illustrative, research-informed procedural geometry project**, not a validated biological growth simulator. The code is original and does not reproduce any paper's implementation.

## Model
- `petal-math.js` implements a reusable normalized surface-growth function, with longitudinal coordinate `t∈[0,1]`, transverse coordinate `u∈[-1,1]`, and developmental stage.
- Petal width follows a sine envelope, with deterministic variation between organs.
- Transverse cupping is proportional to `(u²−0.32) sin(0.9πt)`.
- Edge waviness is proportional to `t^2.5 |u|³`, with combined spatial harmonics. These expressions are **heuristics**, not measured growth laws.
- Rose petal tiers use separated radial shells and inward-turning distal rims. This reduces but **does not guarantee elimination of intersections**.
- Tulip geometry uses two staggered whorls of three tepals, a green juvenile stage and later pigmentation. Pigmentation timing is illustrative.
- Disc flowers use Vogel's idealized packing `r=R sqrt((i+0.5)/N)`, `θ=iα`. This models a geometric pattern, not the developmental processes that produce it.

## Research informing the design
1. Ijiri, T., Owada, S., & Igarashi, T. (2008). *A Simple Method for Simulating the Opening of Flowers*. ACM SIGGRAPH / surface-based flower opening project. https://takashiijiri.com/projects/ProjFlowerOpen/index.html . Motivates evolving petal surfaces; our code does **not** implement its mesh-energy minimization.
2. Liang, H., & Mahadevan, L. (2011). *Growth, geometry, and mechanics of a blooming lily*. PNAS. https://pmc.ncbi.nlm.nih.gov/articles/PMC3078366/ . Motivates differential-growth curvature and edge effects; no tissue mechanics are solved here.
3. van Doorn, W. G., & van Meeteren, U. (2003). *Flower opening and closure: a review*. Journal of Experimental Botany 54(389), 1801–1812. https://academic.oup.com/jxb/article/54/389/1801/534724 . Biological background on mechanisms, including temperature responses; no physiological drivers are simulated.
4. Vogel, H. (1979). *A better way to construct the sunflower head*. Mathematical Biosciences 44, 179–189. https://doi.org/10.1016/0025-5564(79)90080-4 . Mathematical origin of the spiral packing approximation.

## Known flaws / open validation tasks
- No cell-level growth, biomechanics, turgor, stress/strain, auxin transport, or developmental gene regulation.
- No reliable collision solver; high petal widths, dense rose layers and extreme opening can still intersect.
- Deterministic procedural variation is not calibrated to measurements of real petals.
- Bloom stages and color changes are not linked to physical time, temperature, light, or water.
- Real roses and tulips vary widely across species/cultivars; no cultivar-level claim is made.
- Model is not fitted to measured petal landmarks or validated against time-lapse photographs.
- Browser performance and visuals should be tested on mobile before merging.

## Suggested scientific validation
Collect licensed time-lapse and top/side reference images for identified cultivars. Measure tepal counts, petal widths, tip curvature, opening angles, intersections, and developmental trajectories. Compare predicted and observed landmarks with documented error measures. Distinguish qualitative resemblance from quantitative agreement.

## Reproducibility
The model is deterministic given flower, settings, and growth stage. The UI's Copy parameters button exports the current settings. Record application commit SHA and cultivar/reference image when reporting comparisons.
