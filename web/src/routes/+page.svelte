<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/plugins/toolbar/prism-toolbar';
	import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
	import 'prismjs/components/prism-yaml';
	import 'prismjs/components/prism-bash';
	import 'prismjs/themes/prism-okaidia.css';
	import { onMount } from 'svelte';

  let installUsing = "npm";

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
      <img src="/logo.svg" alt="Kimbia" class="w-64 mx-auto m-5" />
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
        <option value="npm" selected>npm</option>
        <option value="yarn">yarn</option>
        <option value="bun">bun</option>
        <option value="pnpm">pnpm</option>
      </select>
			<div class={installUsing === "npm" ? "": "hidden"}><pre><code class="language-bash" data-prismjs-copy="📋"
					>npm install -g @mistweaverco/kimbia</code
				></pre></div>
      <div class={installUsing === "yarn" ? "": "hidden"}><pre><code class="language-bash" data-prismjs-copy="📋"
      >yarn add --global @mistweaverco/kimbia</code
      ></pre></div>
      <div class={installUsing === "bun" ? "": "hidden"}><pre><code class="language-bash" data-prismjs-copy="📋"
      >bun install -g @mistweaverco/kimbia</code
      ></pre></div>
      <div class={installUsing === "pnpm" ? "": "hidden"}><pre><code class="language-bash" data-prismjs-copy="📋"
      >pnpm install -g @mistweaverco/kimbia</code
      ></pre></div>
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
			<p class="py-6">Configure Kimbia using a simple configuration file <code>kimbia.yaml</code>.</p>
			<pre><code class="language-bash" data-prismjs-copy="📋"
					>kimbia init</code
				></pre>
      <div role="alert" class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
      <pre><code class="language-bash" data-prismjs-copy="📋">kimbia run lint test build deploy</code
      ></pre>
      <p>
        <a href="#get-involved" on:click={handleAnchorClick}
        ><button class="btn btn-secondary mt-5">Get involved</button></a
        >
      </p>
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
          >github.com/mistweaverco/kimbia</a>
      </p>
		</div>
	</div>
</div>
