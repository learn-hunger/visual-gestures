#!/bin/bash
excludeFilesArray=(".npm_colab/.LHLint.ts" ".npm_colab/functions/report-block.ts")
staged_files=()
prettier_command="npx prettier"

red='\033[0;31m X '
blue='\033[0;34m ! '
green='\033[0;32m ✔ '
yellow='\033[0;33m ⚠️ '
reset_color='\033[0m'

code_guidelines_success="$green* code guidelines tests check succeded$reset_color"
code_formatting_success="$green* code formatting tests check succeded$reset_color"
code_formatting="checking code formatting..."
code_formatting_check="$yellow* formatting code ,please add changes and commit again$blue"
#find ts files
while IFS= read -r line; do
    if [[ $line =~ ^[AM][[:space:]]+(.*\.(ts|tsx))$ ]]; then
        filename="${BASH_REMATCH[1]}"  # Extracts the filename from the regex match
        staged_files+=("$filename")
    fi
    if [[ $line =~ ^[AM][[:space:]]+(.*\.([a-z]+))$ ]];then
        prettier_file="${BASH_REMATCH[1]}"
        prettier_command+=" '$prettier_file'"
    fi
    
done < <(git status --porcelain)
# cd ../
linting_command="ts-node ./.npm_colab/index.ts"
# excludeFiles=$(ts-node ./.npm_colab/.LHLint.ts)
# excludeFiles=${excludeFiles#\"}   # Remove leading double quote
# excludeFiles=${excludeFiles%\"}   # Remove trailing double quote

# # Parse the JSON array into Bash array
# IFS=',' read -ra excludeFilesArray <<< "$excludeFiles"

# Use the parsed data in Bash script
for file in "${staged_files[@]}"; do
    exclude=false
    for excluded_file in "${excludeFilesArray[@]}"; do
        if [[ "$file" == "$excluded_file" ]]; then
            exclude=true
            break
        fi
    done
    # prettier_command+="'$file' "
    # Append file to linting_command if not excluded
    if ! $exclude; then
        linting_command+=" '$file'"
    fi
done
# echo $linting_command
eval "$linting_command"
lint_exit_status=$?

# Check the exit status of the TypeScript linting process
if [ $lint_exit_status -ne 0 ]; then
    exit 1
fi
echo -e "${code_guidelines_success}"


echo -e "${code_formatting}"
prettier_check="$prettier_command"" --check"
eval "$prettier_check" >/dev/null 2>&1
prettier_check_status=$?
if [ $prettier_check_status -ne 0 ]; then
    echo -e "${code_formatting_check}"
    prettier_command+=" --write"
    eval "$prettier_command"
    exit 1
fi

echo -e "${code_formatting_success}"