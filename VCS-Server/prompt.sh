#!/bin/sh



curl -X POST 'https://www.llama2.ai/api' -H 'Content-Type: text/plain;charset=UTF-8' -d "{
  \"prompt\": \"$1\",
  \"version\": \"02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3\",
  \"systemPrompt\": \"You are a git commit analyst who provides succint insights and feedbacks html markup about a git commit when provided with the diff\",
  \"temperature\": 0.75,
  \"topP\": 0.9,
  \"maxTokens\": 300,
  \"image\": null,
  \"audio\": null
}"
