<script lang="ts">
    import type { Product } from '$lib/types';
    export let product: Product;
    export let id: string | null = product.id;
    export let superUser = false;
    import {
		Star,
		StarFilled,
        StarHalfFilled
	} from 'svelte-tabler';
</script>
<div class="w-full h-44 p-4 flex gap-4">
    <div class='w-20 md:w-40 h-20 md:h-40 flex-shrink-0'>
        <img src={product.image} class='h-20 md:h-40 max-w-20 md:max-w-40' alt={product.title}/>
    </div>
    <div class='flex flex-col gap-2 h-40 flex-grow'>
        <h2 class='font-bold md:text-xl'>{product.title}</h2>
        <p class='flex-grow text-sm md:text-base'>{product.description}</p>
        <div class='text-yellow-500 flex flex-wrap sm:grid sm:grid-cols-5 sm:w-24 md:w-auto md:flex md:flex-wrap md:gap-1'>
        {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as i}
            {#if product.rating >= i - 0.25}
                <StarFilled/>
            {:else if product.rating >= i - 0.75}
                <StarHalfFilled/>
            {:else}
                <Star/>
            {/if}
        {/each}
        </div>
        <div class='flex gap-2' id='extras'>
            <a href={`/products/purchase/${id}`} class='underline text-blue-600 text-sm'>Purchase</a>
            {#if superUser}
            <a href={`/products/delete/${id}`} class='underline text-sm text-gray-500'>Delete</a>
            {/if}
        </div>
    </div>
    <div class='flex flex-col gap-2 items-end flex-shrink-0 text-sm md:text-base'>
        {#key product.price}
            <h3 class='font-bold text-base md:text-lg text-right'>{product.currency}{Number(product.price).toFixed(2)}</h3>
            {#each product.values as value}
            <div>{value.title}: {value.content}</div>
            {/each}
        {/key}
    </div>
</div>