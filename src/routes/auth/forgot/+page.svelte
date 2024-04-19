<script lang="ts">
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { browser } from '$app/environment';
	import { auth } from '$lib/firebase';
	import Logo from '$lib/logo.svelte';
	import Modal from '$lib/modal.svelte';
	import Loading from '$lib/loading.svelte';
	import { isIssue, explicitSymbolsForEmail as explicitSymbols } from '../security';
	let email: string = '',
		errorCode: number;
	let show = false;
	function sendEmail() {
		if (isIssue(email)) {
			alert(
				`Email can not include ${[explicitSymbols.slice(0, 3).join(', '), explicitSymbols[3]].join(
					', and '
				)}, as well as brackets.`
			);
		}
		if (email) {
			sendPasswordResetEmail(auth, email)
				.then(() => {
					show = true;
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					alert(errorCode + '\n' + errorMessage);
				});
		}
	}
</script>

<Modal bind:show>
	<h1 class="text-2xl font-medium">We've sent an Email to:</h1>
	<h2 class="text-xl">{email.toLowerCase()}</h2>
	<p>
		If you don't see an email, check your <code class="font-bold">spam</code> folder and try again.
	</p>
</Modal>
<div
	class="w-screen h-screen overflow-auto bg-cover bg-center flex items-center justify-center"
	style="background-image: url('/AuthBackground.svg');"
>
	<div class="rounded-xl bg-white dark:bg-gray-800 bg-opacity-90 w-80 p-8 justify-center">
		{#if browser}
			<div class='flex gap-4 items-center'>
				<Logo/>
				<h1 class="font-display text-center text-2xl md:text-3xl">Reset Password</h1>
			</div>
			<div class="flex flex-col w-full">
				<label for="email" class="opacity-75 w-max">Email</label>
				<input
					id="email"
					bind:value={email}
					type="email"
					class="w-full rounded border bg-white dark:bg-gray-600 border-black dark:border-white p-1"
					placeholder="bfranklin@example.com"
				/>
				<span
					class="h-8 items-center justify-center py-2 text-red-700 dark:text-red-400 font-bold text-[0.71rem]"
					>{errorCode == 2
						? 'You forgot to fill out the password field'
						: errorCode == 3
						? 'You forgot to fill out the email field'
						: errorCode == 4
						? 'You forgot to fill out the confirm password field'
						: ''}</span
				>
				<button
					on:click={() => sendEmail()}
					class="btn"
					>Reset Password</button
				>
				<a class="link link-gray text-md" href="/auth/signUp">Need an account?</a>
			</div>
		{:else}
			<Loading />
		{/if}
	</div>
</div>
