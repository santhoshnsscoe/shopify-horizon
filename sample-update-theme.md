# Update themes

```bash
# pull changes from the main theme
git add .
shopify theme pull --store {store}.myshopify.com -t {main-themeid}
git status

# push changes to main theme
shopify theme push --store {store}.myshopify.com -t {main-themeid}
```

## Test theme

```bash
# start the test theme
shopify theme dev --store {store}.myshopify.com

# pull changes from the test theme
git add .
shopify theme pull --store {store}.myshopify.com -t {test-themeid}
git status

# push changes to main theme
shopify theme push --store {store}.myshopify.com -t {test-themeid}
```
