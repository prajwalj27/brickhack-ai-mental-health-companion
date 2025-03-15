import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";

import check from "@/assets/images/check.png";
import backgroundImg from "@/assets/images/background.png";
import leaves from "@/assets/images/leaves.png";
import logo from "@/assets/images/logo.png";

// export const baseURL = "http://192.168.56.26:8000"
export const baseURL = "http://192.168.0.102:8000";

export const images = {
  check,
  backgroundImg,
  leaves,
  logo
};

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
};

export const onboarding = [
  {
    id: 1,
    title: "Your AI-Powered Mental Health Companion",
    description:
      "Start your journey towards better mental well-being with AI-driven support tailored just for you.",
    image: "",
  },
  {
    id: 2,
    title: "Express Yourself with Journaling",
    description:
      "Track your thoughts and emotions effortlessly. Let the AI guide you towards self-reflection and growth.",
    image: "",
  },
  {
    id: 3,
    title: "Find Your Calm with Meditation",
    description:
      "Take a deep breath. Guided meditation sessions help you relax, focus, and feel more at peace.",
    image: "",
  },
  {
    id: 4,
    title: "AI That Understands You",
    description:
      "Not a Therapist, but your best friend, a companion, you can share your emotions with!",
    image: "",
  },
  {
    id: 5,
    title: "Your Wellness, Your Way",
    description:
      "From mood tracking to relaxation techniques, everything you need is right here. Let's begin your journey!",
    image: "",
  },
];

export const data = {
  onboarding,
};


// Dummy chat messages for styling purposes
export const dummyMessages = [
  {
    id: "1",
    sender: "user",
    text: "Hi there! I've been feeling stressed lately and need some advice on managing anxiety."
  },
  {
    id: "2",
    sender: "bot",
    text: "I'm sorry to hear you've been feeling stressed. Anxiety can be challenging to deal with. Have you tried any relaxation techniques like deep breathing or meditation?"
  },
  {
    id: "3",
    sender: "user",
    text: "I've tried deep breathing, but I find it hard to stick with a regular meditation practice."
  },
  {
    id: "4",
    sender: "bot",
    text: "That's understandable. Building a new habit takes time. You might start with just 2-3 minutes of meditation daily and gradually increase. There are also guided meditation apps that can help make it easier to get started."
  },
  {
    id: "5",
    sender: "user",
    text: "Any recommendations for beginner-friendly meditation apps?"
  },
  {
    id: "6",
    sender: "bot",
    text: "Several apps are great for beginners! Some popular options include Headspace, Calm, and Insight Timer. They offer short guided sessions specifically designed for people new to meditation. Would you like me to suggest some specific exercises that might help with anxiety?"
  },
  {
    id: "7",
    sender: "user",
    text: "Yes, that would be helpful. I also struggle with sleep due to racing thoughts at night."
  },
  {
    id: "8",
    sender: "bot",
    text: "For anxiety relief, try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8. For sleep issues, consider a body scan meditation before bed - it helps release physical tension. Also, limiting screen time an hour before sleep and creating a consistent bedtime routine can make a big difference."
  },
  {
    id: "9",
    sender: "user",
    text: "Thank you for these suggestions. I'll try implementing them this week."
  },
  {
    id: "10",
    sender: "bot",
    text: "You're welcome! Remember that progress takes time, so be patient with yourself. Would you like to check in next week to discuss how these techniques are working for you?"
  }
];