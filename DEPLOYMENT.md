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
   - `OWNER_EMAIL` (optional, defaults to `smartornaments.shop@gmail.com`)
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

## PHP / MySQL Hosting

If you host this on PHP hosting or WAMP, the PHP endpoints create and use the `spo_store` MySQL database automatically. The tables used are `users`, `products`, `orders`, `contacts`, and `notifications`.

Admin login for product add/edit/delete:

```text
smartornaments.shop@gmail.com
admin123
```

Change the admin password before going live.
