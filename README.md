# Project for Moveo
# Real-Time Collaborative Code Editor
This repository hosts a full-stack web application enabling real-time collaborative code editing using web sockets. It's designed to bring developers together in a shared coding environment.

## Features

- Real-time collaboration on code editing.
- Syntax highlighting with Ace Editor.
- Backend with WebSocket for live interaction.
- Persistent storage of code blocks with MongoDB.
- Scalable server architecture using Express.js.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

```bash
node.js
npm or yarn
MongoDB

```

## Built With

React.js - The web framework used for the client
Express.js - Backend framework
MongoDB - Database
WebSocket - Used for real-time communication

## Code Blocks:

Inside code blocks the first user to enter will be classified as the "mentor":
He will have only reading rights for the content.
Every user connecting to the specific code block after the mentor will be classified as "student", he will be able to edit the code in the block.