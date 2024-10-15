import sys
import flask

app = flask.Flask(__name__)

# Inventory data (this would ideally be stored in a database)
inventory = []

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    return flask.jsonify(inventory)

@app.route('/api/inventory', methods=['POST'])
def add_item():
    data = flask.request.get_json()
    inventory.append(data)
    return flask.jsonify({"message": "Item added successfully"}), 201

@app.route('/api/inventory/<int:index>', methods=['DELETE'])
def delete_item(index):
    if 0 <= index < len(inventory):
        inventory.pop(index)
        return flask.jsonify({"message": "Item deleted successfully"}), 200
    return flask.jsonify({"message": "Item not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)