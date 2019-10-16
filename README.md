<h1>Bamazon App</h1>

<hr>

Author: Dolwin Fernandes

<hr>

<h3> App demo </h3>

![alt text]("Bamazon")

<hr>

<h2> Project overview</h2>
Bamazon is an Amazon-like store front that utilizes Node.js and MySQL. The app takes in orders from customers and depletes stock from the store's inventory.
<hr>

<h2> How it works </h2>

- Type `node bamazonCustomer.js` into the command line to start the app.

- The app will prompt users to enter the ID of the product they'd like to purchase, and then asks how many units they'd like to purchase.

- Once the user has placed an order, the app will check with the database to verify if the store has enough stock to meet the user's request.

- If not, the app will prevent the order from being processed and ask the user to modify their order.

- The order will be processed if there is enough stock. The SQL database will be updated to reflect the order. Once the update is successful, total purchase price will be displayed for the user.
  <hr>

<h2>Libraries and packages used</h2>

[Node.js](https://nodejs.org/en/)

[MySQL](https://www.mysql.com)

[Chalk](https://www.npmjs.com/package/chalk)

[Figlet](https://www.npmjs.com/package/figlet)

<hr></hr>
