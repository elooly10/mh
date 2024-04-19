<script lang='ts'>
	import { auth, db } from "$lib/firebase";
	import { doc, getDoc, updateDoc } from "firebase/firestore";
	import { onMount } from "svelte";
    import { FirebaseApp, User, Doc} from "sveltefire";
	import { page } from '$app/stores';
	import { goto } from "$app/navigation";
    export let data;
    onMount(async ()=>{
        const docRef = doc(db, 'products', data.id);
		let docData = await getDoc(docRef);
			if (docData.exists() == true) {
					await updateDoc(docRef, {
                        purchased: true
					});
			} else {
				goto('/')
			}
    })
    type productType = {
        title: any,
        description: any,
        price: any,
        currency: any,
        rating: number | null,
        tags: string | any,
        link: any,
        image: string
        purchased: boolean,
        createdAt?: any,
        values: {
            title: string,
            type: "string" | "bool" | "int",
            content: any
        }[]
    };
    async function purchase() {
        //Do I even need this?
        alert("The item has been purchased.")
        goto('/')
    }
    async function removePurchase() {
        const docRef = doc(db, 'products', data.id);
        await updateDoc(docRef, {
            purchased: false
        });
        goto('/')
    }
</script>
<FirebaseApp {auth} firestore={db}>
<User let:user>
    <Doc ref={`products/${data.id}`} let:data={product} let:ref={reference}>
       <div class='m-4 w-full min-h-screen flex flex-col items-center'>
        <div class='max-w-prose flex flex-col items-center p-4 rounded-2xl min-h-[calc(100vh-2rem)] md:bg-gray-100'>
            <div class='flex flex-wrap gap-2 my-2 w-full justify-center items-center'>
                <img src='{product.image}' class='h-32' alt=''/><h1 class='font-display text-2xl text-green-800 text-center'>Purchase<br/>{product.title}</h1>
            </div>
            <ol>
                <li class='flex'><span class='w-8 h-8 m-2 p-2 text-xl flex items-center justify-center border border-gray-600'>1</span>
                   <span>First,  <a href={product.link} target="_blank" class='underline text-blue-600 w-max'>click here</a> below to open the website with the available product in a new tab. Keep the current tab open.</span>
                </li>
                <li class='flex'><span class='w-8 h-8 m-2 p-2 text-xl flex items-center justify-center border border-gray-600'>2</span>
                   <span>After you purchase the product, click the button below. If you have decided to not purchase the product, click that button instead. </span>
                </li>
                <div class='flex flex-wrap gap-2 my-2 w-full justify-center'>
                    <button on:click={purchase} class='btn'>I have purchased the product</button>
                    <button on:click={removePurchase} class='btn'>I have not purchased the product</button>
                </div>
            </ol>
        </div>
        </div>
    </Doc>
</User>
</FirebaseApp>