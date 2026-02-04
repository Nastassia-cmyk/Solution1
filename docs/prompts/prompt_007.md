## Context:

    The app currently uses a hardcoded list of users in code.
    There is an existing data folder under api/src/data/.

## Goal:

    Centralize users in a JSON data file and reference them by id everywhere.

### Tasks:

## Create or update api/src/data/settings.json:

    Add a users array.
    For now, hardcode users in this file with the following fields only:
    id (number, be consistent + unique)
    name (string)
    role (string
    Do not add any extra fields.

## Update the application so that:

    The list of users is loaded from api/src/data/settings.json.
    No user list remains hardcoded in code.

## Update api/src/data/tasks.json:

    Replace assignee and author name values with the corresponding user id.
    Ensure all referenced user IDs exist in settings.json.

## Update any code that reads tasks so that:

    It correctly works with assignee and author as user IDs.
    User names are resolved via the users list when needed (e.g. for display).

## Rules:

    Do not change existing behavior or UI logic beyond what is required for this refactor.
    Necessary code changes to support user lookup by id.
    Don't create any *.md files with documentation.
    You can only expand and update the existing README.md file so that it matches the latest changes made in the project.