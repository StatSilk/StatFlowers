# StatFlowers 🌸

StatFlowers is an experimental 3D botanical studio for exploring flower shapes, growth animations and the mathematics of nature, from floral symmetry to Fibonacci spirals.

## Run the app

[**Explore StatFlowers live**](https://statsilk.github.io/StatFlowers/) (GitHub Pages). The app uses a Three.js CDN and needs internet access.

The site runs directly in your browser. `index.html` is the interface, `app.js` contains the flower geometry and controls, and Three.js is loaded from a CDN. An internet connection is required.

## First public preview

See the [v0.1.0 release notes](RELEASE_NOTES_v0.1.0.md). This is an experimental preview; botanical realism is still being refined.

## Source layout

- `index.html`: interface and styling
- `app.js`: procedural flower meshes, growth stages, 3D renderer and interactions
- `CHANGELOG.md`: development history and model limitations

## Features

- Eight flower families including rose, tulip, lily, sunflower, daisy, gerbera, coneflower, poppy
- Several rose styles, inspired by natural and geometric forms
- 3D and top-down views, soft shadows, petal controls and colors
- Bud-to-bloom timeline and growth animation
- Golden-angle/Fibonacci phyllotaxis experiments for composite flower heads

## Scientific accuracy

**Experimental model:** Flower forms and bloom animations are illustrative approximations, not mathematically exact reconstructions or predictive plant biology. The golden-angle model represents idealized phyllotaxis; real flowers differ substantially in development.

## Origins

Independently implemented for StatSilk. Inspired by botanical geometry approaches such as [Floraison](https://github.com/Wally869/Floraison); this project is **not a fork** and does not include Floraison source code.

## Changes and development status

See [CHANGELOG.md](CHANGELOG.md) for updates, experimental limitations and release history. The rose-growth model currently follows illustrative development stages, not a validated cellular-growth simulation.

## License

Released under the permissive [MIT License](LICENSE). You may use, modify and redistribute the code, including commercially, provided the copyright and license notices are retained.
