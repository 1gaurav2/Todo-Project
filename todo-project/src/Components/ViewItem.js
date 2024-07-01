function ViewItemModal({ item, onClose }) {
    return (
        <div>
            <h2>View Item</h2>
            {/* <p><strong>ID:</strong> {item.itemId}</p> */}
            <p><strong>Name:</strong> {item.itemName}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Priority:</strong> {item.priority}</p>
            <p><strong>Type:</strong> {item.type}</p>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
    );
}

export default ViewItemModal;