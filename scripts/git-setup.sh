#!/bin/bash
# Git setup script for better performance and workflow

echo "Setting up Git aliases and configuration for better performance..."

# Performance optimizations
git config --global core.preloadindex true
git config --global core.fscache true
git config --global gc.auto 256

# Useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Quick commit and push
git config --global alias.acp '!f() { git add . && git commit -m "$1" && git push; }; f'

# Better log
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

echo "Git configuration completed!"
echo "Usage examples:"
echo "  git st          # git status"
echo "  git acp 'msg'   # add, commit, push in one command"
echo "  git lg          # better log view"
