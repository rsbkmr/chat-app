import { useEffect, useState } from "react";
import { socket } from "./socket";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const appendMessage = (message) => {
    console.log(message);
    setMessages((messages) => [...messages, message]);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    appendMessage(`You: ${message}`);
    socket.emit("send-chat-message", message);
    setMessage("");
  };

  useEffect(() => {
    const name = prompt("What is your name?");
    appendMessage("You joined");
    socket.emit("new-user", name);

    socket.on("chat-message", (data) => {
      appendMessage(`${data.name}: ${data.message}`);
    });

    socket.on("user-connected", (name) => {
      appendMessage(`${name} connected`);
    });

    socket.on("user-disconnected", (name) => {
      appendMessage(`${name} disconnected`);
    });
  }, []);

  return (
    <div className="App">
      <div id="message-container">
        {messages.map((item) => (
          <div>{item}</div>
        ))}
      </div>
      <form onSubmit={sendMessage} id="send-container">
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          type="text"
          id="message-input"
        />
        <button type="submit" id="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
