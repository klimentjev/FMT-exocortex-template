#!/bin/bash
# Пример окружения для задач Планировщика Windows (Git Bash).
# Скопируйте: cp iwe-task-env.example.sh iwe-task-env.sh
# Заполните пути; iwe-task-env.sh не коммитьте, если содержит секреты (добавьте в .gitignore при необходимости).

# Корень воркспейса IWE в синтаксисе Git Bash (/c/... = диск C:)
export IWE_WORKSPACE="/c/Users/CHANGE_ME/IWE"

export IWE_TEMPLATE="${IWE_WORKSPACE}/FMT-exocortex-template"
export IWE_RUNTIME="${IWE_WORKSPACE}/.iwe-runtime"

# Единый корень логов (см. docs/CURSOR-WINDOWS-IWE.md). Подкаталоги strategist/extractor создаются раннерами.
export IWE_LOG_ROOT="${IWE_WORKSPACE}/logs"
mkdir -p "$IWE_LOG_ROOT/strategist" "$IWE_LOG_ROOT/extractor" 2>/dev/null || true

# При необходимости: source ~/.profile или файл с API-ключами для Claude Code CLI (если роли вызывают claude).
# export PATH="/c/Program Files/nodejs:$PATH"
