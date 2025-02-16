const express = require('express');
const http = require('http');
const {WebSocketServer} = require('ws');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.static('public'));

const sessions = new Map();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const { sessionId } = data;

        if (!sessionId || typeof sessionId !== 'string') {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid or missing sessionId'
            }));
            return;
        }

        switch (data.type) {
            case 'add_session':
                addSession(sessionId, ws);
                break;
            case 'start_session':
                startSession(sessionId, ws);
                break;
            case 'stop_session':
                stopSession(sessionId, ws);
                break;
            case 'delete_session':
                deleteSession(sessionId, ws);
                break;
            case 'restart_session':
                restartSession(sessionId, ws);
                break;
            case 'get_logs':
                fetchSessionLogs(sessionId, ws);
                break;
            default:
                ws.send(JSON.stringify({ type: 'error', message: 'Unknown command' }));
        }
    });
});

function addSession(sessionId, ws) {
    if (sessions.has(sessionId)) {
        ws.send(JSON.stringify({
            type: 'error',
            message: `Session ${sessionId} already exists`
        }));
        return;
    }

    const sessionDir = path.join(__dirname, sessionId);
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }

    sessions.set(sessionId, { process: null, status: 'stopped', ws });
    ws.send(JSON.stringify({ type: 'session_added', sessionId }));
}

function deleteSession(sessionId, ws) {
    if (!sessions.has(sessionId)) {
        ws.send(JSON.stringify({
            type: 'error',
            message: `Session ${sessionId} does not exist`
        }));
        return;
    }
   const session = sessions.get(sessionId);
    if (session.process) {
        session.process.kill();  // Menghentikan proses terkait sesi
        session.status = 'stopped';
    }
    sessions.delete(sessionId);
    exec(`pm2 delete session-${sessionId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    const sessionDir = path.join(__dirname, sessionId);
    if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
    }
    ws.send(JSON.stringify({
        type: 'session_deleted',
        sessionId
    }));
}

function startSession(sessionId, ws) {
    const session = sessions.get(sessionId);
    if (!session) {
        ws.send(JSON.stringify({ type: 'error', message: `Session ${sessionId} not found` }));
        return;
    }

    if (session.status === 'running') {
        ws.send(JSON.stringify({ type: 'error', message: `Session ${sessionId} is already running` }));
        return;
    }

    exec(`pm2 start index.js --name session-${sessionId} -- --pairing=${sessionId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
}

function stopSession(sessionId, ws) {
    const session = sessions.get(sessionId);
    if (!session) {
        ws.send(JSON.stringify({ type: 'error', message: `Session ${sessionId} not found` }));
        return;
    }

    const stopProcess = spawn('pm2', ['stop', `session-${sessionId}`], { shell: true });
    stopProcess.stdout.on('data', (data) => ws.send(JSON.stringify({ type: 'stop_output', data: data.toString() })));
    stopProcess.stderr.on('data', (data) => ws.send(JSON.stringify({ type: 'stop_error', data: data.toString() })));
    stopProcess.on('close', () => {
        session.status = 'stopped';
        ws.send(JSON.stringify({ type: 'stop_complete', sessionId }));
    });
}

function restartSession(sessionId, ws) {
    const session = sessions.get(sessionId);
    if (!session) {
        ws.send(JSON.stringify({ type: 'error', message: `Session ${sessionId} not found` }));
        return;
    }

    const restartProcess = spawn('pm2', ['restart', `session-${sessionId}`], { shell: true });
    restartProcess.stdout.on('data', (data) => ws.send(JSON.stringify({ type: 'restart_output', data: data.toString() })));
    restartProcess.stderr.on('data', (data) => ws.send(JSON.stringify({ type: 'restart_error', data: data.toString() })));
    restartProcess.on('close', () => {
        session.status = 'running';
        ws.send(JSON.stringify({ type: 'restart_complete', sessionId }));
    });
}

function fetchSessionLogs(sessionId, ws) {
    // Use PM2 logs for specific session
    const logsProcess = spawn('pm2', [
      'logs', 
      `session-${sessionId}`
    ], { 
      shell: true 
    });
  
    logsProcess.stdout.on('data', (data) => {
      console.log(`Logs Output for Session ${sessionId}:`, data.toString());
      ws.send(JSON.stringify({ 
        type: 'log_output', 
        data: data.toString() 
      }));
    });
  
    logsProcess.stderr.on('data', (data) => {
      console.error(`Logs Error for Session ${sessionId}:`, data.toString());
      ws.send(JSON.stringify({ 
        type: 'log_error', 
        data: data.toString() 
      }));
    });
  
    logsProcess.on('close', (code) => {
      console.log(`Logs Process for Session ${sessionId} exited with code ${code}`);
    });
  }

app.get('/sessions', (req, res) => {
    res.json(Array.from(sessions.keys()));
});

const PORT = 3030;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));