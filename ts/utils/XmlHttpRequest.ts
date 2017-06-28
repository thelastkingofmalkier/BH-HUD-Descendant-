class XmlHttpRequest {
	public static DONE = XMLHttpRequest.DONE;
	public static HEADERS_RECEIVED = XMLHttpRequest.HEADERS_RECEIVED;
	public static LOADING = XMLHttpRequest.LOADING;
	public static OPENED = XMLHttpRequest.OPENED;
	public static UNSENT = XMLHttpRequest.UNSENT;

	private static original: typeof XMLHttpRequest;
	private static globalListeners: any[] = [];

	private xmlHttpRequest: XMLHttpRequest;
	public requestUrl: string;
	public method: string;

	public constructor() {
		var original = XmlHttpRequest.original || XMLHttpRequest;
		this.xmlHttpRequest = new original();
		XmlHttpRequest.globalListeners.forEach(args => {
			try {
				var sliced = args.slice(), fn = sliced[1];
				sliced[1] = (...evArgs: any[]) => {
					try {
						fn.apply(this, evArgs);
					}catch(e) {
						console.error("XmlHttpRequest: Firing Global EventListener", e);
					}
				};
				this.addEventListener.apply(this, sliced);
			}catch(ex) {
				console.error("XmlHttpRequest: Adding Global EventListeners", ex);
			}
		});
	}

	public get onabort(): (ev: any) => any { return this.xmlHttpRequest.onabort; }
	public set onabort(fn: (ev: any) => any) { this.xmlHttpRequest.onabort = fn; }
	public get onerror(): (ev: any) => any { return this.xmlHttpRequest.onerror; }
	public set onerror(fn: (ev: any) => any) { this.xmlHttpRequest.onerror = fn; }
	public get onload(): (ev: any) => any { return this.xmlHttpRequest.onload; }
	public set onload(fn: (ev: any) => any) { this.xmlHttpRequest.onload = fn; }
	public get onloadend(): (ev: any) => any { return this.xmlHttpRequest.onloadend; }
	public set onloadend(fn: (ev: any) => any) { this.xmlHttpRequest.onloadend = fn; }
	public get onloadstart(): (ev: any) => any { return this.xmlHttpRequest.onloadstart; }
	public set onloadstart(fn: (ev: any) => any) { this.xmlHttpRequest.onloadstart = fn; }
	public get onreadystatechange(): (ev: any) => any { return this.xmlHttpRequest.onreadystatechange; }
	public set onreadystatechange(fn: (ev: any) => any) { this.xmlHttpRequest.onreadystatechange = fn; }
	public get onprogress(): (ev: any) => any { return this.xmlHttpRequest.onprogress; }
	public set onprogress(fn: (ev: any) => any) { this.xmlHttpRequest.onprogress = fn; }
	public get ontimeout(): (ev: any) => any { return this.xmlHttpRequest.ontimeout; }
	public set ontimeout(fn: (ev: any) => any) { this.xmlHttpRequest.ontimeout = fn; }
	public get readyState(): number { return this.xmlHttpRequest.readyState; }
	public get response(): any { return this.xmlHttpRequest.response; }
	public responseFilter: any = null;
	public get responseJSON(): any {
		if (this.responseType == "json") {
			return this.xmlHttpRequest.response;
		}
		try {
			return JSON.parse(this.responseText);
		}catch(ex) {
			console.error("XmlHttpRequest.responseJSON", ex);
		}
	}
	public get responseText(): string {
		var responseType = this.responseType;
		if (responseType == "arraybuffer") {
			var contentType = this.getResponseHeader("Content-Type"),
				uaConstructor = contentType.match(/UTF\-32/i) ? Uint32Array : contentType.match(/UTF\-16/i) ? Uint16Array : Uint8Array;
			return XmlHttpRequest.arrayBufferToString(this.xmlHttpRequest.response, uaConstructor);
		}else if (responseType == "json") {
			return JSON.stringify(this.xmlHttpRequest.response);
		}else {
			return this.xmlHttpRequest.responseText;
		}
	}
	public get responseType(): string { return this.xmlHttpRequest.responseType; }
	public set responseType(type: string) { this.xmlHttpRequest.responseType = type; }
	public get responseXML(): string { return this.xmlHttpRequest.responseXML; }
	public get status(): number { return this.xmlHttpRequest.status; }
	public get statusText(): string { return this.xmlHttpRequest.statusText; }
	public get timeout(): number { return this.xmlHttpRequest.timeout; }
	public set timeout(value: number) { this.xmlHttpRequest.timeout = value; }
	public get withCredentials(): boolean { return this.xmlHttpRequest.withCredentials; }
	public set withCredentials(value: boolean) { this.xmlHttpRequest.withCredentials = value; }
	public get upload(): XMLHttpRequestUpload { return this.xmlHttpRequest.upload; }

	public abort() { this.xmlHttpRequest.abort(); }
	public addEventListener(...args: any[]) { this.xmlHttpRequest.addEventListener.apply(this.xmlHttpRequest, args); }
	public getAllResponseHeaders(): string { return this.xmlHttpRequest.getAllResponseHeaders(); }
	public getResponseHeader(header: string): string { return this.xmlHttpRequest.getResponseHeader(header); }
	public open(...args: any[]) { this.method = args[0] || ""; this.requestUrl = args[1] || ""; this.xmlHttpRequest.open.apply(this.xmlHttpRequest, args); }
	public overrideMimeType(mime: string) { this.xmlHttpRequest.overrideMimeType(mime); }
	public send(data: any) { this.xmlHttpRequest.send(data); }
	public setRequestHeader(header: string, value: string) { this.xmlHttpRequest.setRequestHeader(header, value); }

	public static addEventListener(...args: any[]) { XmlHttpRequest.globalListeners.push(args); }
	public static attach(win: any, listener?: any) {
		XmlHttpRequest.original = win.XMLHttpRequest;
		win.XMLHttpRequest = XmlHttpRequest;
		if (listener) {
			XmlHttpRequest.addEventListener("readystatechange", listener);
		}
	}

	public static uintArrayToString(uintArray: Uint8Array | Uint16Array | Uint32Array): string {
		try {
			var CHUNK_SZ = 0x8000, characters = [];
			for (var i = 0, l = uintArray.length; i < l; i += CHUNK_SZ) {
				characters.push(String.fromCharCode.apply(null, uintArray.subarray(i, i + CHUNK_SZ)));
			}
			return decodeURIComponent(escape(characters.join("")));
		}catch(ex) {
			console.error("XmlHttpRequest.uintArrayToString", ex);
		}
	}
	public static stringToUintArray(string: string, uintArrayConstructor?: Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor): Uint8Array | Uint16Array | Uint32Array {
		try {
			var encoded = unescape(encodeURIComponent(string)),
				charList = encoded.split(''),
				uintArray = [];
			for (var i = charList.length; i--;) {
				uintArray[i] = charList[i].charCodeAt(0);
			}
			return new uintArrayConstructor(uintArray);
		}catch(ex) {
			console.error("XmlHttpRequest.stringToUintArray", ex);
		}
	}
	public static arrayBufferToString(arrayBuffer: ArrayBuffer, uintArrayConstructor?: Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor): string {
		try {
			if (!uintArrayConstructor) {
				uintArrayConstructor = arrayBuffer instanceof Uint32Array ? Uint32Array : arrayBuffer instanceof Uint16Array ? Uint16Array : Uint8Array;
			}
			var uintArray = new uintArrayConstructor(arrayBuffer);
			return XmlHttpRequest.uintArrayToString(uintArray);
		}catch(ex) {
			console.error("XmlHttpRequest.arrayBufferToString", ex);
		}
		return null;
	}

	public static get(url: string): Promise<any> {
		return new Promise((res: (responseText: string) => void, rej: (reason: any) => void) => {
			var xhr = new XmlHttpRequest();
			xhr.addEventListener("readystatechange", () => {
				if (xhr.readyState == XmlHttpRequest.DONE) {
					res(xhr.responseText);
				}
			});
			xhr.open("GET", url, true);
			xhr.send(null);
		});
	}
	public static getJSON(url: string): Promise<any> {
		return new Promise((res: (responseText: string) => void, rej: (reason: any) => void) => {
			var xhr = new XmlHttpRequest();
			xhr.addEventListener("readystatechange", () => {
				if (xhr.readyState == XmlHttpRequest.DONE) {
					res(xhr.responseJSON);
				}
			});
			xhr.open("GET", url, true);
			xhr.send(null);
		});
	}
	public static post(url: string, data: string, contentType?: string): Promise<XmlHttpRequest> {
		return new Promise((res: (xhr: XmlHttpRequest) => void, rej: (reason: any) => void) => {
			var xhr = new XmlHttpRequest();
			xhr.addEventListener("readystatechange", () => {
				if (xhr.readyState == XmlHttpRequest.DONE) {
					res(xhr);
				}
			});
			xhr.open("POST", url, true);
			if (contentType) {
				xhr.setRequestHeader("Content-Type", contentType);
			}
			xhr.send(data);
		});
	}
}
