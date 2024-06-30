import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import AddItemModal from './AddItem';
import EditItemModal from './EditItem';
import ViewItemModal from './ViewItem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ItemList() {
    const [todo, setTodo] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [addingItem, setAddingItem] = useState(false);
    //const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState({
        search: "", type: "", priority: ""
    });

    useEffect(() => {
        fetchTodo();
    }, [searchTerm]);

    function fetchTodo() {

        axios.get(`https://localhost:7231/api/Item?search=${searchTerm.search}&priority=${searchTerm.priority}&type=${searchTerm.type}`)
            .then(res => {
                console.log(res);
                setTodo(res.data);
            })
            .catch(err => {
                if (err.response) {
                    console.error(err.response.data);
                    toast.error(err.response.data);
                }
                else {
                    toast.error("Somthing went wrong");
                }

            });
    }

    function deleteItem(id) {
        const res = window.confirm("Are you sure you want to delete?");
        if (res) {
            axios.delete(`https://localhost:7231/api/Item/${id}`)
                .then(() => {
                    setTodo(prevTodo => prevTodo.filter(item => item.itemId !== id));
                })
                .catch(err => {
                    if (err.response) {
                        console.error(err.response.data);
                        toast.error(err.response.data);
                    }
                    else {
                        toast.error("Somthing went wrong");
                    }

                });
        }
    }



    function clearSearch() {
        setSearchTerm({ search: "", type: "", priority: "" });

        //fetchTodo();
    }


    function editItem(item) {
        setEditingItem(item);
    }

    function viewItem(item) {
        setViewingItem(item);
    }

    function addItem() {
        setAddingItem(true);
    }

    function TypeFilter(e) {
        let type = e.target.value;
        console.log(type);

        axios.get(`https://localhost:7231/api/Item/type/${type}`)
            .then(res => {
                setTodo(res.data);
                console.table(res.data);
            })
            .catch(err => {
                if (err.response) {
                    console.error(err.response.data);
                    toast.error(err.response.data);
                }
                else {
                    toast.error("Somthing went wrong");
                }

            });

    }


    function handleEditSubmit(updatedItem) {
        // console.log(updatedItem);
        // console.log(`https://localhost:7231/api/Item/${updatedItem.itemId}`);
        axios.put(`https://localhost:7231/api/Item/${updatedItem.itemId}`, updatedItem)
            .then(() => {
                setTodo(prevTodo => prevTodo.map(item => (item.itemId === updatedItem.itemId ? updatedItem : item)));
                setEditingItem(null);
            })
            .catch(err => {
                if (err.response) {
                    console.error(err.response.data);
                    toast.error(err.response.data);
                }
                else {
                    toast.error("Somthing went wrong");
                }

            });
    }

    function handleAddSubmit(newItem) {
        axios.post("https://localhost:7231/api/Item", newItem)
            .then(res => {
                setTodo(prevTodo => [...prevTodo, res.data]);
                setAddingItem(false);
            })
            .catch(err => {
                console.error("Error adding item: ", err);
                //setError("Error adding item. Please try again later.");
            });
    }

    return (
        <div className="container">
            <ToastContainer></ToastContainer>
            <div className="card">

                <div className="card-body">

                    <div className="divbtn">
                        <div>
                            <button onClick={addItem} className="btn btn-success">Add New (+)</button>
                            {/* <input ></input>
                        <input ></input> */}
                        </div>
                        <div className="searchbox">
                            <label>Filter by Priority:</label>
                            <select name="PriorityFilter" value={searchTerm.priority} onChange={(e) => setSearchTerm({ ...searchTerm, priority: e.target.value })} className="form-control">
                                <option value="">All</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>

                            <label>Filter by Type:</label>
                            <select name="TypeFilter" value={searchTerm.type} onChange={(e) => setSearchTerm({ ...searchTerm, type: e.target.value })} className="form-control">
                                <option value="">All</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Search.."
                                value={searchTerm.search}
                                onChange={(e) => setSearchTerm({ ...searchTerm, search: e.target.value })}
                                className="form-control txtSearch"
                            />
                            {/* <button onClick={fetchTodo} className="btn btn-primary"><i className='fa fa-search'></i></button> */}
                            <button onClick={clearSearch} className="btn btn-secondary">Clear</button>
                        </div>
                    </div>

                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>Item Name</th>
                                <th>Item Description</th>
                                <th>Item Priority</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todo && todo.map((item, i) => (
                                <tr key={item.itemId}>
                                    <td>{i + 1}</td>
                                    <td>{item.itemName}</td>
                                    <td>{item.description}</td>
                                    <td>{item.priority}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <button onClick={() => viewItem(item)} className="btn btn-primary"><i className='fa fa-eye'></i></button>
                                        <button onClick={() => editItem(item)} className="btn btn-success"><i className='fa fa-pencil'></i></button>
                                        <button onClick={() => deleteItem(item.itemId)} className="btn btn-danger"><i className='fa fa-trash'></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {viewingItem && (
                <Modal onClose={() => setViewingItem(null)}>
                    <ViewItemModal item={viewingItem} onClose={() => setViewingItem(null)} />
                </Modal>
            )}
            {editingItem && (
                <Modal onClose={() => setEditingItem(null)}>
                    <EditItemModal item={editingItem} onSave={handleEditSubmit} onClose={() => setEditingItem(null)} />
                </Modal>
            )}
            {addingItem && (
                <Modal onClose={() => setAddingItem(false)}>
                    <AddItemModal onSave={handleAddSubmit} onClose={() => setAddingItem(false)} />
                </Modal>
            )}
        </div>
    );
}







export default ItemList;
