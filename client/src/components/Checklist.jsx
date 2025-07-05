import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './Checklist.css'

function Checklist() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const fetchItems = async () => {
    try {
      const res = await axios.get('/checklist');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch checklist:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!newItem.trim()) return;
    try {
      const res = await axios.post('/checklist', { text: newItem });
      setItems([res.data, ...items]);
      setNewItem('');
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.put(`/checklist/${id}`, { completed: !currentStatus });
      setItems(items.map(item => item._id === id ? res.data : item));
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/checklist/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  return (
    <div className="sea-checklist-wrapper">
  <div className="pond-art" />

  <div className="bubble-area">
    <h2 className="bubble-heading">things to flow with</h2>
    <div className="bubble-list">
      {items.map(item => (
        <div className="bubble" key={item._id}>
          <span onClick={() => toggleComplete(item._id, item.completed)} className={item.completed ? "done" : ""}>
            {item.text}
          </span>
          <button className="bubble-delete" onClick={() => deleteItem(item._id)}>✖</button>
        </div>
      ))}
    </div>
  </div>

  <div className="anchored-input-bar">
    <input
      type="text"
      placeholder="this month I want..."
      value={newItem}
      onChange={(e) => setNewItem(e.target.value)}
    />
    <button onClick={addItem}>Add</button>
  </div>
</div>


    // <div className="checklist-container">
    //   <h2>This Month, You’ve Got:</h2>

    //   <div className="checklist-input">
    //     <input
    //       type="text"
    //       value={newItem}
    //       onChange={(e) => setNewItem(e.target.value)}
    //       placeholder="Add a task..."
    //     />
    //     <button onClick={addItem}>Add</button>
    //   </div>

    //   <ul className="checklist-items">
    //     <h4>Click on the item to mark completed</h4>
    //     {items.map(item => (
    //       <li key={item._id} className="checklist-item">
    //         <span
    //           style={{
    //             textDecoration: item.completed ? 'line-through' : 'none',
    //             cursor: 'pointer'
    //           }}
    //           onClick={() => toggleComplete(item._id, item.completed)}
    //         >
    //           {item.text}
    //         </span>
    //         <button className="delete-btn" onClick={() => deleteItem(item._id)}>Delete</button>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
}

export default Checklist;
