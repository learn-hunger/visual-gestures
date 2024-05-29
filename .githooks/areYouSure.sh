#!/usr/bin/env bash

# Check that we want to commit.

read -p "Are you sure you want to commit this (y/n)? " answer
case ${answer:0:1} in
    y|Y )
        exit 0 # If yes, success!
    ;;
    * )
        exit 1 # If no, sorry yo.
    ;;
esac