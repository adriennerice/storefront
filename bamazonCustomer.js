var mysql = require("mysql");
var inquirer = require("inquirer");
const { g, b, gr, r, y } =  require('./console');
require("dotenv").config();

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.MYSQL_PASSWORD,
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    
    start();
  });
  
  function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log(res);
      connection.end();
    });
  };

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "views",
      type: "list",
      message: "Would you like the [Customer View] or [Manager View]?",
      choices: ["Customer View", "Manager View"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.views === "Customer View") {
        customerView();
      }
      else {
          console.log("manager view");
          managerView();
      }
    });
}


//function to customer view
function customerView() {
    // prompt for info about the product to purchase
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is the product ID you would like to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units of the product do you want to buy?"
      }
    ])
    .then(function(answer) {
      //console.log("ID: " + answer.id + "\nQuantity: " + answer.quantity);
        // when finished prompting, check if product quanitity is over 5 items
      connection.query("SELECT stock_quantity, price FROM products WHERE item_id =" + answer.id, function(err, result) {
        // SELECT stock_quantity FROM products WHERE item_id =" + answer.id
        if (err) throw err;
        var stockResult = result[0].stock_quantity;
        var price = result[0].price;
        console.log(stockResult);
        var stockCheck = 5;

      if (stockResult > stockCheck){
        var newStockQuantity = stockResult - answer.quantity;
        //insert a new item into the db with that info
        connection.query(
            "UPDATE products SET ? WHERE item_id =" + answer.id,
            {
                stock_quantity: newStockQuantity,
            },
            function(err) {
            if (err) throw err;

            var totalCost = answer.quantity * price;
            
            console.log(y("*****************************************************\n"));
            console.log("Thank you for your puchase!");
            console.log("The total cost of your purchase is $" + parseInt(totalCost));
            console.log("New Inventory: " + newStockQuantity);
            console.log(y("*****************************************************\n"));
            start();
            }
        );
    } else {
        console.log(y("*****************************************************\n"));
        console.log("Insufficient quantity!");  
        console.log("Current Inventory: " + stockResult);
        console.log(y("*****************************************************\n"));
        
        start();
    }  
    });
});
};

//function to manager view
function managerView() {
    // prompt for info about the product to purchase
  inquirer
    .prompt([
        {
            name: "managerViews",
            type: "list",
            message: "Select a menu option:",
            choices: ["View Products for Sale",
                      "View Low Inventory",
                      "Add to Inventory",
                      "Add New Product"]
          }
    ])
    .then(function(answer) {
      switch(answer.managerViews){
        case "View Products for Sale":
            viewSale();
            break;
        case "View Low Inventory":
            viewLowInventory();
            break;
        case "Add to Inventory":
            updateInventory();
            break;
        case "Add New Product":    
            addNewProduct();
            break;
        default:
            console.log("Select a valid selection from the managers view.");
            start();
      }
});
};

function viewSale(){
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
};

function viewLowInventory(){
  console.log("Selecting all products with an inventory less than 5 items...\n");
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
};

function updateInventory(){
    // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "Which product would you like to update the inventory?"
        },
        {
          name: "updateInventory",
          type: "input",
          message: "Additional inventory to add: "
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
        console.log(chosenItem);
        // var itemName = chosenItem.product_name;
        var newInventory = parseInt(answer.updateInventory) + parseInt(chosenItem.stock_quantity);
        console.log(newInventory);
          
          connection.query("UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newInventory
              },
              {
                product_name: chosenItem.product_name
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Product inventory was updated successfully!");
              console.log("New inventory is " + newInventory);
              start();
            }
          );
         });
  });
};

function addNewProduct() {
  inquirer
  .prompt([
    {
      name: "item",
      type: "input",
      message: "Product Name: "
    },
    {
      name: "department",
      type: "input",
      message: "Department name: "
    },
    {
      name: "price",
      type: "input",
      message: "Price",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
        name: "quantity",
        type: "input",
        message: "Quantity: "
      },
  ])
  .then(function(answer) {
    // when finished prompting, insert a new item into the db with that info
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: answer.item,
        department_name: answer.department,
        price: answer.price,
        stock_quantity: answer.quantity
      },
      function(err) {
        if (err) throw err;
        console.log("Your product was added to the inventory successfully!");
       
        start();
      }
    );
  });
};