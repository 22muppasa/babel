class WebSocketService {
    constructor() {
      this.socket = null;
      this.onMessageCallback = null;
    }
  
    connect() {
      this.socket = new WebSocket('ws://localhost:8000/ws/transcribe/');
      this.socket.onmessage = (event) => {
        if (this.onMessageCallback) {
          this.onMessageCallback(JSON.parse(event.data));
        }
      };
    }
  
    sendAudioChunk(audioChunk) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ audio_chunk: audioChunk }));
      }
    }
  
    setOnMessageCallback(callback) {
      this.onMessageCallback = callback;
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  
  export default new WebSocketService();