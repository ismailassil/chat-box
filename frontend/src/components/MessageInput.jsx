import { useState } from "react";

function MessageInput({ toClient, clientID, setMessages, messages, username, socket, setTyping }) {
	const [msg, setMsg] = useState("");
	
	function handleKeyPress(e) {
		if (e.key === "Enter") {
			handleSend(e);
		}
	}
	function handleSend(e) {
		e.preventDefault();

		if (toClient === clientID) return;
		if (toClient && msg && username) {
			setMessages([
				...messages,
				{ sender: username, message: msg, time: new Date() },
			]);
			socket.send(
				JSON.stringify({
					event: "private-message",
					to: toClient,
					sender: username,
					message: msg,
				})
			);
		}
		setMsg("");
	}

	return (
		<div className="flex gap-3">
			<input
				onKeyDown={handleKeyPress}
				type="text"
				className="ring-2 bg-gray-100 ring-black/20 w-full h-11 rounded-xl px-4"
				value={msg}
				onChange={(e) => {
					setMsg(e.target.value);
					if (toClient) {
						setTyping(false);
						socket.send(
							JSON.stringify({
								event: "typing",
								sender: username,
								to: toClient,
							})
						);
					}
				}}
			/>
			<button
				className="px-10 ring-2 ring-blue-200 bg-blue-500 text-white rounded-xl duration-200
							hover:bg-blue-700 cursor-pointer"
				onClick={handleSend}
			>
				Send
			</button>
		</div>
	);
}

export default MessageInput;
