import React from "react";
import demoVideo from "../assets/demo.mp4";

import { useState } from "react";

const comments = [
  {
    id: 1,
    name: "John Doe",
    image: "https://i.pravatar.cc/50?img=12",
    time: "2 min ago",
    text: "This lecture was really informative. I understood everything clearly.",
  },
  {
    id: 2,
    name: "Emily",
    image: "https://i.pravatar.cc/50?img=32",
    time: "5 min ago",
    text: "Amazing explanation. Looking forward to the next lecture.",
  },
];

export default function VideoPage() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="flex-1">

      {/* Video */}
      <div className="overflow-hidden rounded-xl border bg-white shadow">

        <video
          controls
          className="w-full aspect-video bg-black"
        >
          <source src={demoVideo} type="video/mp4" />
          Your browser does not support video.
        </video>

        {/* Tabs */}
        <div className="flex border-t">

          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 py-4 font-medium ${
              activeTab === "description"
                ? "border-b-2 border-pink-600 text-pink-600"
                : "text-gray-500"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 py-4 font-medium ${
              activeTab === "comments"
                ? "border-b-2 border-pink-600 text-pink-600"
                : "text-gray-500"
            }`}
          >
            Comments
          </button>

        </div>
      </div>

      {/* Description */}
      {activeTab === "description" && (
        <div className="mt-8 rounded-xl border bg-white p-6">

          <h2 className="text-2xl font-bold">
            Lecture Description
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            In this lecture we build the complete Text to Image SaaS
            application from scratch using React, Node.js, MongoDB,
            Express and TailwindCSS.
          </p>

        </div>
      )}

      {/* Comments */}
      {activeTab === "comments" && (
        <div className="mt-8">

          <h2 className="mb-6 text-2xl font-bold">
            Comments
          </h2>

          <div className="space-y-5">

            {comments.map((comment) => (

              <div
                key={comment.id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >

                <div className="flex items-center gap-3">

                  <img
                    src={comment.image}
                    className="h-12 w-12 rounded-full"
                  />

                  <div>

                    <h3 className="font-semibold">
                      {comment.name}
                    </h3>

                    <p className="text-xs text-gray-400">
                      {comment.time}
                    </p>

                  </div>

                </div>

                <p className="mt-4 text-gray-600">
                  {comment.text}
                </p>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}