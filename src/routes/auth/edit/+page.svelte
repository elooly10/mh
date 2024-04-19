<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { db as firestore, auth } from '$lib/firebase';
	import Logo from '$lib/logo.svelte';
	import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
	import { ArrowDown } from 'svelte-tabler';
	import Modal from '$lib/modal.svelte';
	import { FirebaseApp, User } from 'sveltefire';
	import Loading from '$lib/loading.svelte';
	let email, userName;
	async function editAccount() {
		if (browser) {
		if (userName) {
				updateProfile(auth.currentUser, {
					displayName: userName
				})
					.then(() => {
						window.location.href = '/';
					})
					.catch((error) => {
						const errorCode = error.code;
						const errorMessage = error.message;
						alert(`An error occurred \n${errorCode}\n${errorMessage}`);
					});
			} else {
				window.location.href = '/';
			}
		}
	}
	// function createUser() {
	// 	errorCode = 0;
	// 	if (!password) {
	// 		errorCode = 2;
	// 		return;
	// 	}
	// 	if (password.length < 6) {
	// 		errorCode = 5;
	// 		return;
	// 	}
	// 	if (!confirmPassword) {
	// 		errorCode = 4;
	// 		return;
	// 	}
	// 	if (!email) {
	// 		errorCode = 3;
	// 		return;
	// 	}
	// 	if (!userName) {
	// 		errorCode = 6;
	// 		return;
	// 	}
	// 	if (password != confirmPassword) {
	// 		errorCode = 1;
	// 		return;
	// 	}
	// 	if (browser) {
	// 		createUserWithEmailAndPassword(auth, email, password)
	// 			.then((userCredential) => {
	// 				signUp();
	// 			})
	// 			.catch((error) => {
	// 				const errorCode = error.code;
	// 				const errorMessage = error.message;
	// 				if (errorCode == 'auth/email-already-in-use') {
	// 					alert(
	// 						"You're already using that Email!\nTry signing in or using the forgot password flow."
	// 					);
	// 				} else if (errorCode == 'auth/invalid-email') {
	// 					alert('The email address is not valid.\nMake sure it you spelled it right.');
	// 				} else if (errorCode == 'auth/operation-not-allowed') {
	// 					alert('Operation not allowed.');
	// 				} else if (errorCode == 'auth/weak-password') {
	// 					alert('The password is too weak.');
	// 				} else {
	// 					alert(`An unknown error occurred \n${errorCode}\n${errorMessage}`);
	// 				}
	// 				// ...
	// 			});
	// 	}
	// }

	let show = false;
</script>

<FirebaseApp {firestore} {auth}>
	<User let:user>
		<div
			class="w-screen h-screen overflow-auto bg-cover bg-center flex items-center justify-center"
		>
			<div class="rounded-xl bg-white dark:bg-gray-800 bg-opacity-90 w-80 p-8 justify-center">
				{#if browser}
					<div class="flex w-full items-center justify-center"><Logo/></div>
					<h1 class="font-display text-center text-2xl md:text-3xl">Edit Account</h1>
					<div class="flex flex-col w-full">
						<!-- <label for="email" class="opacity-75 w-max">Email</label>
				<input
					id="email"
					bind:value={email}
					type="email"
					class="w-72 rounded border bg-white dark:bg-gray-600 border-black dark:border-white p-1"
					placeholder="bfranklin@example.com"
				/> -->
						<p class="text text-center w-full">
							Edit name for {user.displayName} <span class="text-md">({user.email})</span>
						</p>
						<label for="name" class="opacity-75 w-max mt-1">Name</label>
						<input
							id="name"
							bind:value={userName}
							type="text"
							class="w-full rounded border bg-white dark:bg-gray-600 border-black dark:border-white p-1 mb-2"
							placeholder={user.displayName}
						/>
						</div>
						<button
							on:click={() => editAccount()}
							class="p-2 w-full rounded bg-epsilon-700 font-bold text-white hover:bg-epsilon-800 focus:bg-epsilon-800 active:bg-epsilon-800"
							>Confirm Edit</button
						>
						<button
							on:click={() => {
								if (browser) window.location.href = '/';
							}}
							class="mt-2 p-2 w-full rounded bg-blue-700 font-bold text-white hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-800"
							>Back</button
						>
				{:else}
					<Loading />
				{/if}
			</div>
		</div>
	</User>
</FirebaseApp>
