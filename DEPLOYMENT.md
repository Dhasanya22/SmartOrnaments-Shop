# SmartOrnaments Deployment

This project is ready for Render as a Node web service backed by MySQL.

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
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
7. Deploy the service.

The Node app creates the MySQL database and tables automatically. By default it uses:

```text
MYSQL_DATABASE=smartornaments
MYSQL_PORT=3306
```

On the first successful MySQL start, the app imports existing local `data/db.json` records into tables named `app_users`, `app_products`, `app_orders`, `app_contacts`, `app_notifications`, `app_wishlists`, `app_reviews`, and `app_meta`. Set `MYSQL_AUTO_MIGRATE=0` to skip that import.

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

Products, users, orders, sessions, wishlists, reviews, contacts, and notifications are stored in MySQL. The old `data/db.json` file is only used as a one-time migration source.

Do not share the admin password with customers.

## PHP / MySQL Hosting

If you host this on PHP hosting or WAMP, the PHP endpoints create and use the `smartornaments` MySQL database automatically. The PHP tables are `users`, `products`, `orders`, `contacts`, and `notifications`.

The Node API stores its data in the same database by default, using `app_` table names so it does not collide with the PHP tables.

Admin login for product add/edit/delete:

```text
smartornaments.shop@gmail.com
admin123
```

Change the admin password before going live.
