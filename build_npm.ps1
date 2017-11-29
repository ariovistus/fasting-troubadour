rm -recurse -force dist/*
mkdir -p dist -force
docker run -v "$(pwd):/app" --entrypoint yarn sandrokeil/typescript install
docker run -v "$(pwd):/app" --entrypoint python sandrokeil/typescript versionchecker.py
docker run -v "$(pwd):/app" --entrypoint tsc sandrokeil/typescript -p . --outDir dist
docker run -v "$(pwd):/app" --entrypoint sh sandrokeil/typescript build_tsdecls_only.sh 
docker run -v "$(pwd):/app" --entrypoint npm sandrokeil/typescript pack

