function Input({ label, placeholder, text, setText }) {
	return (
		<div className="flex-1 flex flex-col gap-2">
			<div className="flex-nowrap">{label}</div>
			<div className="flex gap-2">
				<input
					type="text"
					className="ring-2 bg-gray-100 ring-black/20 w-full h-11 rounded-xl px-4"
					value={text}
					placeholder={placeholder}
					onChange={(e) => {
						const input = e.target.value.replaceAll(" ", "");
						if (placeholder.includes("client")) {
							setText(input);
							return;
						}
						if (input.startsWith("@")) setText(input);
						else setText("@" + input);
					}}
				/>
			</div>
		</div>
	);
}

export default Input;
