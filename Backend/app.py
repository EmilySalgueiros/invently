# First we need to import the Flask package

import flask

# Then we initialize a new Flask application
app = flask.Flask(__name__)

# Inventory data (this would ideally be stored in a database, but for now, it's an empty list)
inventory = []

# Define a route to get the current inventory using the GET method
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    # Return the inventory as a JSON response
    return flask.jsonify(inventory)

# Define a route to add an item to the inventory using the POST method
@app.route('/api/inventory', methods=['POST'])
def add_item():
    # Get the JSON data sent in the request
    data = flask.request.get_json()
    # Append the new item to the inventory list
    inventory.append(data)
    # Return a success message with HTTP status 201 (Created)
    return flask.jsonify({"message": "Item added successfully"}), 201

# Define a route to delete an item from the inventory using the DELETE method, based on its index
@app.route('/api/inventory/<int:index>', methods=['DELETE'])
def delete_item(index):
    # Check if the index is within the range of the inventory list
    if 0 <= index < len(inventory):
        # Remove the item from the list at the specified index
        inventory.pop(index)
        # Return a success message with HTTP status 200 (OK)
        return flask.jsonify({"message": "Item deleted successfully"}), 200
    # If the item is not found, return an error message with HTTP status 404 (Not Found)
    return flask.jsonify({"message": "Item not found"}), 404

# Run the Flask application in debug mode if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
