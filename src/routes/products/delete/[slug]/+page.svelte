<script lang='ts'>
	import { auth, db } from "$lib/firebase";
	import { deleteDoc, doc} from "firebase/firestore";
    import { FirebaseApp, User, Doc} from "sveltefire";
	import { goto } from "$app/navigation";
    export let data;
    async function deleteProduct(id) {
        if(confirm('You cannot recover the product. Are you sure?')) {
            deleteDoc(doc(db, "products", id))
            goto('/')
        }
    }
</script>
<FirebaseApp {auth} firestore={db}>
<User let:user>
    {#if user.uid === "FuRlL4aLp4amcrIK5y8cxNY5uBM2"}
    <Doc ref={`products/${data.id}`} let:data={product}>
       <div class='m-4 w-screen min-h-screen flex flex-col items-center'>
        <div class='w-full flex flex-col items-center p-4 rounded-2xl min-h-[calc(100vh-2rem)] md:bg-gray-100'>
            <div class='flex flex-wrap gap-2 my-2 w-full justify-center items-center'>
              <h1 class='font-display text-2xl text-green-800 text-center'>Delete<br/>{product.title}</h1>
            </div>
            <div class='flex flex-wrap gap-2 my-2 w-full justify-center'>
                <button on:click={()=>deleteProduct(data.id)} class='btn'>Delete</button>
            </div>
        </div>
        </div>
    </Doc>
    {/if}
</User>
</FirebaseApp>