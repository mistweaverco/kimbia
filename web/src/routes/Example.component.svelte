<script lang="ts">
	export let yamlContents;
	export let jsonContents;
</script>

<div id="example" class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Example 🧐</h1>
			<p class="py-6">See this npm script example:</p>
			<pre><code class="language-json" data-toolbar-order="fullscreen-code">{jsonContents}</code
				></pre>
			<p class="py-6">And now see the equivalent Kimbia configuration file:</p>
			<pre><code class="language-yaml" data-toolbar-order="fullscreen-code">{yamlContents}</code
				></pre>
			<p class="py-6">Which one do you prefer, when it comes to readability and maintainability?</p>
			<p class="py-6">
				But also one crucial difference is that with Kimbia, you can run the same tasks on different
				platforms and architectures and it will automatically select the right command for you. See
				the the <a
					class="text-secondary"
					href="https://github.com/mistweaverco/kimbia/blob/main/.github/workflows/release.yaml"
					>Kimbia GitHub release workflow as an example</a
				>.
			</p>
		</div>
	</div>
</div>

<style>
	pre {
		max-height: 240px;
	}
</style>