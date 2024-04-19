<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { db as firestore, auth } from '$lib/firebase';
	import {
		checkActionCode,
		applyActionCode,
		sendPasswordResetEmail,
		signInWithEmailAndPassword
	} from 'firebase/auth';
	import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
	let displayResetPasswordFlow = false;
	let show: boolean | string = false;
	let emailInput: string;
	let newPassword: string;
	let confirmNewPassword: string;
	let actionCode;
	function enableModal(error) {
		show = error;
	}
	function verifyPassword() {
		show = false;
		if (newPassword.length >= 6) {
			if (newPassword == confirmNewPassword) {
				verifyPasswordResetCode(auth, actionCode)
					.then((email) => {
						const accountEmail = email;
						// Save the new password.
						confirmPasswordReset(auth, actionCode, newPassword)
							.then((resp) => {
								signInWithEmailAndPassword(auth, email, newPassword).then((userCredential) => {
									// Signed in
									const user = userCredential.user;
									window.location.href = '/';
									// ...
								});
							})
							.catch((error) => {
								// Error occurred during confirmation. The code might have expired or the password is too weak.
								enableModal('Your request expired. Try to reset your password again.');
							});
					})
					.catch((error) => {
						// Invalid or expired action code. Ask user to try to reset the password again
						enableModal('Your request expired. Try to reset your password again.');
					});
			} else {
				enableModal('Your password and confirmed password did not match.');
			}
		} else {
			enableModal('Your password is too short.');
		}
	}
	let options: string[] = [];
	if (browser) {
		window.location.search.split('=').forEach((value) =>
			value.split('&').forEach((value2) => {
				options.push(value2);
			})
		);
		actionCode = options[3];
		const mode = options[1];
		switch (mode) {
			case 'resetPassword':
				// Display reset password handler and UI.
				displayResetPasswordFlow = true;
				break;
			case 'recoverEmail':
				// Display email recovery handler and UI.
				break;
			case 'verifyEmail':
				applyActionCode(auth, actionCode)
					.then((resp) => {
						window.location.href = 'https://' + $page.url.host;
					})
					.catch((error) => {});
				break;
			default:
			// Error: invalid mode.
		}
	}
</script>

<div class="bg-zinc-950 text-white flex flex-col min-h-screen w-full p-6 gap-2">
	{#if displayResetPasswordFlow}
		<h1 class="text-2xl font-black">Password Reset for {options[9]}</h1>
		<div class="w-max flex flex-col">
			<label for="password" class="w-full opacity-75">New Password</label>
			<input
				id="password"
				type="password"
				class="border border-white focus:border-zinc-200 focus:border-2 focus:ring-0 bg-zinc-800 text-white"
				bind:value={newPassword}
				autocomplete="new-password"
			/>
			<label for="password" class="w-full opacity-75 text-sm"
				>Must be longer than six characters</label
			>
		</div>
		<div class="w-max flex flex-col">
			<label for="confPassword" class="w-full opacity-75">Confirm New Password</label>
			<input
				id="confPassword"
				type="password"
				class="border border-white focus:border-zinc-200 focus:border-2 focus:ring-0 bg-zinc-800 text-white"
				bind:value={confirmNewPassword}
			/>
		</div>
		<button
			class="max-w-max mt-2 p-3 rounded bg-red-700 hover:bg-red-800 focus:bg-red-800 active:bg-red-900"
			on:click={() => verifyPassword()}>Change Password</button
		>
	{/if}
	{#if show}
		<div>
			<h1 class="text-red-500 text-2xl text-mono">{show}</h1>
			<a
				class="{show == 'Your request expired. Try to reset your password again.'
					? ''
					: 'hidden'} text-blue-600 underline"
				href="./forgot">Try Again?</a
			>
		</div>
	{/if}
</div>
