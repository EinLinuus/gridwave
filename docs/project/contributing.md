---
title: Contributing
description: Set up the GridWave repository, run its examples, validate changes, and understand the release workflow.
---

# Contributing

GridWave is a small project: the library is implemented directly in `gridwave.js`, and the package publishes that file without a build step.

## Repository setup

Clone the repository and install the locked npm metadata:

```bash
git clone https://github.com/EinLinuus/gridwave.git
cd gridwave
npm ci
```

There are currently no runtime dependencies and no configured automated test command. `npm test` intentionally exits with an error placeholder.

## Run the examples

The examples use PHP to generate varied demo items. Start PHP's development server from the repository root:

```bash
php -S localhost:8000
```

Open [http://localhost:8000/examples/](http://localhost:8000/examples/). The index loads the local `gridwave.js`, so source changes appear without a build.

The example set covers:

- basic responsive filtering;
- fixed and dynamic columns;
- sorting and resetting sort order;
- adding and removing dynamic items;
- updating transition configuration; and
- experimental masonry.

## Make a change

Keep changes focused and preserve the framework-free, dependency-free design unless a broader direction has been agreed.

When changing public behavior:

1. Update JSDoc in `gridwave.js`.
2. Update the relevant page under `docs/`.
3. Add or adjust a focused example if the behavior benefits from visual exercise.
4. Update package version references only as part of a release decision.

Do not edit a generated bundle: `gridwave.js` is both source and published artifact.

## Validate a change

Until automated tests are added, manually exercise the smallest relevant example and include these checks when layout code changes:

- fixed and dynamic columns at multiple widths;
- numeric and two-axis gaps;
- variable-height and `sameHeight` items;
- filter application and reset;
- ascending, descending, and reset sorting;
- item addition, removal, and `rerender()`;
- breakpoint transitions around exact boundaries;
- animation enabled and disabled; and
- masonry with varied item heights, when applicable.

Inspect the container and item styles after [`destroy()`](../reference/api.md#destroy) when changing lifecycle behavior.

For documentation changes, verify YAML front matter, relative links, code samples, and claims against `gridwave.js`.

## Release process

The npm package includes only `gridwave.js`, as declared by the `files` field in `package.json`.

The current GitHub Actions workflow runs when a GitHub release is created:

1. Check out the release commit.
2. Configure Node.js 16 and the npm registry.
3. Run `npm ci`.
4. Run `npm publish` with the repository's `NPM_AUTH_TOKEN` secret.

Before creating a release, ensure the versions in `package.json` and the header of `gridwave.js` agree and that user-facing documentation describes the released behavior.

## Reporting issues

Open issues at [github.com/EinLinuus/gridwave/issues](https://github.com/EinLinuus/gridwave/issues). Include a minimal reproduction, browser details, GridWave version, configuration, and the relevant markup.
