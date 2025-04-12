# Reproduction if Payload creating too long index names

## Steps to reproduce

1. Run `pnpm install`
2. Run `pnpm payload migrate`

## How we came here?

1. Create nested fields with additional features like localization and versioning.  
   [see this commit](https://github.com/Xiphe/payload-long-index-names/commit/5c15adf87c8f9225a9fd52971354d3cda7fc2b0d)

   This already creates conflicting index names but the error does not surface
   here (because I'm not sure where the indexes are actually used)

2. Remove some of the features that create indexes.
   [see this commit](https://github.com/Xiphe/payload-long-index-names/commit/b44db1c4fbbeed8330b0de319dab8654c7b643de)

   Here the issue surfaces as some of the index names are too long and be truncated by postgres. Thereby causing the migration to fail.
