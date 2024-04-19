import { signOut as signAccountOut } from "firebase/auth";
import { auth } from "./firebase";
 export function signOut() {
    signAccountOut(auth)
		.then(() => {
			// Sign-out successful.
		})
		.catch((error) => {
			alert('An error happened when signing you out: \n' + error);
		});
}