
declare global {
	interface Window {
		Notify: (type: string, message: string, time?: number) => void;
	}
}

function Notify(type: string, message: string, time?: number): void {
	const notification = document.createElement("div") as HTMLDivElement;
	notification.classList.add("notification");
	notification.classList.add(`notification-${type}`);
	notification.innerHTML = `<p>${message}</p>`;
	document.body.appendChild(notification);

	// Force a reflow to trigger animation
	void notification.offsetHeight;

	setTimeout(() => {
		notification.style.animation = `slideOutRight 0.3s ease-out forwards`;
		setTimeout(() => {
			notification.remove();
		}, 300);
	}, time || 5000);
}

window.Notify = Notify;