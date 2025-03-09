<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/plugins/toolbar/prism-toolbar';
	import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
	import 'prismjs/components/prism-json';
	import 'prismjs/components/prism-yaml';
	import 'prismjs/components/prism-bash';
	import 'prismjs/components/prism-powershell';
	import 'prismjs/themes/prism-okaidia.css';
	import { onMount } from 'svelte';

	let installUsing = 'curl';

	const handleAnchorClick = (evt: Event) => {
		evt.preventDefault();
		const link = evt.currentTarget as HTMLAnchorElement;
		const anchorId = new URL(link.href).hash.replace('#', '');
		const anchor = document.getElementById(anchorId);
		window.scrollTo({
			top: anchor?.offsetTop,
			behavior: 'smooth'
		});
	};

	const onInstallUsingChange = (evt: Event) => {
		const select = evt.currentTarget as HTMLSelectElement;
		installUsing = select.value;
	};

	onMount(() => {
		document.title = 'Kimbia';
		Prism.highlightAll();
	});
</script>

<div id="start" class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<img src="/logo.svg" alt="Kimbia" class="m-5 mx-auto w-64" />
			<h1 class="text-5xl font-bold">Kimbia</h1>
			<p class="py-6">A minimal cross-platform task runner.</p>
			<a href="#install" on:click={handleAnchorClick}
				><button class="btn btn-primary">Get Started</button></a
			>
		</div>
	</div>
</div>
<div id="install" class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Install</h1>
			<p class="py-6">Install Kimbia using ...</p>
			<select on:input={onInstallUsingChange} class="select select-bordered">
				<option value="curl" selected>curl (linux/mac)</option>
				<option value="wget">wget (linux/mac)</option>
				<option value="pwsh">pwsh (windows)</option>
				<option value="npm">npm</option>
				<option value="yarn">yarn</option>
				<option value="bun">bun</option>
				<option value="pnpm">pnpm</option>
			</select>
			<div class={installUsing === 'curl' ? '' : 'hidden'}>
				<pre><code class="language-bash" data-prismjs-copy="📋"
				>curl -sSL https://kimbia.mwco.app/install.sh | bash</code
				></pre>
			</div>
			<div class={installUsing === 'wget' ? '' : 'hidden'}>
				<pre><code class="language-bash" data-prismjs-copy="📋"
				>wget -qO- https://kimbia.mwco.app/install.sh | bash</code
				></pre>
			</div>
			<div class={installUsing === 'pwsh' ? '' : 'hidden'}>
				<pre><code class="language-powershell" data-prismjs-copy="📋"
				>irm https://kimbia.mwco.app/install.ps1 | pwsh -c -</code
				></pre>
			</div>
			<div class={installUsing === 'npm' ? '' : 'hidden'}>
				<pre><code class="language-bash" data-prismjs-copy="📋"
						>npm install -g @mistweaverco/kimbia</code
					></pre>
			</div>
			<div class={installUsing === 'yarn' ? '' : 'hidden'}>
				<pre><code class="language-bash" data-prismjs-copy="📋"
						>yarn add --global @mistweaverco/kimbia</code
					></pre>
			</div>
			<div class={installUsing === 'bun' ? '' : 'hidden'}>
				<pre><code class="language-bash" data-prismjs-copy="📋"
						>bun install -g @mistweaverco/kimbia</code
					></pre>
			</div>
			<div class={installUsing === 'pnpm' ? '' : 'hidden'}>
				<pre><code class="language-bash" data-prismjs-copy="📋"
						>pnpm install -g @mistweaverco/kimbia</code
					></pre>
			</div>
			<p>
				<a href="#configure" on:click={handleAnchorClick}
					><button class="btn btn-primary mt-5">Configure</button></a
				>
			</p>
		</div>
	</div>
</div>
<div id="configure" class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Configure</h1>
			<p class="py-6">
				Configure Kimbia using a simple configuration file <code>kimbia.yaml</code>.
			</p>
			<pre><code class="language-bash" data-prismjs-copy="📋">kimbia init</code></pre>
			<div role="alert" class="alert alert-info">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-6 w-6 shrink-0 stroke-current"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<span>This will generate a default configuration file for you.</span>
			</div>
			<p>
				<a href="#usage" on:click={handleAnchorClick}
					><button class="btn btn-primary mt-5">Usage</button></a
				>
			</p>
		</div>
	</div>
</div>
<div id="usage" class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Usage</h1>
			<p class="py-6">Run Kimbia using the tasks defined in the configuration file.</p>
			<p class="py-6">
				If one task fails, Kimbia will stop the execution and return the error code.
			</p>
			<pre><code class="language-bash" data-prismjs-copy="📋"
					>kimbia run lint test build deploy</code
				></pre>
			<p>
				<a href="#why" on:click={handleAnchorClick}
					><button class="btn btn-secondary mt-5">Why?</button></a
				>
			</p>
		</div>
	</div>
</div>
<div id="why" class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Why?</h1>
			<p class="py-6">What are the benefits of using Kimbia?</p>
			<p class="py-6">
				You can use Kimbia to run a series of tasks like linting, testing, building, and deploying
				your application.
			</p>
			<p class="py-6">
				You could also use npm scripts, but Kimbia is easier to use and reason about.
			</p>
			<p>
				<a href="#example" on:click={handleAnchorClick}
					><button class="btn btn-secondary mt-5">See example</button></a
				>
			</p>
		</div>
	</div>
</div>
<div id="example" class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Example</h1>
			<p class="py-6">See this npm script example:</p>
			<pre><code class="language-json" data-prismjs-copy="📋"
					>&lbrace;
  "scripts": &lbrace;
    "dev": "concurrently --kill-others-on-fail \"sudo caddy run\" \"cd ../auth-platform/ && direnv allow && eval \\\"$(direnv export bash)\\\" && bun run dev -- --host --port 5000\" \"cd dwh-startpage/ && direnv allow && eval \\\"$(direnv export bash)\\\" && export PY_ENV=development && python3 -m gunicorn --bind :8002 --log-level info --workers 1 --threads 8 --timeout 0 app:server\" \"cd data-xplorer/ && direnv allow && eval \\\"$(direnv export bash)\\\" && export PY_ENV=development && python3 -m gunicorn --bind :8000 --log-level info --workers 1 --threads 8 --timeout 0 app:server\" \"cd ext-sales-report/ && direnv allow && eval \\\"$(direnv export bash)\\\" && export PY_ENV=development && streamlit run Forecasting.py\""
  &rbrace;,
  "devDependencies": &lbrace;
    "concurrently": "^8.0.0"
  &rbrace;
&rbrace;</code
				></pre>
			<p class="py-6">And now see the equivalent Kimbia configuration file:</p>
			<pre><code class="language-yaml" data-prismjs-copy="📋"
					>tasks:
  - name: dev
    description: Run the project in development mode
    commands:
      - platforms:
          - linux
          - mac
        parallel: true
        run:
          - sudo caddy run
          - |
            cd ../auth-platform/ && \
              direnv allow && \
              eval "$(direnv export bash)" && \
              bun run dev -- --host --port 5000
          - |
            cd dwh-startpage && \
              direnv allow && \
              eval "$(direnv export bash)" && \
              export PY_ENV=development && \
              python3 -m gunicorn --bind :8002 --log-level \
                info --workers 1 --threads 8 --timeout 0 app:server
          - |
            cd data-xplorer && \
              direnv allow && \
              eval "$(direnv export bash)" && \
              export PY_ENV=development && \
              python3 -m gunicorn --bind :8000 --log-level \
                info --workers 1 --threads 8 --timeout 0 app:server
          - |
            cd ext-sales-report && \
              direnv allow && \
              eval "$(direnv export bash)" && \
              export PY_ENV=development && \
              python3 -m streamlit run Forecasting.py</code
				></pre>
			<p class="py-6">Which one do you prefer, when it comes to readability and maintainability?</p>
		</div>
	</div>
</div>
<div id="get-involved" class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Get involved</h1>
			<p class="py-6">Kimbia is open-source and we welcome contributions.</p>
			<p>
				<a class="text-secondary" href="https://github.com/mistweaverco/kimbia" target="_blank"
					>github.com/mistweaverco/kimbia</a
				>
			</p>
		</div>
	</div>
</div>