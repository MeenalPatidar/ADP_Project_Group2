# Todolist

Fork the repo and clone it to your local system, navigate to the root of the project and run:

`$ npm install`

This will install the required packages and initialize the project.

`$ node app.js`

This will run the app at port 3000, visit `localhost:3000` to check if it works or not.

Note: Keep the mongod process running, or it will show errors. If you want to add css, then add them in the `styles.css` file in the public folder. If you want to add more css files, then add them to the `public/css` folder and while linking the stylesheet with the page, make sure you keep the `href` as `/{filename}.css`, where {filename} is to be replaced with the filename you are using. The same rule goes for js files, if you want to add them, then create a `js` folder in `public` directory and add them there.

**Important**: Make sure you add `css` links to **header.ejs** file and `js` links to **footer.ejs** file above the `</body>` tag. These files are present in the `/views/partials` directory.

For example, if you want to add `login.css` file, then add the file in the `public/css` folder, and then open the `header.ejs` files in `/views/partials` directory and add the following line before the `title` tag:

```html
<link rel="stylesheet" href="css/login.css">
```

And for a `javascript` file, say `login.js`, create a directory `js` inside `public` folder(if it isn't there already), add the file in there, and then add the following line **before** the `</body>` line in the `footer.ejs` file in `/views/partials` directory:

```html
<script src="js/login.js">
```

Bootstrap has already been added, so if you want to use bootstrap classes, then you can directly do so.

Some useful links:

[Colorhunt](https://colorhunt.co)

[Mongoose Docs](https://mongoosejs.com/docs/api/model.html)

[Express Docs](https://expressjs.com/)
