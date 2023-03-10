#!/bin/sh

echo "Starting runServer.sh"
cd frontend-react-draft
npm run build
echo "##########################################################"
echo "Build complete"
echo "##########################################################"
cd ../server
npx ts-node src/server.ts