<script lang="ts">
	let loading = true;
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { db as firestore, auth } from '$lib/firebase';
	import Logo from '$lib/logo.svelte';
	import {
		createUserWithEmailAndPassword,
		updateProfile,
		sendEmailVerification
	} from 'firebase/auth';
	import { Timestamp, addDoc, collection } from 'firebase/firestore';
	import { explicitSymbolsForEmail as explicitSymbols, isIssue } from '../security';
	import Loading from '$lib/loading.svelte';
	let errorCode, password, confirmPassword, email: string, userName, code: number;
	async function signUp() {
		if (browser) {
			updateProfile(auth.currentUser, {
				displayName: userName
			})
				.then(async () => {
					sendEmailVerification(auth.currentUser).then(() => {
						code = 1;
						alert("We have sent you an email verification")
						// Email verification sent!
						// ...
					});
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					alert(`An error occurred \n${errorCode}\n${errorMessage}`);
				});
		} else {
			alert(`An error occurred`);
		}
	}
	function createUser() {
		errorCode = 0;
		if (!password) {
			errorCode = 2;
			return;
		}
		if (password.length < 6) {
			errorCode = 5;
			return;
		}
		if (!confirmPassword) {
			errorCode = 4;
			return;
		}
		if (!email) {
			errorCode = 3;
			return;
		}
		if (!userName) {
			errorCode = 6;
			return;
		}
		if (password != confirmPassword) {
			errorCode = 1;
			confirmPassword = '';
			return;
		}
		if (isIssue(userName) || isIssue(email)) {
			errorCode = 7;
			return;
		}
		if (browser) {
			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					signUp();
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					if (errorCode == 'auth/email-already-in-use') {
						alert(
							"You're already using that Email!\nTry signing in or using the forgot password flow."
						);
					} else if (errorCode == 'auth/invalid-email') {
						alert('The email address is not valid.\nMake sure it you spelled it right.');
					} else if (errorCode == 'auth/operation-not-allowed') {
						alert('Operation not allowed.');
					} else if (errorCode == 'auth/weak-password') {
						alert('The password is too weak.');
					} else {
						alert(`An unknown error occurred \n${errorCode}\n${errorMessage}`);
					}
					// ...
				});
		}
	}
	
	loading = false;
</script>
<div
	class="w-screen h-screen overflow-auto bg-cover bg-center flex items-center justify-center bg-auth-background"
>
	<div class="rounded-xl bg-white bg-opacity-90 w-80 p-8 justify-center">
		{#if loading}
			<Loading />
		{:else if browser && code !== 1}
			<div class='flex gap-4 items-center'>
			<Logo/>
			<h1 class="font-display text-center text-3xl md:text-4xl">Sign Up</h1>
		</div>
			<div class="flex flex-col w-full">
				<label for="email" class="opacity-75 w-max">Email</label>
				<input
					id="email"
					bind:value={email}
					type="email"
					autocomplete="email"
					class="w-full rounded border bg-white border-black p-1"
					placeholder="bfranklin@example.com"
				/>
				<label for="password" class="opacity-75 w-max mt-1 -mb-1">Password</label>
				<span class="opacity-75 w-max text-sm">Must be longer then 6 characters</span>
				<input
					id="password"
					bind:value={password}
					type="password"
					autocomplete="new-password"
					class="w-full rounded border bg-white border-black p-1"
					placeholder="••••••••"
				/>
				<label for="confirm" class="opacity-75 w-max mt-1">Confirm Password</label>
				<input
					id="confirm"
					bind:value={confirmPassword}
					type="password"
					class="w-full rounded border bg-white border-black e p-1"
					placeholder="••••••••"
				/>
				<label for="name" class="opacity-75 w-max mt-1">Name</label>
				<input
					id="name"
					bind:value={userName}
					type="text"
					autocomplete="name"
					class="w-full rounded border bg-white border-black  p-1"
					placeholder="Ben"
				/>
				<span
					class="h-8 items-center justify-center py-2 text-red-700 font-bold text-[0.71rem]"
					>{errorCode == 1
						? 'The password and confirmed password fields did not match.'
						: errorCode == 2
						? 'The password field is empty.'
						: errorCode == 3
						? 'The email field is empty.'
						: errorCode == 4
						? 'The confirm password field is empty.'
						: errorCode == 5
						? 'Your password needs to be longer than six characters.'
						: errorCode == 6
						? 'The name field is empty.'
						: errorCode == 7
						? `Email and username can not include ${[
								explicitSymbols.slice(0, 3).join(', '),
								explicitSymbols[3]
						  ].join(', and ')}, as well as brackets.`
						: !!errorCode
						? 'An unexpected error occurred.'
						: ''}</span
				>
				<button
					on:click={() => createUser()}
					class="btn"
					>Sign Up!</button
				>
				<a class="text-md hover:underline" href="/auth/signIn">Have an account?</a>
			</div>
		{:else}
			<Loading />
		{/if}
	</div>
</div>
