import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(-1); // To track which row is being edited
  const [newItem, setNewItem] = useState({
    customerName: '',
    email: '',
    productName: '',
    quantity: '',
    status: 'Pending'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://main--orderapi.netlify.app/.netlify/functions/api');
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = async (index) => {
    const updatedItem = data[index];
    try {
      await axios.put(`https://main--orderapi.netlify.app/.netlify/functions/api/${updatedItem._id}`, updatedItem);
      setEditIndex(-1);
    } catch (error) {
      console.error("Error updating the item", error);
      setError(error);
    }
  };

  const handleChange = (e, index, field) => {
    const updatedData = [...data];
    updatedData[index][field] = e.target.value;
    setData(updatedData);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://main--orderapi.netlify.app/.netlify/functions/api/${id}`);
      const updatedData = data.filter(item => item._id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting the item", error);
      setError(error);
    }
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'blue';
      case 'Shipped':
        return 'green';
      case 'Delivered':
        return 'purple';
      case 'Cancelled':
        return 'red';
      default:
        return 'black';
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://main--orderapi.netlify.app/.netlify/functions/api', newItem);
      setData(prevData => [...prevData, response.data]); // Update state with new data
      setNewItem({
        customerName: '',
        email: '',
        productName: '',
        quantity: '',
        status: 'Pending'
      });
    } catch (error) {
      console.error("Error adding the item", error);
      setError(error);
    }
  };

  const renderTableHeader = () => {
    const headers = ["Id", "Customer Name", "Email", "Product Name", "Quantity", "Status", "Operations"];
    return (
      <tr>
        {headers.map((header) => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    );
  };

  const renderTableRows = () => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item._id}</td>
        <td>
          {editIndex === index ? (
            <input
              type="text"
              value={item.customerName}
              onChange={(e) => handleChange(e, index, 'customerName')}
            />
          ) : (
            item.customerName
          )}
        </td>
        <td>
          {editIndex === index ? (
            <input
              type="email"
              value={item.email}
              onChange={(e) => handleChange(e, index, 'email')}
            />
          ) : (
            item.email
          )}
        </td>
        <td>
          {editIndex === index ? (
            <input
              type="text"
              value={item.productName}
              onChange={(e) => handleChange(e, index, 'productName')}
            />
          ) : (
            item.productName
          )}
        </td>
        <td>
          {editIndex === index ? (
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleChange(e, index, 'quantity')}
            />
          ) : (
            item.quantity
          )}
        </td>
        <td style={{ color: getStatusColor(item.status) }}>
          {editIndex === index ? (
            <input
              type="text"
              value={item.status}
              onChange={(e) => handleChange(e, index, 'status')}
            />
          ) : (
            item.status
          )}
        </td>
        <td>
          {editIndex === index ? (
            <button className='save-btn' onClick={() => handleSave(index)}>Save</button>
          ) : (
            <button className='edit-btn' onClick={() => handleEdit(index)}>Edit</button>
          )}
          <button className='delete-btn' onClick={() => handleDelete(item._id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container">
      <div className='form-container'>
      <h1>Order Status</h1>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={newItem.customerName}
          onChange={handleNewChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newItem.email}
          onChange={handleNewChange}
          required
        />
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={newItem.productName}
          onChange={handleNewChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={handleNewChange}
          required
        />
        <button className='addOrder-btn' type="submit">Add Order</button>
      </form>
      </div>
      <div className='table-container'>
      <table>
        <thead>
          {renderTableHeader()}
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default App;
