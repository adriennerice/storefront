DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL auto_increment,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR (100) NOT NULL,
  price DECIMAL (10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Necklace", "Accessories", 50, 2),
	   ("TV", "Electronics", 300, 10),
       ("iPhone", "Electronics", 950, 20),
       ("Rice Cooker","Kitchen", 50, 5),
       ("Computer Chair", "Furniture", 100, 3),
       ("Funko Pop", "Toys", 10, 17),
       ("Earrings", "Accessories", 25, 7),
       ("Jigsaw Puzzle", "Toys", 18, 12),
       ("BluRay Player", "Electronics", 35, 21),
       ("Scarf", "Accessories", 15, 6)
