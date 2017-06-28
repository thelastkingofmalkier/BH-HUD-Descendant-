namespace bh {
	var messenger: Messenger;
	export class Messenger {
		private _targetWindow: Window;
		private get targetWindow() {
			if (!this._targetWindow) {
				if (isHud) {
					var iframe = <HTMLIFrameElement>$("#gameiframe")[0];
					this._targetWindow = iframe && iframe.contentWindow || null;
				}
				if (isListener) {
					this._targetWindow = this.win && this.win.parent || null;
				}
			}
			if (!this._targetWindow) {
				console.log("no target window: " + location.href);
			}
			return this._targetWindow;
		}
		private constructor(private win: Window, private callbackfn: (message: IMessage) => void) {
			window.addEventListener("message", (ev: BaseWindowMessage) => {
				var message: IMessage = ev.data || (ev.originalEvent && ev.originalEvent.data) || null;
				if (Messenger.isValidMessage(message)) {
					if (!Messenger.ActivePlayerGuid && message.action != message.playerGuid) Messenger.ActivePlayerGuid = message.playerGuid;
					if (!Messenger.ActiveSessionKey && message.action != message.sessionKey) Messenger.ActiveSessionKey = message.sessionKey;
					this.callbackfn(message);
				}
			});
		}
		public postMessage(message: IMessage) {
			if (Messenger.isValidMessage(message)) {
				if (!Messenger.ActivePlayerGuid && message.action != message.playerGuid) Messenger.ActivePlayerGuid = message.playerGuid;
				if (!Messenger.ActiveSessionKey && message.action != message.sessionKey) Messenger.ActiveSessionKey = message.sessionKey;
				this.targetWindow.postMessage(message, "*");
			}else {
				console.log(`invalid message: ${message && message.action || "[no message]"}`);
			}
		}
		public static isValidMessage(message: IMessage) {
			if (!message) { return false; }
			var keys = Object.keys(message);
			return keys.includes("action") && keys.includes("playerGuid") && keys.includes("sessionKey") && keys.includes("data");
		}

		public static ActivePlayerGuid: string;
		public static ActiveSessionKey: string;
		public static createMessage(action: string, data: any) {
			return <IMessage>{
				action: action,
				playerGuid: Messenger.ActivePlayerGuid,
				sessionKey: Messenger.ActiveSessionKey,
				data: data
			};
		}

		public static initialize(targetWindow: Window, callbackfn: (message: IMessage) => void) {
			return messenger = new Messenger(targetWindow, callbackfn);
		}
		public static get instance() { return messenger; }
	}
}
