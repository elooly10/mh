<script lang='ts'>
	import { auth, db } from "$lib/firebase";
	import ProductCard from "$lib/productCard.svelte";
	import { Timestamp, addDoc, collection } from "firebase/firestore";
	import { FirebaseApp, User } from "sveltefire";
    import type { Product } from '$lib/types';
    import { superUID } from '$lib/super';
    let product: Product = {
        title: "",
        description: "",
        price: null,
        currency: "$",
        rating: null,
        tags: null,
        link: null,
        image: null,
        purchased: false,
        values: [],
        category: null,
    }
    async function createEntry() {
		//Save
		const documents = collection(db, `products`);
        if(!product.rating || !product.title || isNaN(Number(product.price)) || !product.link) {
            alert("Some fields are missing an entry");
            return;
        }
        product.price = Number(product.price)
        product.rating = Number(product.rating)
        if (product.tags) product.tags = product.tags.split(",").map((v: string) => v.trim().toLowerCase());
        else product.tags = [];
        product.createdAt = Timestamp.now()
		await addDoc(documents, product);
        alert('Added!')
    }
    let length = 0
    function addValue() {
        product.values.push({
            title: "Edit field title",
            type: "string",
            content: null
        })
        length++
    }
    function removeValue() {
        product.values.pop()
        length--
    }
    function setValues() {
        if(product.category === 'videogames') {
            product.values.push({
                title: "Console",
                type: "string",
                content: null
            })
            product.values.push({
                title: "Region",
                type: "string",
                content: null
            })
            product.values.push({
                title: "Style",
                type: "string",
                content: null
            })
            length+=3
        }
    }
</script>
<FirebaseApp {auth} firestore={db}>
    <User let:user>
    {#if user?.uid === superUID}
    <div class='flex w-screen h-screen p-2'>
    <div class='min-w-xs'>
        <h1 class='text-2xl font-display'>Create a new product</h1>
        <form on:submit|preventDefault={createEntry}>
            <div class='region'>
                <label for='title' class='label'>Product Title*:</label>
                <input name='title' class='input' placeholder="My Product" bind:value={product.title}>
            </div>
            <div class='region'>
                <label for='description' class='label'>Product Description:</label>
                <textarea name='description' class='border rounded max-w-xs px-2 py-1' bind:value={product.description}/>
            </div>
            <div class='region'>
                <label for='image' class='label'>Product Image URL:</label>
                <textarea name='image' class='border rounded max-w-xs px-2 py-1' bind:value={product.image}/>
            </div>
            <div class='region'>
                <label for='link' class='label'>Product Link*:</label>
                <input name='link' class='input' placeholder="https://example.com/" bind:value={product.link}>
            </div>
            <div class='region'>
                <label for='price' class='label'>Product Price*:</label>
                <input name='price' class='input' placeholder="9.99" bind:value={product.price}>
                <!-- TODO: Option for currency -->
            </div>
            <div class='region'>
                <label for='rating' class='label'>Product Rating (1-10)*:</label>
                <input name='rating' class='input' placeholder="10" min="0" max="10" bind:value={product.rating}>
            </div>
            <div class='region'>
                <label for='tags' class='label'>Product Tags (CSV):</label>
                <input name='tags' class='input' placeholder="Cool, Epic, Incredible" bind:value={product.tags}>
            </div>
            <div class='region'>
                <label for='category' class='label'>Category*:</label>
                <select name='category' class='input bg-transparent' placeholder="Category" bind:value={product.category} on:change={setValues}>
                    <option value="videogames">Video Games</option>
                    <option value="games">Games and Toys</option>
                    <option value="clothing">Clothing</option>
                    <option value="electronics">Electronics</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class='region'>
                <label for='values' class='label'>Additional Values <button on:click={addValue} type='button' class='p-2 bg-gray-200 border-r rounded-l my-2 border-r-gray-500'>+</button><button on:click={removeValue} class='p-2 bg-gray-200 border-l border-l-gray-500 rounded-r' type='button'>-</button></label>
                {#key length}
                {#each product.values as value, i}
                    <div class='region'>
                        <input name='{i}_label' class='label border max-w-xs mb-0.5 border-transparent hover:border-gray-400 rounded p-0.5' title="Additional Field {i} name" placeholder="field name"  bind:value={value.title}>
                        <!--TODO: Field Type -->
                        <input name='{i}_content' class='input' title="Additional Field {i} content" bind:value={value.content}>
                    </div>
                {/each}
                {/key}
            </div>
            <button type='submit' class='btn my-2'>Submit</button>
            <div class='label text-red-500'>*Required</div>
        </form>
    </div>
    <div class='flex-grow h-full flex items-center justify-center'>
        <div class="w-[40rem] h-48 shadow-xl bg-gray-200 rounded" style="transform: rotateY(-10deg) rotateZ(5deg)">
            <ProductCard {product}/>
        </div>
    </div>
    </div>
    {/if}
    </User>
</FirebaseApp>

<style lang="postcss">
    .region {
        @apply flex flex-col
    }
    .label {
        @apply text-sm opacity-70
    }
    .input {
        @apply border rounded p-2 max-w-xs h-8
    }
</style>