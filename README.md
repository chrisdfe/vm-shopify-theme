# Valerie Madison Shopify Theme

## Things you need installed

- Make sure you have `node.js` and `yarn` installed locally. There are many resources on the internet explaining how to install them.
- To sync this local copy of the theme with shopify I use shopify's [theme kit](https://shopify.dev/docs/themes/tools/theme-kit) command line tool.

## Getting started

1. After installing the required node, yarn, and themekit you'll need to run `yarn install` to install node dependencies. After that you should be good to go.
2. Whenever starting on a new theme, this is the process:
  1) create a new theme in the shopify UI.
  2) In your terminal, run `theme get --list` to get a list of all current themes. You should see your new theme in the list. It should look like this:
  `[120288542774] my new theme I just made`
  copy the number between the `[` and `]`. That is the `themeId`.
  3) `theme get -t {themeId}` to switch  

## Development workflow

1. Open up your terminal.
2. In one panel or tab run: `yarn assets:watch`. This will watch for changes in your `src` folder and compile them into the `assets` folder automatically
3. In one panel or tab terminal run: `theme watch`. This will watch for changes to your shopify theme files and upload them to shopify automatically
4. Work on your shopify theme!

## Project structure

The only difference between this and any other shopify theme is the `src` folder. Typescript & SCSS source files live in the `src` folder and get compiled into the `assets` folder. Edit the files in `src`, not `assets`.

- Typescript gets compiled into `assets/vm-sections.js`
- SCSS gets compiled into `assets/styles.css`.

There is another folder in there called `icons` - it contains a bunch of `svg` files. Add or update icons in here, and then run `yarn create-snippets-from-svgs` to generate liquid snippets out of them. For example, `icons_bag.svg` can be used in your liquid templates with `{% render "icon.bag" %}`. I found this helpful, but you may not. It's up to you

The configuration for this build process is in `rollup.config.js` if you're curious
