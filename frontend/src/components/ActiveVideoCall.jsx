import { useEffect, useRef } from "react";

function ActiveVideoCall({
	activeCall,
	setActiveCall,
	localVideo,
	remoteVideo,
	peerServer,
}) {
	const containerRef = useRef(null);

	useEffect(() => {
		function handleClick(event) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target)
			) {
				peerServer.close();
				localVideo.current.getTracks().forEach(function (track) {
					track.stop();
				});
				setActiveCall(!activeCall);
			}
		}
		document.addEventListener("mousedown", handleClick);

		return () => document.removeEventListener("mousedown", handleClick);
	}, [activeCall, setActiveCall, peerServer, localVideo]);

	return (
		<>
			{activeCall && (
				<div className="absolute size-full top-0 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl flex gap-5 flex-col items-center justify-center ">
					<div
						ref={containerRef}
						className="grid grid-cols-1 size-[80%] grid-rows-2 gap-3 bg-white p-10 rounded-2xl"
					>
						<video
							className="bg-gray-100 size-full rounded-2xl"
							ref={localVideo}
							autoPlay
							playsInline
							muted
						/>
						<video
							className="bg-gray-100 size-full rounded-2xl"
							ref={remoteVideo}
							autoPlay
							playsInline
							muted
						/>
						<button
							onClick={(e) => {
								e.preventDefault();
								peerServer.close();
								localVideo.current
									.getTracks()
									.forEach(function (track) {
										track.stop();
									});
								setActiveCall(false);
							}}
							className="w-full text-center bg-red-500 hover:bg-red-600 duration-300 cursor-pointer p-3 text-white rounded-2xl"
						>
							End Call
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default ActiveVideoCall;
