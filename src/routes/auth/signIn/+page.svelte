<script lang="ts">
	import { auth } from '$lib/firebase';
	import Logo from '$lib/logo.svelte';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { explicitSymbolsForEmail, isIssue } from '../security';
	import { goto } from '$app/navigation';
	let errorCode: number, password: string, email: string;
	function signIn() {
		errorCode = 0;
		if (!password) {
			errorCode = 2;
			return;
		}
		if (!email) {
			errorCode = 3;
			return;
		}
		if (isIssue(email)) {
			errorCode = 7;
			return;
		}
		console.log('Signing in')
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log('Alert')
				// Signed in
				const user = userCredential.user;
				//console.log(userCredential);
				goto('/')
				// ...
			})
			.catch((error) => {
				//console.log(error);
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error(error);
				if (errorCode == 'auth/user-not-found') {
					alert("That email's not signed up!");
				} else if (errorCode == 'auth/invalid-email' || errorCode == 'auth/wrong-password' || errorCode == 'auth/invalid-credential') {
					alert('Wrong password or email. Make sure you spelled it right.');
					password = '';
				} else if (errorCode == 'auth/operation-not-allowed') {
					alert('Operation not allowed.');
				} else {
					alert(`An unknown error occurred \n${errorCode}\n${errorMessage}`);
				}
			});
	}
	console.log('Page Loaded')
</script>

<div
	class="w-screen h-screen overflow-auto bg-cover bg-center flex items-center justify-center"
>
	<div class="rounded-xl bg-white bg-opacity-90 w-80 p-8 justify-center">
		<div class='flex gap-4 items-center'>
			<Logo/>
			<h1 class="font-display text-center text-4xl md:text-5xl">Sign In</h1>
		</div>
			<div class="flex flex-col w-full">
				<label for="email" class="opacity-75 w-max">Email</label>
				<input
					id="email"
					bind:value={email}
					type="email"
					class="w-full rounded border bg-white border-black p-1"
					placeholder="bfranklin@example.com"
				/>
				<label for="password" class="opacity-75 w-max mt-1">Password</label>
				<input
					id="password"
					bind:value={password}
					type="password"
					class="w-full rounded border bg-white border-black p-1"
					placeholder="••••••••"
				/>
				<span
					class="h-8 items-center justify-center py-2 text-red-700 font-bold text-[0.71rem]"
					>{errorCode == 2
						? 'The password field is empty.'
						: errorCode == 3
						? 'The email field is empty.'
						: errorCode == 7
						? `Email can not include ${[
								explicitSymbolsForEmail.slice(0, 2).join(', '),
								explicitSymbolsForEmail[2]
						  ].join(', and ')}, as well as brackets.`
						: ''}</span
				>
				<button
					on:click={() => signIn()}
					class="p-2 w-full rounded bg-epsilon-700 font-bold text-white hover:bg-epsilon-800 focus:bg-epsilon-800 active:bg-epsilon-800"
					>Sign In</button
				>
				<div class="flex justify-between items-center">
					<a class="text-md hover:underline" href="/auth/forgot">Forgot password?</a>
					<div class='w-2 h-[2px] bg-black'/>
					<a class="text-md hover:underline" href="/auth/signUp">Need an account?</a>
				</div>
			</div>
	</div>
</div>
