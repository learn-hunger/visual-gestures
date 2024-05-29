#!/bin/bash
echo "configuring..."
red='\033[0;31m X '
blue='\033[0;34m ! '
green='\033[0;32m ✔ '
reset_color='\033[0m'

git config core.hooksPath '.githooks'
echo -e "$green* changed git configuration"
cd ./.githooks
chmod +x "./pre-push"
chmod +x "./pre-commit"
chmod +x "./prepare-commit-msg"

chmod +x "./areYouSure.sh"
echo -e "$green* successfully configured "
