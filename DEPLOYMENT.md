# SmartOrnaments Deployment

This project is ready for Render as a Node web service.

## Render Steps

1. Push this folder to a GitHub repository.
2. Open Render Dashboard.
3. Choose New > Blueprint.
4. Connect the GitHub repository.
5. Render will read `render.yaml`.
6. Enter these secret values when Render asks:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
7. Deploy the service.

After deploy, customer link will look like:

```text
https://smartornaments-shop.onrender.com/
```

Owner login:

```text
https://smartornaments-shop.onrender.com/login.html
```

Admin panel:

```text
https://smartornaments-shop.onrender.com/admin.html
```

## Important

The blueprint uses a persistent disk at `/var/data` so products, users, and orders stay saved after restarts. This requires a paid Render web service plan.

Do not share the admin password with customers.
