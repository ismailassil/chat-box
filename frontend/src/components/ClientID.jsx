function ClientID({ id }) {
	return (
		<div className="text-md rounded-2xl ring-2 ring-gray-200 bg-gray-100 cfont flex flex-col md:flex-row justify-between items-center px-4 py-4">
			<div className="py-4">
				ClientID - <span className="break-words">{id}</span>
			</div>
			<button
				onClick={() => {
					navigator.clipboard.writeText(id);
				}}
				className="px-4 bg-green-500 cursor-pointer duration-300 text-white hover:bg-green-600 rounded-full py-2 w-full md:w-fit"
			>
				Copy
			</button>
		</div>
	);
}

export default ClientID;
