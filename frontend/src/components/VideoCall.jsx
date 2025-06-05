import { PhoneIcon, PhoneSlashIcon } from "@phosphor-icons/react";
import Peer from "peerjs";
import { useEffect, useState } from "react";

function VideoCall({
	activeCall,
	socket,
	toClient,
	username,
	peerServer,
	setActiveCall,
	setupCall,
}) {
	const [peerId, setPeerId] = useState("");

	useEffect(() => {
		peerServer.current = new Peer();
		peerServer.current.on("open", (id) => {
			setPeerId(id);
		});
	}, [peerServer]);

	return (
		<button
			className={`flex items-center justify-center p-4 ${
				activeCall ? "bg-red-600" : "bg-blue-600"
			} rounded-xl cursor-pointer hover:bg-blue-800 duration-200 ring-2 ring-blue-400 text-white`}
			onClick={(e) => {
				e.preventDefault();
				if (!toClient || !username) {
					return;
				}
				socket.send(
					JSON.stringify({
						event: "start-call",
						message: peerId,
						to: toClient,
						sender: username,
					})
				);
				setupCall();
				setActiveCall(true);
			}}
		>
			{activeCall ? (
				<PhoneSlashIcon size={32} />
			) : (
				<PhoneIcon size={32} />
			)}
		</button>
	);
}

export default VideoCall;
