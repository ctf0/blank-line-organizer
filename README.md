# Blank Line Organizer

based on https://github.com/rintoj/blank-line-organizer + cleanups

## Config

```json
"blankLine.keepOneEmptyLine": true,
"blankLine.languageIds": ["*"] // use with all files
```

### Removed

- clean on save
- clean selection

### Notes

- instead of going through the document line by line to check for emptiness, we use simple regex to remove what dont need "much faster & more performant"
