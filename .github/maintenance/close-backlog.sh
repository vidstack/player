#!/usr/bin/env bash
# Close every open non-security issue and PR in vidstack/player with the maintenance messages.
# Run from the repository root. Dry run by default: DRY_RUN=0 .github/maintenance/close-backlog.sh
# to act. KEEP="1234 5678" leaves those numbers open.
set -euo pipefail

REPO=vidstack/player
DRY_RUN=${DRY_RUN:-1}
KEEP=" ${KEEP:-} "
ISSUE_MSG=$(cat .github/maintenance/issue.md)
PR_MSG=$(cat .github/maintenance/pull-request.md)

for n in $(gh issue list -R "$REPO" --state open --limit 1000 --json number,labels --jq '.[] | select(all(.labels[]; .name != "security")) | .number'); do
  [[ "$KEEP" == *" $n "* ]] && { echo "keep issue #$n"; continue; }
  echo "close issue #$n"
  if [[ "$DRY_RUN" == 0 ]]; then
    gh issue close "$n" -R "$REPO" --reason "not planned" --comment "$ISSUE_MSG"
    sleep 1
  fi
done

for n in $(gh pr list -R "$REPO" --state open --limit 1000 --json number,labels --jq '.[] | select(all(.labels[]; .name != "security")) | .number'); do
  [[ "$KEEP" == *" $n "* ]] && { echo "keep PR #$n"; continue; }
  echo "close PR #$n"
  if [[ "$DRY_RUN" == 0 ]]; then
    gh pr close "$n" -R "$REPO" --comment "$PR_MSG"
    sleep 1
  fi
done
