# Directus Schema Migration Guide

This guide explains how to use Directus Schema Snapshots to manage and deploy your data model across different environments (e.g., from Local/Development to Production).

## Overview
Directus provides a built-in schema migration tool. Instead of manually re-creating collections and fields in production, you can configure your data model once in your local environment, take a "snapshot" of the schema, and then "apply" that exact schema to your production environment.

## 1. Creating a Snapshot (Exporting the Data Model)

Once you have manually set up the `locations`, `testimonials`, and `homepage_config` collections in your local Directus instance, you can capture the schema.

Run the following command in the root directory of your Directus project:

```bash
npx directus schema snapshot ./schema.yaml
```

**What happens?**
Directus will read your entire database structure (collections, fields, relations) and export it into a file named `schema.yaml` in your project root. 
*(Note: You can also use `.json` if you prefer JSON formatting).*

**Best Practice:** Commit the `schema.yaml` file to your Git repository so your data model is version-controlled alongside your code.

## 2. Applying a Snapshot (Importing the Data Model)

When you are ready to deploy your changes to your Production or Staging server, you will take the `schema.yaml` file you generated and apply it to the target Directus instance.

First, to see what changes will be applied without actually making them (a dry run):
```bash
npx directus schema apply ./schema.yaml --dry-run
```

If everything looks correct, apply the changes for real by running:
```bash
npx directus schema apply ./schema.yaml
```

**What happens?**
Directus will compare the target database with your `schema.yaml` file. It will automatically create missing collections, add new fields, and update relationships to ensure the production database perfectly matches your local schema.

## Workflow Summary
1. **Local:** Build your schema in the Directus UI.
2. **Local:** Run `npx directus schema snapshot ./schema.yaml`.
3. **Git:** Commit and push `schema.yaml`.
4. **Production:** Pull the latest code.
5. **Production:** Run `npx directus schema apply ./schema.yaml`.
