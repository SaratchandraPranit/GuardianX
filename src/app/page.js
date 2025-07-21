"use client";
import React from "react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedList } from "@/components/ui/animated-list";
import WorldMap from "@/components/ui/world-map";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Link from "next/link";
import Image from "next/image";

const files = [
  {
    name: "self-defense.pdf",
    body: "Essential self-defense techniques and strategies for personal safety.",
  },
  {
    name: "legal-rights.pdf",
    body: "Know your rights! A guide to women's legal protections and self-advocacy.",
  },
  {
    name: "emergency-contacts.xlsx",
    body: "List of helpline numbers, police, and trusted contacts for quick access.",
  },
  {
    name: "safe-routes.map",
    body: "Pre-mapped safe routes in your city with police stations and shelters marked.",
  },
  {
    name: "whistle-alarm.mp3",
    body: "A loud whistle sound to alert people nearby in case of danger.",
  },
];

let notifications = [
  {
    name: "Payment received",
    description: "Magic UI",
    time: "15m ago",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "New message",
    description: "Magic UI",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
];

const data = [
  {
    category: "Emergency SOS Alerts",
    title: "Instant Alerts for Your Safety",
    src: "/w1.png",
  },
  {
    category: "Travel Buddy",
    title: "Travel Safe with Trusted Companions",
    src: "/w2.png",
  },
  {
    category: "Community Forums",
    title: "Join a Supportive Community",
    src: "/w3.png",
  },

  {
    category: "Legal Aid Chatbot",
    title: "Get instant legal advice and support",
    src: "/w4.png",
  },
  // {
  //   category: "iOS",
  //   title: "Photography just got better.",
  //   src: "/2.jpg",
  // },
  // {
  //   category: "Hiring",
  //   title: "Hiring for a Staff Software Engineer",
  //   src: "/3.jpg",
  // },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white shadow-lg dark:bg-transparent dark:backdrop-blur-md dark:border dark:border-gray-600"
      )}>
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: color }}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

const features = [
  {
    name: "Safety Resources",
    description: "We automatically save your files as you type.",
    href: "#",
    cta: "Learn more",
    className: "col-span-2",
    background: (
      <Marquee pauseOnHover className="absolute top-10 [--duration:20s]">
        {files.map((f, idx) => (
          <figure
            key={idx}
            className="relative w-40 overflow-hidden rounded-xl border p-4">
            <figcaption className="text-sm font-medium dark:text-white">
              {f.name}
            </figcaption>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    name: "Notifications",
    description: "Get notified when something happens.",
    href: "#",
    cta: "Learn more",
    className: "col-span-2 portrait:hidden",
    background: (
      <div className="absolute portrait:hidden right-2 top-4 h-[300px] w-full overflow-hidden transition-all duration-300 ease-out">
        <AnimatedList>
          {notifications.map((item, idx) => (
            <Notification {...item} key={idx} />
          ))}
        </AnimatedList>
      </div>
    ),
  },
  {
    name: "Emergency SOS",
    description: "Instantly send alerts to emergency contacts.",
    href: "#",
    cta: "Learn more",
    className: "col-span-1 portrait:col-span-2",
    background: (
      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-red-500">
        🚨 SOS
      </div>
    ),
  },
  {
    name: "Live Location Sharing",
    description: "Share your real-time location with trusted contacts.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3",
    background: (
      <WorldMap
        dots={[
          {
            start: {
              lat: 64.2008,
              lng: -149.4937,
            }, // Alaska (Fairbanks)
            end: {
              lat: 34.0522,
              lng: -118.2437,
            }, // Los Angeles
          },
          {
            start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
            end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
          },
          {
            start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 28.6139, lng: 77.209 }, // New Delhi
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
        ]}
      />
    ),
  },
];

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl text-center portrait:max-w-[90vw] pl-8 text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Discover More
      </h2>
      <div className="landscape:-ms-12">
        <Carousel items={cards} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative  md:mt-0 min-h-screen w-full portrait:max-w-[95vw] bg-background">
      <section className="relative min-h-screen portrait:min-h-[60vh] flex flex-wrap items-center justify-start pb-24">
        <AnimatedGridPattern
          numSquares={50}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
        />

        <div className="container mt-16 md:mt-0  mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white">
            GuardianX : True independence starts with safety
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A technology-driven safety companion designed to empower women with
            real-time security features, community support, and legal
            assistance.
          </p>

          {/* Added container for buttons directly below the paragraph */}
          <div className="mt-8">
            <div className="flex justify-center gap-6 flex-wrap">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 text-lg">
                  Login as User
                </Button>
              </Link>
              <Link href="/wellwisherlogin">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-lg">
                  Login as Wellwisher
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px mx-auto px-8">
          <div className="flex portrait:flex-wrap items-start gap-16 flex-col md:flex-row">
            <div className="w-full md:w-2/3 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                Your <span className="text-red-500">Safety</span>, Your Power
              </h2>
              <p className="text-lg text-gray-600">
                The Women Safety App is an advanced platform that enhances
                security and confidence in public and private spaces. From
                emergency SOS alerts to real-time route tracking, GuardianX ensures
                help is always accessible.
              </p>
              <p className="text-lg text-gray-600">
                Join a supportive community, access legal resources, and
                leverage AI-powered tools to make your journey safer.
              </p>
              <div className="flex gap-6 flex-wrap">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-lg">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 text-lg">
                  <a
                    href="https://github.com/YadlaMani/GuardianX"
                    target="_blank"
                    rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center mt-8 md:mt-0">
              <div className="relative w-[290px] h-[300px] bg-white shadow-2xl rounded-3xl border-8 border-black overflow-hidden">
                <Image
                  src="/main.png"
                  alt="Women Safety App"
                  className="object-cover"
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 pb-4 bg-gray-50">
        <div className=" mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            Features That Keep You Safe
          </h2>
          <BentoGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>
      <section className="py-4 bg-gray-50">
        <div className=" mx-auto px-">
          <AppleCardsCarouselDemo />
        </div>
      </section>
    </div>
  );
}
