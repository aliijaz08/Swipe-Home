import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {

const dispatch = useDispatch();
const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try{
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name : result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL}),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
      console.log(result.user);
      console.log(data);
    } catch(error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full py-3 mt-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all shadow-md hover:shadow-lg uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      COntinue with Google
    </button>
  );
}

export default OAuth;
