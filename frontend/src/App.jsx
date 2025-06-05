"use strict";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import ClientID from "./components/ClientID";
import Input from "./components/Input";
import Messages from "./components/Messages";
import MessageInput from "./components/MessageInput";
import ActiveVideoCall from "./components/ActiveVideoCall";
import VideoCall from "./components/VideoCall";

// establish connection to the backend
const socket = new WebSocket("ws://localhost:3000/chat");

socket.onopen = () => {
	console.log("Connection established");
};

function App() {
	const [clientID, setClientID] = useState("");
	const [toClient, setToClient] = useState("");
	const [username, setUsername] = useState("");
	const [messages, setMessages] = useState([]);
	const [typing, setTyping] = useState(false);

	// Video Call Elements
	const [activeCall, setActiveCall] = useState(false);
	const peerServer = useRef(null);
	const call = useRef(null);

	const localVideo = useRef(null);
	const remoteVideo = useRef(null);

	const setupCall = useCallback(async () => {
		return navigator.mediaDevices
			.getUserMedia({
				audio: true,
				video: true,
			})
			.then((currentStream) => {
				if (localVideo.current)
					localVideo.current.srcObject = currentStream;
				return currentStream;
			})
			.catch((err) => {
				console.error(err);
				throw err;
			});
	}, []);

	const closeConnection = useCallback(() => {
		if (call.current) call.current.close();
		localVideo.current.srcObject.getTracks().forEach(function (track) {
			track.stop();
		});
		setActiveCall(false);
	}, [call, localVideo, setActiveCall]);

	useEffect(() => {
		let timeout;

		socket.onmessage = (event) => {
			const parsed_msg = JSON.parse(event.data);
			const mevent = parsed_msg.event;
			switch (mevent) {
				case "welcome":
					setClientID(parsed_msg.id);
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
				case "receive-call": {
					setActiveCall(true);
					setToClient(parsed_msg.from);
					setupCall()
						.then((currentStream) => {
							const currentCall = peerServer.current.call(
								parsed_msg.senderId,
								currentStream
							);
							call.current = currentCall;
							currentCall.on("stream", (remoteStream) => {
								if (remoteVideo.current)
									remoteVideo.current.srcObject =
										remoteStream;
							});
						})
						.catch((err) => {
							console.error(err);
						});
					break;
				}
				case "close-connection":
					closeConnection();
					break;
			}
		};

		return () => clearTimeout(timeout);
	}, [messages, typing, setupCall, closeConnection]);

	useEffect(() => {
		if (!peerServer.current) return;
		peerServer.current.on("call", (call) => {
			setupCall().then((currentStream) => {
				if (localVideo.current)
					localVideo.current.srcObject = currentStream;
				call.answer(currentStream);

				call.on("stream", (remoteStream) => {
					if (remoteVideo.current) {
						remoteVideo.current.srcObject = remoteStream;
					}
				});
			});
		});
	}, [setupCall]);

	return (
		<main className="w-full h-full flex flex-col items-center px-5 py-10">
			<div className="w-full max-w-250">
				<Header />
				<div className="flex flex-col gap-5 w-full ring-blue-100 mt-5 ring-2 rounded-2xl p-5">
					<ClientID id={clientID} />
					<div className="text-md p-4 rounded-2xl ring-2 ring-gray-200 bg-gray-100 cfont flex md:flex-row flex-col gap-5">
						<Input
							label={"My username"}
							text={username}
							setText={setUsername}
							placeholder={"@username"}
						/>
						<Input
							label={"Client ID"}
							text={toClient}
							setText={setToClient}
							placeholder={"client-id"}
						/>
						<VideoCall
							activeCall={activeCall}
							socket={socket}
							toClient={toClient}
							username={username}
							peerServer={peerServer}
							setActiveCall={setActiveCall}
							setupCall={setupCall}
						/>
					</div>
					<Messages
						messages={messages}
						username={username}
						typing={typing}
					/>
					<MessageInput
						toClient={toClient}
						clientID={clientID}
						setMessages={setMessages}
						messages={messages}
						username={username}
						socket={socket}
						setTyping={setTyping}
					/>
				</div>
			</div>
			<ActiveVideoCall
				activeCall={activeCall}
				localVideo={localVideo}
				remoteVideo={remoteVideo}
				closeConnection={closeConnection}
				socket={socket}
				toClient={toClient}
				clientID={clientID}
			/>
		</main>
	);
}

export default App;
