<script>
	import Logo from "$lib/logo.svelte";
    import {auth, db} from "$lib/firebase"
	import { Collection, FirebaseApp, User } from "sveltefire";
	import { signOut } from "$lib/signOut";
	import { collection, orderBy, query, where } from "firebase/firestore";
	import ProductCard from "$lib/productCard.svelte";
	import { superUID } from "$lib/super";
    let tags = null;
      $: queryOptions = (user) => {
		if (user.uid === "FuRlL4aLp4amcrIK5y8cxNY5uBM2") {
			const q = query(
				collection(db, `products`),
				orderBy('rating', 'desc'),
				orderBy('price', 'asc'),
			);
			return q;
		}
		else {
			const q = query(
				collection(db, `products`),
				orderBy('rating', 'desc'),
				orderBy('price', 'asc'),
                where('purchased', '==', false)
			);
            console.log(q);
			return q;
		}
	};
</script>
<FirebaseApp {auth} firestore={db}>
<div class="bg-green-600 text-white w-full h-max flex">
<Logo/>
<User let:user>
    <div class='flex gap-4 h-20 items-center ml-2' slot='signedOut'>
        <span>Hi!</span>
        <a class='btn' href='/auth/signIn'>Sign In</a>
        <a class='btn-base border hover:bg-gray-400 active:bg-gray-400 p-3 hover:bg-opacity-30 active:bg-opacity-70' href='/auth/signUp'>Sign Up</a>
    </div>
    <div class='flex gap-4 h-20 items-center ml-2' >
        <span>Hello, {user.displayName}!</span>
        <button class='btn-base border hover:bg-gray-400 active:bg-gray-400 p-3 hover:bg-opacity-30 active:bg-opacity-70' on:click={signOut}>Sign Out</button>
        {#if user.uid === superUID}
        <a href='/products/create' class='btn-blue'>Add another product</a>
        {/if}
    </div>
</User>
</div>
<User let:user>
<div class='flex flex-col items-center m-4' slot='signedOut'>
<h2 class='text-2xl font-display text-green-800'>Your aren't signed in!</h2>
    <div class='flex gap-4 h-20 items-center ml-2'>
        <a class='btn' href='/auth/signIn'>Sign In</a>
        <a class='btn-base border hover:bg-gray-400 active:bg-gray-400 p-3 hover:bg-opacity-30 active:bg-opacity-70' href='/auth/signUp'>Sign Up</a>
    </div>
</div>
<div class='w-full divide-y divide-gray-400'>
    <Collection ref={queryOptions(user)} startWith={false} let:data={products}>
    {#if products && Array.isArray(products) && products.length}
        {#each products as product}
        <div class='mx-2 my-2.5'>
            <ProductCard {product} id={product.id} superUser={user.uid===superUID}/>
        </div>
        {/each}
    {/if}
    </Collection>
</div>
</User>
</FirebaseApp>
