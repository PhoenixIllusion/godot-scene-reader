pushd ..
npm run build
popd
rm -r ./node_modules/godot-scene-reader
npm install --install-links
