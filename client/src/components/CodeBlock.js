import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AceEditor from 'react-ace';
import backgroundImage from '../assets/background.png';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-dracula';
import '../App.css';

const CodeBlockPage = () => {
  const { id } = useParams();
  const [text, setText] = useState('');
  const [ws, setWs] = useState(null);
  const [canSend, setCanSend] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/getCodeBlock/${id}`)
      .then(response => response.json())
      .then(data => setText(data.content))
      .catch(error => console.error('Error fetching code block:', error));
  }, [id]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3001/${id}`);

    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
    
        if (data.type === 'first-user') {
          setCanSend(false);
          alert(data.message);
        }
      } catch (e) {
        if (event.data instanceof Blob) {
          event.data.text().then((text) => {
            setText(text);
          });
        } else {
          setText(event.data);
        }
      }
    });
    
    setWs(socket);

    return () => {
      socket.close();
    };
  }, [id]);

  const handleTextChange = (newText) => {
    setText(newText);
    if (canSend) {
      ws.send(newText);
    }
  };

  const saveCodeBlock = () => {
    fetch(`${process.env.REACT_APP_API_URL}/saveCodeBlock/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert("Code block saved successfully!");
    })
    .catch(error => console.error('Error saving code block:', error));
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <h1>Code Block {id}</h1>
      <h2>Code:</h2>
      {canSend ? (
        <AceEditor
          mode="javascript"
          theme="dracula"
          onChange={handleTextChange}
          name="UNIQUE_ID_OF_DIV"
          value={text}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 1,
            useWorker: false,
            fontSize: "17pt"
          }}
          style={{ width: '100%', height: '400px', fontSize: '24px' }}
        />
      ) : (
        <AceEditor
          mode="javascript"
          theme="dracula"
          name="UNIQUE_ID_OF_DIV"
          value={text}
          readOnly={true}
          setOptions={{
            showLineNumbers: true,
            tabSize: 1,
            useWorker: false,
            fontSize: "17pt"
          }}
          style={{ width: '100%', height: '400px', fontSize: '24px' }}
        />
      )}
      <button className="btn btn-primary mt-3" onClick={saveCodeBlock}>Save</button>
    </div>
  );
};

export default CodeBlockPage;
