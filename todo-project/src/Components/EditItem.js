import { useState } from "react";


function EditItemModal({ item, onSave, onClose }) {
    const [formData, setFormData] = useState({ ...item });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <div>
            <h2>Edit Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group form-field">
                    <label className='text-left'>ID:</label>
                    <input type="text" required name="itemId" value={formData.itemId} readOnly className="form-control" />
                </div>
                <div className="form-group form-field">
                    <label>Item Name:</label>
                    <input type="text" required name="itemName" value={formData.itemName} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group form-field">
                    <label>Description:</label>
                    <input type="text" required name="description" value={formData.description} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group form-field">
                    <label>Priority:</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className="form-control">
                        <option value="0">Select</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="form-group form-field">
                    <label>Type:</label>
                    <div>
                        <label><input type="radio" name="type" value="Work" checked={formData.type === 'Work'} onChange={handleChange} /> Work</label>
                        <label><input type="radio" name="type" value="Personal" checked={formData.type === 'Personal'} onChange={handleChange} /> Personal</label>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
                <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            </form>
        </div>
    );
}

export default EditItemModal;