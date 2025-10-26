#!/bin/bash
cd /home/kavia/workspace/code-generation/content-rating-feedback-panel-91857-91866/content_rating_panel_ui
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

