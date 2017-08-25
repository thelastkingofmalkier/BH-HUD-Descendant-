namespace bh {
	var messenger: Messenger;
	export class Messenger {

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

		private updateActive(message: IMessage) {
			if (message.playerGuid !== message.action && message.sessionKey !== message.action) {
				if (!Messenger.ActivePlayerGuid || Messenger.ActivePlayerGuid !== message.playerGuid) Messenger.ActivePlayerGuid = message.playerGuid;
				if (!Messenger.ActiveSessionKey || Messenger.ActiveSessionKey !== message.sessionKey) Messenger.ActiveSessionKey = message.sessionKey;
			}
		}

		public constructor(private win: Window, private callbackfn: (message: IMessage) => void, private _targetWindow: Window = null) {
			window.addEventListener("message", (ev: BaseWindowMessage) => {
				var message: IMessage = ev.data || (ev.originalEvent && ev.originalEvent.data) || null;
				if (Messenger.isValidMessage(message)) {
					this.updateActive(message);
					this.callbackfn(message);
				}
			});
		}

		public postMessage(message: IMessage) {
			if (Messenger.isValidMessage(message)) {
				this.updateActive(message);
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
