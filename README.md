# storefront
Amazon-like storefront using MySQL to take in orders from customers and deplete stock from the store's inventory. 

The products stored in the database are shown below:
    ![SQL Code]('./images/managerUpdateInventory1.png')

To start the application run enter 'node bamazonManager.js' in the commandline.

This application contains 2 views:
    1) Customer View 
    2) Manager View

Customer View
    1) Select an item from the store using the product ID and enter the number of units to purchase when prompted.

    ![SQL Code]('./images/customerViewPrompt.png')

    2) If the inventory is low and below 5 items the user receives the a prompt stating 'Insufficient quantity!', and then prevent the order from going through. If the inventory is not low the purchase goes through and the inventory is reduced by the quanity purchased.

    ![SQL Code]('./images/customerPurchaseLow.png')

    ![SQL Code]('./images/customerPurchase.png')
   

Manager View
    1) Select one of the following menu items
        - View Products for Sale: provides all the items in inventory
        - View Low Inventory: provides all items with an inventory count lower than five 
        - Add to Inventory: prompts the manager to add inventory for a specific product  
        - Add New Product: add a new product to the store inventory

    2) View Products for Sale

![Manager View - All products]('./images/managerAllProducts.png')

    3) View Low Inventory

![Manager View - Low Inventory]('./images/managerLowInventory.png')

    4) Add to Inventory

![Manager View - Low Inventory]('./images/managerUpdateInventory.png')

![Manager View - Low Inventory]('./images/managerUpdateInventory1.png')

    5) Add New Product

![Manager View - Add Product]('./images/managerAddProduct.png')




