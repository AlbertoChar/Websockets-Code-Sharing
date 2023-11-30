const express = require('express');
const http = require('http');
const expressWs = require('express-ws');
const WebSocket = require('ws');
require('dotenv').config();
const mongoose = require('mongoose');
const CodeBlock = require('./models/codeblock');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
expressWs(app, server);

const mongoDBUri = process.env.MONGODB_URI; // MongoDB URI from .env file

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'),
                          server.listen(3001, 
                          console.log('WebSocket server listening on http://localhost:3001')))
  .catch(err => console.error('MongoDB connection error:', err));

const wssMap = new Map();
const firstUserConfirmationDelay = 100; // delay in milliseconds
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cors());

// Endpoint to add code block to database
app.post('/addCodeBlock', async (req, res) => {
  try {
    const { code_block_title } = req.body;

    // Find the highest code_block_num and increment it
    const lastCodeBlock = await CodeBlock.findOne().sort('-code_block_num');
    const newCodeBlockNum = lastCodeBlock ? lastCodeBlock.code_block_num + 1 : 1;

    const newCodeBlock = new CodeBlock({
      code_block_num: newCodeBlockNum,
      code_block_title: code_block_title,
      content: ''
    });

    const savedCodeBlock = await newCodeBlock.save();
    res.status(201).json(savedCodeBlock);
  } catch (error) {
    console.error('Error adding code block:', error);
    res.status(500).send('Error adding code block');
  }
});

// Endpoint to update code block in the database
app.post('/saveCodeBlock/:code_block_num', async (req, res) => {
  const { code_block_num } = req.params;
  const { content } = req.body;

  try {
    const updatedCodeBlock = await CodeBlock.findOneAndUpdate(
      { code_block_num: parseInt(code_block_num) }, 
      { content },
      { new: true } // Return the updated document
    );

    if (!updatedCodeBlock) {
      return res.status(404).send('Code block not found');
    }

    res.status(200).json(updatedCodeBlock);
  } catch (error) {
    console.error('Error updating code block:', error);
    res.status(500).send('Error updating code block');
  }
});


// Endpoint to get code block from database
app.get('/getCodeBlock/:code_block_num', async (req, res) => {
  const { code_block_num } = req.params;

  try {
    const codeBlock = await CodeBlock.findOne({ code_block_num });
    res.status(200).json(codeBlock);
  } catch (error) {
    res.status(500).send('Error fetching code block');
  }
});

// Endpoint to get all code blocks from database
app.get('/getAllCodeBlocks', async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find({});
    res.status(200).json(codeBlocks);
  } catch (error) {
    console.error('Error fetching code blocks:', error);
    res.status(500).send('Error fetching code blocks');
  }
});

// Endpoint to delete code block from database
app.delete('/deleteCodeBlock/:code_block_num', async (req, res) => {
  const { code_block_num } = req.params;

  try {
    await CodeBlock.findOneAndDelete({ code_block_num });
    res.status(200).send('Code block deleted');
  } catch (error) {
    res.status(500).send('Error deleting code block');
  }
});

app.ws('/:code_block_num', (ws, req) => {
  const { code_block_num } = req.params;

  if (!wssMap.has(code_block_num)) {
    wssMap.set(code_block_num, new Set());
  }

  const wss = wssMap.get(code_block_num);
  ws.isFirstUser = false;  // Initially, not marked as the first user
  wss.add(ws);

  setTimeout(() => {
    // Confirm first user after a brief delay
    if (wss.size === 1) {
      ws.isFirstUser = true;
      ws.send(JSON.stringify({ type: 'first-user', message: 'You are the first user in the room (READ only)' }));
    }
  }, firstUserConfirmationDelay);

  ws.on('message', (message) => {
    if (!ws.isFirstUser) {
      wss.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });

  ws.on('close', () => {
    wss.delete(ws);
    console.log(`WebSocket connection closed for code block ${code_block_num}`);
  });

  console.log(`WebSocket connection opened for code block ${code_block_num}`);
});
