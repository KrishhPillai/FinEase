const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} = require("../config/firebase");

// Firestore imports
const {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} = require("firebase/firestore");
const auth = getAuth();
const db = getFirestore();

class FirebaseAuthController {
  async registerUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        email: "Email is required",
        password: "Password is required",
      });
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(auth.currentUser);

      // Add user to Users collection with the specified structure
      const userRef = doc(collection(db, "Users"), user.uid);
      await setDoc(userRef, {
        email: user.email,
        experience: null,
        investingquota: null,
        riskApettite: null,
      });

      // Create investments subcollection
      const investmentsRef = collection(userRef, "investments");

      res.status(201).json({
        message: "Verification email sent! User created successfully!",
      });
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.message || "An error occurred while registering user";
      res.status(500).json({ error: errorMessage });
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        email: "Email is required",
        password: "Password is required",
      });
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const idToken = userCredential._tokenResponse.idToken;
      if (idToken) {
        res.cookie("access_token", idToken, {
          httpOnly: true,
        });
        res
          .status(200)
          .json({ message: "User logged in successfully", userCredential });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.message || "An error occurred while logging in";
      res.status(500).json({ error: errorMessage });
    }
  }

  // Logout and other methods remain unchanged
  async logoutUser(req, res) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return res
          .status(400)
          .json({ message: "No user is currently logged in" });
      }

      await signOut(auth);
      res.clearCookie("access_token");
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async resetPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(422).json({
        email: "Email is required",
      });
    }

    try {
      await sendPasswordResetEmail(auth, email);
      res
        .status(200)
        .json({ message: "Password reset email sent successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async checkUserDetailsByEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const UsersCollection = collection(db, "Users");
      const querySnapshot = await getDocs(UsersCollection);

      // Look for the document with a matching email
      let userData = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === email) {
          userData = { ...data };
        }
      });

      // If no user found, return 404
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }

      // Extract required details
      const { experience, investingquota, riskApettite } = userData;

      // Construct response
      const response = {
        experience,
        investingquota,
        riskApettite,
        status: "Details retrieved successfully",
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while checking user details" });
    }
  }

  async updateUserDetails(req, res) {
    try {
      const { email, experience, investingquota, riskApettite } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Query Users collection for the user document based on email
      const UsersCollection = collection(db, "Users");
      const emailQuery = query(UsersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);

      if (querySnapshot.empty) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get user reference
      const userDoc = querySnapshot.docs[0];
      const userRef = userDoc.ref;

      // Prepare updated data
      const updatedData = {};
      if (experience !== undefined) updatedData.experience = experience;
      if (investingquota !== undefined)
        updatedData.investingquota = investingquota;
      if (riskApettite !== undefined) updatedData.riskApettite = riskApettite;

      // Update the document in Firestore
      await updateDoc(userRef, updatedData);

      res.status(200).json({
        message: "User details updated successfully",
        updatedData,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating user details" });
    }
  }
}

module.exports = new FirebaseAuthController();
