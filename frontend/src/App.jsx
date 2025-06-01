import { useEffect, useState } from "react";

// establish connection to the backend
const socket = new WebSocket("ws://localhost:3000/chat");

socket.onopen = () => {
	console.log("Connection established");
};

function App() {
	const [clientID, setClientID] = useState("");
	const [toClient, setToClient] = useState("");
	const [tempusername, setTempusername] = useState("");
	const [username, setUsername] = useState("");
	const [msg, setMsg] = useState("");
	const [messages, setMessages] = useState([]);
	const [typing, setTyping] = useState(false);

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

	useEffect(() => {
		let timeout;

		socket.onmessage = (event) => {
			const parsed_msg = JSON.parse(event.data);
			const mevent = parsed_msg.event;
			switch (mevent) {
				case "welcome":
					setClientID(parsed_msg.id);
					console.log(parsed_msg.message);
					break;
				case "private-message":
					setMessages([
						...messages,
						{
							sender: parsed_msg.sender,
							message: parsed_msg.message,
							time: new Date(),
						},
					]);
					setTyping(false);
					break;
				case "typing":
					setTyping(true);
					timeout = setTimeout(() => {
						setTyping(false);
					}, 1000);
					break;
			}
		};

		return () => clearTimeout(timeout);
	}, [messages, typing]);

	return (
		<main className="flex flex-col items-center px-5 py-10">
			<div className="w-full max-w-250">
				<div className="ring-5 ring-blue-200 bg-blue-600 text-white rounded-2xl w-full flex-1/2">
					<div className="text-2xl font-bold cfont uppercase p-5">
						Chat Box
					</div>
				</div>
				<div className="flex flex-col gap-5 w-full ring-blue-100 mt-5 ring-2 rounded-2xl p-5">
					<div className="text-md rounded-2xl ring-2 ring-gray-200 bg-gray-100 cfont flex flex-col md:flex-row justify-between items-center px-4 py-4">
						<div className="py-4">
							ClientID -{" "}
							<span className="break-words">{clientID}</span>
						</div>
						<button
							onClick={() => {
								navigator.clipboard.writeText(clientID);
							}}
							className="px-4 bg-green-500 cursor-pointer duration-300 text-white hover:bg-green-600 rounded-full py-2 w-full md:w-fit"
						>
							Copy
						</button>
					</div>
					<div className="text-md p-4 rounded-2xl ring-2 ring-gray-200 bg-gray-100 cfont flex md:flex-row flex-col gap-5">
						<div className="flex-1 flex flex-col gap-2">
							<div className="flex-nowrap">My Username</div>
							<div className="flex gap-2">
								<input
									type="text"
									className="ring-2 bg-gray-100 ring-black/20 w-full h-11 rounded-xl px-4"
									value={tempusername}
									placeholder="@username"
									onChange={(e) => {
										setTempusername(e.target.value);
									}}
								/>
								<button
									onClick={(e) => {
										e.preventDefault();
										if (
											tempusername &&
											tempusername.length > 1 &&
											tempusername[0] === "@"
										) {
											setUsername(tempusername);
											return;
										}
										setTempusername((prev) => "@" + prev);
										setUsername("@" + tempusername);
									}}
									className="bg-green-500 cursor-pointer hover:bg-green-700 duration-300 px-3 rounded-xl text-white"
								>
									Done
								</button>
							</div>
						</div>
						<div className="flex-1 flex flex-col gap-2">
							<div className="flex-nowrap">Connect to</div>
							<input
								type="text"
								placeholder="ClientID"
								className="ring-2 bg-gray-100 ring-black/20 w-full h-11 rounded-xl px-4"
								value={toClient}
								onChange={(e) => {
									setToClient(e.target.value);
								}}
							/>
						</div>
					</div>
					<div className="relative min-h-200 max-h-200 overflow-scroll ring-2 ring-gray-200 rounded-xl p-5 flex flex-col gap-2 w-full justify-end">
						{messages.map((m, i) => {
							return (
								<div
									key={i}
									className={`flex flex-col ${
										m.sender === username
											? "items-end"
											: "items-start"
									}`}
								>
									<div className="font-bold">
										{m.sender === username
											? "Me"
											: m.sender}
									</div>
									<div
										className={`py-2 px-5 rounded-br-2xl
										rounded-bl-2xl text-white w-fit text-lg
										${
											m.sender === username
												? "bg-green-500 rounded-tl-2xl"
												: "bg-blue-600 rounded-tr-2xl"
										}`}
									>
										{m.message}
									</div>
									<span className="font-light text-xs">
										{m.time.toLocaleString("en-US")}
									</span>
								</div>
							);
						})}
						{typing && (
							<div className="absolute ring-2 py-2 px-5 bg-blue-600 left-1/2 -translate-x-1/2 rounded-full text-white w-fit text-lg">
								<span className="animate-pulse">Typing...</span>
							</div>
						)}
					</div>
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
				</div>
			</div>
		</main>
	);
}

export default App;
