import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background.png';
import '../App.css';

const LobbyPage = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    fetch('${process.env.REACT_APP_API_URL}/getAllCodeBlocks')
      .then(response => response.json())
      .then(data => setCodeBlocks(data))
      .catch(error => console.error('Error fetching code blocks:', error));
  }, []);

  const addCodeBlock = () => {
    const blockName = window.prompt('Enter the name for the new Code Block:');
    if (blockName) {
      fetch('${process.env.REACT_APP_API_URL}/addCodeBlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_block_title: blockName })
      })
        .then(response => response.json())
        .then(newBlock => setCodeBlocks([...codeBlocks, newBlock]))
        .catch(error => console.error('Error adding code block:', error));
    } 
  };

  const deleteCodeBlock = (code_block_num) => {
    fetch(`${process.env.REACT_APP_API_URL}/deleteCodeBlock/${code_block_num}`, { method: 'DELETE' })
      .then(() => {
        const updatedCodeBlocks = codeBlocks.filter((block) => block.code_block_num !== code_block_num);
        setCodeBlocks(updatedCodeBlocks);
      })
      .catch(error => console.error('Error deleting code block:', error));
  };

  return (
    <div className="container mt-5" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <h1 className="mb-4">Choose Code Block</h1>
      <ul className="list-group">
        {codeBlocks.map((block) => (
          <li key={block.code_block_num} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={`/code-block/${block.code_block_num}`}>{block.code_block_title}</Link>
            <button className="btn btn-danger" onClick={() => deleteCodeBlock(block.code_block_num)}>Delete</button>
          </li>
        ))}
      </ul>

      <button className="btn btn-primary mt-3" onClick={addCodeBlock}>
        Add Code Block
      </button>
    </div>
  );
};

export default LobbyPage;
