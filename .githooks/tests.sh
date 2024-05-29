#!/bin/bash
excludeFilesArray=(".npm_colab/.LHLint.ts" ".npm_colab/functions/report-block.ts")
staged_files=()
#find ts files
while IFS= read -r line; do
    if [[ $line =~ ^[AM][[:space:]]+(.*)\.ts$ ]]; then
        filename="${BASH_REMATCH[1]}.ts"  # Extracts the filename from the regex match
        staged_files+=("$filename")
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
