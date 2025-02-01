# JIRA CLONE DOCUMENTATION

<img src="https://img.shields.io/github/stars/minhtrifit/jira-clone"/> ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/minhtrifit/jira-clone)

![Thumbnail](./showcase/thumbnail.png)

# 📋 Table of Contents

1. [Technical Stack](#technical-stack)
2. [Project Showcase](#project-showcase)
3. [Project Setup](#project-setup)
   1. [Firebase setup](#firebase-setup)
   2. [Source code setup](#source-code-setup)

## 📁 Technical Stack <a name="technical-stack"></a>

<p align="left"> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> </a> <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a> </p>

- [Next.js15](https://nextjs.org) - The React Framework for the Web
- [React.js](https://react.dev) - The library for web and native user interfaces
- [Shadcn UI](https://ui.shadcn.com) - Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
- [Tailwind CSS](https://tailwindcss.com) - Rapidly build modern websites without ever leaving your HTML
- [TypeScript](https://www.typescriptlang.org) - JavaScript with syntax for types.
- [Firebase](https://firebase.google.com) - Build & Run AI-Powered Apps.

## 🔮 Project Showcase <a name="project-showcase"></a>

- Login Screen

![login](showcase/login.png)

- Homepage

![Homepage](showcase/homepage.png)

- Workspace

![Workspace](showcase/workspace.png)

- Tasks Table

![Table](showcase/table.png)

- Tasks Kanban

![Kanban](showcase/kanban.png)

- Tasks Kanban

![Calendar](showcase/calendar.png)

## 💽 Project Setup <a name="project-setup"></a>

### 🔥 Firebase setup <a name="firebase-setup"></a>

- [This project use Firebase for some features (Click to see basic setup).](https://mydevpa.ge/blog/how-to-setup-firebase-firestore-with-nextjs-14)
- This project doesn't have server, so you can add your own data to Firebase for testing app manually.
- This project use [Firbase Admin SDK](https://firebase.google.com/docs/admin/setup/) so you need to generate private key from `console.firebase.google.com > Project settings > Service accounts > Firebase Admin SDK`

**Make sure that you have enabled following firebase services:**

- Firestore Database (Real time database).
- Authentication (This project default use email & password only).

**Error index firestore**

Some Firebase API with get error if you haven't created index of document for example at: `app/api/workspace/user/[id]/route.ts`

```javascript
const q = query(
  joinWorkspaceRef,
  where("userId", "==", id),
  orderBy("createdAt", "asc")
);
```

Just click a link error in your app console to direct to firebase.console and create it, for example:

![firebase-index](showcase/firebase-index.png)

### 📦 Source code setup <a name="source-code-setup"></a>

⚙️ Config [.env]() file in dir with path `.env`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MTF Note
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nabc=\n-----END PRIVATE KEY-----\n
NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL=
NEXT_PUBLIC_FIREBASE_WORKSPACE_COLLECTION=workspace-list
NEXT_PUBLIC_FIREBASE_WORKSPACE_JOIN_COLLECTION=workspace-join-list
NEXT_PUBLIC_FIREBASE_PROJECT_COLLECTION=project-list
NEXT_PUBLIC_FIREBASE_TASK_COLLECTION=task-list
NEXT_PUBLIC_FIREBASE_NOTIFICATION_COLLECTION=notification-list
```

📥 Installation packages:

Intall packages & dependencies (use --force tag to install conflict packages version, detail in **Conflict npm packages** topic).

```console
npm install --force
```

Or install packages with legacy peer dependencies.

```console
npm install --legacy-peer-deps
```

Run client project (supported by [Create Next App](https://nextjs.org/docs/getting-started/installation))

```console
npm run dev
```

## ▶️ YouTube Demo

[![Thumnail](./showcase/thumbnail.png)](https://youtu.be/ViMpU1KFOUM)

## 💌 Contact

- Author - [minhtrifit](https://minhtrifit-dev.vercel.app)
- [Github](https://github.com/minhtrifit)

> CopyRight© minhtrifit
