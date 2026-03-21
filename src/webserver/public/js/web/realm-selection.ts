
function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

const token = getCookie('token');
if (!token) {

    window.location.href = '/';
}

let selectedServerId: string | null = null;
let servers: any[] = [];
const serverPings = new Map<string, number>();

async function measureServerPing(server: any): Promise<number | null> {
    try {
        const protocol = server.useSSL ? 'https' : 'http';
        const url = `${protocol}://${server.publicHost}:${server.wsPort}/ping`;

        const start = performance.now();
        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-cache',
            mode: 'cors'
        });

        if (response.ok) {
            const end = performance.now();
            const ping = Math.round(end - start);
            serverPings.set(server.id, ping);
            return ping;
        }
    } catch (error) {
        console.error(`Failed to ping server ${server.id}:`, error);
    }
    return null;
}

async function measureAllPings(): Promise<void> {

    const onlineServers = servers.filter(s => s.status !== 'offline');
    await Promise.all(onlineServers.map(server => measureServerPing(server)));
    renderServers();
}

async function loadServers(): Promise<void> {
    try {
        const loadingEl = document.getElementById('loading-message');
        if (loadingEl) {
            loadingEl.innerHTML = 'Loading available realms...';
        }

        const timestamp = Date.now();
        const response = await fetch(`/api/gateway/servers?t=${timestamp}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch servers');
        }

        const data = await response.json();
        servers = data.servers;
        serverPings.clear();

        renderServers();

        measureAllPings();
    } catch (error) {
        const loadingEl = document.getElementById('loading-message');
        if (loadingEl) {
            loadingEl.innerHTML =
                `<span style="color: #fca5a5;">Failed to load realms. Please try refreshing.</span>`;
        }
    }
}

function renderServers(): void {
    const realmList = document.getElementById('realm-list');
    if (!realmList) return;

    if (servers.length === 0) {
        realmList.innerHTML = '<div id="loading-message">No realms available. Please try again later.</div>';
        return;
    }

    realmList.innerHTML = servers.map(server => {
        const status = server.status;

        const subdomain = server.publicHost.split('.')[0];
        const realmName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

        let statusClass = 'healthy';
        let statusText = 'Online';

        if (status === 'offline') {
            statusClass = 'alert';
            statusText = 'Offline';
        } else if (status === 'full') {
            statusClass = 'degraded';
            statusText = 'Full';
        }

        const clientPing = serverPings.get(server.id);
        const latencyDisplay = clientPing !== undefined
            ? `${clientPing}ms`
            : (status === 'offline' ? 'offline' : '<span style="color: #6366f1;">measuring...</span>');

        return `
            <div class="realm-card ${status === 'offline' ? 'disabled' : ''}" data-server-id="${server.id}" ${status === 'offline' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                <div class="realm-header">
                    <div class="realm-name">${realmName}</div>
                    <div class="realm-right">
                        <div class="realm-status ${statusClass}">${statusText}</div>
                        <div class="realm-latency">${latencyDisplay}</div>
                    </div>
                </div>
                <div class="realm-metrics">
                    <div class="realm-metric">
                        <span class="realm-metric-label">Players:</span>
                        <span class="realm-metric-value">${server.activeConnections}/${server.maxConnections}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.realm-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.realm-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedServerId = (card as HTMLElement).dataset.serverId || null;
            const continueBtn = document.getElementById('continue-button') as HTMLButtonElement;
            if (continueBtn) continueBtn.disabled = false;
        });
    });
}

function continueToGame(serverId: string | null): void {
    if (serverId) {

        localStorage.setItem('selectedServerId', serverId);
    } else {

        localStorage.removeItem('selectedServerId');
    }
    window.location.href = '/game';
}

document.getElementById('continue-button')?.addEventListener('click', () => {
    continueToGame(selectedServerId);
});

document.getElementById('refresh-button')?.addEventListener('click', () => {
    loadServers();
});

loadServers();
