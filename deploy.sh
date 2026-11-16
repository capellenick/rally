#!/bin/sh
# Build Rally for GitHub Pages (https://capellenick.github.io/rally/) and push
# the built site to the gh-pages branch. Run from this folder: ./deploy.sh
set -e
export PATH="$HOME/.local/node/bin:$PATH"
npx vite build --base /rally/ --outDir dist
cd dist
touch .nojekyll
git init -q -b gh-pages
git add -A
git -c user.name="Nicholas Capelle" -c user.email="nickrc182@gmail.com" commit -q -m "Deploy Rally"
git push -f -q https://github.com/capellenick/rally.git gh-pages
rm -rf .git
echo "Pushed. Live in a minute or two at https://capellenick.github.io/rally/"
