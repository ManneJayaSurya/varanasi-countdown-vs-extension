import * as vscode from 'vscode';

const viewType = 'varanasiCountdown.explorerView';

export function activate(context: vscode.ExtensionContext) {
	const provider = new VaranasiCountdownViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(viewType, provider)
	);
}

export function deactivate() {}

class VaranasiCountdownViewProvider implements vscode.WebviewViewProvider {
	private static readonly releaseDate = '2027-04-07T00:00:00+05:30';
	private webviewView: vscode.WebviewView | undefined;
	private refreshTimer: any;

	constructor(private readonly extensionUri: vscode.Uri) {}

	resolveWebviewView(webviewView: vscode.WebviewView): void {
		this.webviewView = webviewView;
		const mediaRoot = vscode.Uri.joinPath(this.extensionUri, 'media');

		webviewView.webview.options = {
			enableScripts: false,
			localResourceRoots: [mediaRoot]
		};

		this.render(webviewView);
		this.startRefreshTimer();

		webviewView.onDidDispose(() => {
			this.webviewView = undefined;
			this.stopRefreshTimer();
		});
	}

	private render(webviewView: vscode.WebviewView): void {
		const mediaRoot = vscode.Uri.joinPath(this.extensionUri, 'media');
		const gifUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'varanasi.gif'));
		const countdownText = getCountdownText(VaranasiCountdownViewProvider.releaseDate);

		webviewView.webview.html = this.getHtml(webviewView.webview, gifUri, countdownText);
	}

	private startRefreshTimer(): void {
		if (this.refreshTimer) {
			return;
		}

		this.refreshTimer = setInterval(() => {
			if (!this.webviewView) {
				this.stopRefreshTimer();
				return;
			}

			this.render(this.webviewView);
		}, 60_000);
	}

	private stopRefreshTimer(): void {
		if (!this.refreshTimer) {
			return;
		}

		clearInterval(this.refreshTimer);
		this.refreshTimer = undefined;
	}

	private getHtml(webview: vscode.Webview, gifUri: vscode.Uri, countdownText: string): string {
		const nonce = getNonce();
		const csp = [
			"default-src 'none'",
			`img-src ${webview.cspSource}`,
			`style-src 'nonce-${nonce}'`
		].join('; ');

		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Security-Policy" content="${csp}">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Varanasi Countdown</title>
	<style nonce="${nonce}">
		:root {
			color-scheme: dark light;
		}

		body {
			margin: 0;
			padding: 12px;
			background: var(--vscode-sideBar-background);
			color: var(--vscode-sideBar-foreground);
			font-family: var(--vscode-font-family);
		}

		.figure {
			margin: 0;
			display: grid;
			gap: 10px;
		}

		.countdown {
			padding: 14px 12px;
			border-radius: 10px;
			background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(249, 115, 22, 0.08));
			border: 1px solid rgba(245, 158, 11, 0.25);
			text-align: center;
		}

		.countdown-label {
			margin: 0;
			font-size: 11px;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--vscode-descriptionForeground);
		}

		.countdown-value {
			margin: 6px 0 0;
			font-size: 24px;
			font-weight: 700;
			line-height: 1.15;
		}

		.countdown-release {
			margin: 6px 0 0;
			font-size: 12px;
			color: var(--vscode-descriptionForeground);
		}

		img {
			display: block;
			width: 100%;
			height: auto;
			border-radius: 8px;
			box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
		}

		figcaption {
			font-size: 12px;
			line-height: 1.4;
			color: var(--vscode-descriptionForeground);
			text-align: center;
		}
	</style>
</head>
<body>
	<figure class="figure">
		<div class="countdown" aria-live="polite">
			<p class="countdown-label">Release Countdown</p>
			<p class="countdown-value">${countdownText}</p>
			<p class="countdown-release">In theaters on 7 Apr 2027</p>
		</div>
		<img src="${gifUri}" alt="Varanasi countdown animation">
		<figcaption>Jai Babu.</figcaption>
	</figure>
</body>
</html>`;
	}
}

function getCountdownText(releaseDateText: string): string {
	const releaseDate = new Date(releaseDateText);
	const difference = releaseDate.getTime() - Date.now();

	if (difference <= 0) {
		return 'Released';
	}

	const days = Math.ceil(difference / 86_400_000);

	return formatTimePart(days, 'day');
}

function formatTimePart(value: number, label: string): string {
	return `${value} ${label}${value === 1 ? '' : 's'}`;
}

function getNonce(): string {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let value = '';

	for (let index = 0; index < 32; index += 1) {
		value += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}

	return value;
}
