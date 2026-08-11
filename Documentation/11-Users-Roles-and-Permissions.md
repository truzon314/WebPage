# Users, Roles & Permissions

Controls who can log into the CMS and what they're allowed to do once they're in.

## Inviting someone

1. **Users** → **Invite User**.
2. Fill in their **Email**, **Full name**, and pick a **Role** from the dropdown.
3. Save — leave the password field blank so it triggers an invite email with a "set your password" link, instead of you having to hand them a password directly.

This only actually **sends an email** if SMTP is set up ([12 — Settings](12-Settings.md#smtp-email)). If it isn't, the account is still created correctly, but nobody receives anything — check SMTP is working before inviting real people.

## Roles

A role is a named bundle of permissions. The system comes with several built in:

| Role | Roughly means |
|---|---|
| Super Admin | Full access to everything, including managing other users |
| Admin | Broad access, short of the most sensitive user-management actions |
| Editor | Content management (properties, blog, pages) without user/settings access |
| Author | Can write/edit content, more limited than Editor |
| Viewer | Read-only |

**Always give the narrowest role that covers what someone actually needs.** A sales agent updating listings doesn't need a role that can also manage users or SMTP credentials.

## Creating a custom role

**Roles** → **+ New Role**. Give it a name, then check off exactly which permissions it should have from the permission matrix (organized by area — Properties, Blog, Media, Settings, etc., each with its own view/create/edit/delete/publish-style permissions). This is how you'd build something narrower than the defaults, e.g. a role that can only manage the Blog and nothing else.

The built-in **Super Admin** role can't be deleted or edited down to zero permissions — that's intentional, so the CMS can never end up with nobody able to manage it.

## Editing an existing user

Click a user in the list to change their **name** or **role**. Changing someone's role takes effect immediately on their next action — they don't need to log out and back in.

## Removing access

There is currently **no button in the CMS to remove or deactivate a user** — the Users list shows an "Active/Inactive" status, but nothing in the interface actually changes it, and there's no delete option on a user's edit panel. If someone needs their access revoked (e.g. they've left the company), that currently has to be done directly by whoever manages the database — worth raising as something to add if it comes up. In the meantime, the safest workaround is changing their role to the most restricted one (Viewer) so they at least can't do damage while still logged in.
