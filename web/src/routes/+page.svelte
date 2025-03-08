<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/plugins/toolbar/prism-toolbar';
	import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
	import 'prismjs/components/prism-yaml';
	import 'prismjs/components/prism-bash';
	import 'prismjs/themes/prism-okaidia.css';
	import { onMount } from 'svelte';

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
			<p class="py-6">Install Kimbia using npm.</p>
			<pre><code class="language-bash" data-prismjs-copy="📋"
					>npm install -g @mistweaverco/kimbia</code
				></pre>
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
			<p class="py-6">Configure Kimbia using a simple configuration file (kimbia.yaml).</p>
			<pre><code class="language-yaml" data-prismjs-copy="📋"
					>yaml-language-server: $schema=https://kimbia.mwco.app/schema.json
---
tasks:
  - name: build
    description: Build the project
    commands:
      - platforms:
          - linux
          - mac
        run:
          - make build
      - platforms:
          - windows
        run:
          - build.bat

  - name: test
    description: Run the tests
    commands:
      - platforms:
          - linux
          - mac
          - windows
        run:
          - bun run test

  - name: deploy
    description: Deploy the project
    commands:
      - platforms:
          - linux
          - mac
          - windows
        run:
          - tofu deploy</code
				></pre>
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
			<pre><code class="language-bash" data-prismjs-copy="📋">kimbia run test build deploy</code
				></pre>
		</div>
	</div>
</div>
