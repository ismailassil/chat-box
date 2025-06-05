function Messages({ messages, username, typing }) {
	return (
		<div className="relative min-h-120 max-h-120 overflow-scroll ring-2 ring-gray-200 rounded-xl p-5 flex flex-col gap-2 w-full justify-end">
			{messages.map((m, i) => {
				return (
					<div
						key={i}
						className={`flex flex-col ${
							m.sender === username ? "items-end" : "items-start"
						}`}
					>
						<div className="font-bold">
							{m.sender === username ? "Me" : m.sender}
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
	);
}

export default Messages;
