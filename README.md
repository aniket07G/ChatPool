# 🚀 Setup Instructions
This guide walks you through setting up the **ChatPool React Native project**, installing dependencies, and handling common issues.

---

## 📌 1️⃣ Create a New React Native Project
To set up the project, run the following command:

```sh
npx @react-native-community/cli init ChatPool
```

This will initialize a new React Native project named **ChatPool**.

Once the installation is complete, navigate into the project directory:

```sh
cd ChatPool
```

Then, start the development server and launch the app on an Android device or emulator:

```sh
npm run android
```

---

## 🔹 Troubleshooting Build Failures
If the build fails, try cleaning the Gradle cache and rebuilding the project:

```sh
cd android && gradlew clean
```

After cleaning, go back to the main project directory and rerun the build:

```sh
cd ..
npm run android
```

---

## 🔹 Ensure Node.js and npm Are Up to Date
Before proceeding, make sure that both **Node.js** and **npm** are up to date, as outdated versions may cause compatibility issues.

---
---
---

# 📦 Install Required Libraries

## 📌 Install React Native Vector Icons
React Native Vector Icons provides a set of customizable icons for use in your app.

To install it, run:

```sh
npm install react-native-vector-icons
```

### ⚠ Fix: Icons Not Displaying Correctly on Android
If the icons are not appearing as expected, you may need to manually link the fonts in your Android project:

1. Open the file:

```sh
android/app/build.gradle
```

2. Add the following line at the bottom of the file:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

3. Rebuild the project:

```sh
npm run android
```

---

## 📌 Install React Navigation (For Screen Transitions)
React Navigation is used for handling navigation between screens in React Native apps.

### 🔹 Step 1: Install Core Navigation Package
Run the following command to install the core navigation package:

```sh
npm install @react-navigation/native
```

### 🔹 Step 2: Install Required Dependencies
React Navigation requires additional dependencies to work properly:

```sh
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
```

### 🔹 Step 3: Install Native Stack Navigation (For Screen-Based Navigation)
To enable stack-based navigation, install:

```sh
npm install @react-navigation/native-stack
```

---

## 📌 Install AsyncStorage (For Persistent Data Storage)
AsyncStorage allows you to store small amounts of persistent data, such as user sessions and preferences.

To install it, run:

```sh
npm install @react-native-async-storage/async-storage
```

---  
---
---

# 🚀 How to Run the App
Follow these steps to run the MyKisan React Native app on your device or emulator.

## 📌 1️⃣ Start the Metro Bundler
Navigate to the project folder and start the Metro bundler:

```sh
cd ChatPool
npm start
```

This will start the development server.

---

## 📌 2️⃣ Run the App on Android
To launch the app on an Android emulator or physical device, run:

```sh
npm run android
```

### 🔹 Troubleshooting Build Issues
If the build fails, try cleaning the Gradle cache:

```sh
cd android && gradlew clean
```

Then return to the main project folder and run:

```sh
npm run android
```

Ensure your Android device or emulator is running and detected using:

```sh
adb devices
```

---

✅ **App is Now Running!** 🎉  
✅ **Now your React Native project is fully set up with navigation, icons, and persistent storage!** 🚀 

---
---
---

# App Structure and Standout Points  

### 📌 App Flow  

1. **Splash Screen**  
   - Displays briefly when the app launches.  
   - Redirects to **Username Setup Screen** if the user is opening the app for the first time.  
   - If the username is already set, redirects to **Room List Screen**.  

2. **Username Setup Screen**  
   - Users enter and confirm their username.  
   - Once completed, the app redirects to the **Room List Screen**.  

3. **Room List Screen**  
   - Displays a list of available chat rooms.  
   - Users can tap on a room to join it, leading to the **Chat Screen**.  
   - A **Create Room** button at the bottom allows users to create a new room.  
   - **Newly created rooms appear at the top of the list.**  
   - Users can **pull-to-refresh** to load the latest rooms and join newly created ones.  

4. **Create Room Screen**  
   - Users can create a new chat room.  
   - After creating a room, they are redirected to the **Chat Screen**.  
   - If they exit without creating a room, they return to the **Room List Screen**.  

5. **Chat Screen**  
   - Displays the room title in the header.  
   - Messages appear dynamically:  
     - Sent messages are aligned to the right.  
     - Received messages appear on the left.  
     - System messages (join/leave notifications) appear in the center.  
   - Users can send and receive messages in real time.  

### ⭐ Standout Features  

✅ **Persistent Login** – Users don’t need to set up their username every time they open the app.  
✅ **Real-Time Messaging** – Messages, joins, and leaves are instantly reflected in the chat.  
✅ **Dynamic UI & UX Enhancements** – 
   - Loading indicators ensure a smooth experience.  
   - UI feedback prevents frustration (e.g., disabling actions while loading).  
✅ **Error Handling** – Multiple edge cases are handled to improve app reliability.  
✅ **Join/Leave Notifications** – Users can see when others enter or leave the room.  
✅ **Username Display** – Messages show sender names for clear conversation context.  
✅ **Room Management** – Users can join, create, and switch rooms seamlessly.  
✅ **New Room Handling** –  
   - Newly created rooms are placed at the top of the list.  
   - **Pull-to-refresh** allows users to see and join newly created rooms easily.  

---

🚀 **Built with performance, usability, and real-time communication in mind!** 