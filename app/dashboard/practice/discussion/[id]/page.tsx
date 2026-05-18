"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare, ThumbsUp, Flag, Send, Code2, ChevronDown,
  Pin, Award, ArrowLeft
} from "lucide-react";
import Link from "next/link";

const comments = [
  {
    id: 1,
    user: "Priya Nair",
    avatar: "PN",
    role: "Level 28 · Expert",
    text: "The key insight here is that a HashMap gives us O(1) lookup. Instead of iterating twice to check complement existence, store each element as you go: `map[val] = index`. When you encounter a number, check if `target - num` is already in the map.",
    code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement)!, i];
    map.set(nums[i], i);
  }
  return [];
}`,
    likes: 142,
    isPinned: true,
    time: "3 days ago",
  },
  {
    id: 2,
    user: "Arjun Mehta",
    avatar: "AM",
    role: "Level 21 · Intermediate",
    text: "Python one-liner approach using enumerate and in-operator check. Slightly less optimal but very clean for interviews:",
    code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i`,
    likes: 87,
    isPinned: false,
    time: "1 week ago",
  },
  {
    id: 3,
    user: "Rahul S.",
    avatar: "RS",
    role: "Level 14 · Beginner",
    text: "Can someone explain why the brute force O(n²) solution fails on large inputs? I submitted it and got TLE on test case 14. Is there a way to optimize it incrementally?",
    code: null,
    likes: 12,
    isPinned: false,
    time: "2 days ago",
  },
];

export default function ProblemDiscussionPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState("");

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link href="/dashboard/practice" className="flex items-center gap-2 text-neutral-600 hover:text-white text-[11px] uppercase tracking-widest font-bold mb-4 w-fit transition-colors group">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Practice
          </Link>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="font-headline font-black text-3xl text-white tracking-tight">Two Sum — Discussion</h1>
              <p className="text-neutral-500 text-sm mt-1">{comments.length} solutions & discussions · Arrays · Easy</p>
            </div>
          </div>
        </motion.div>

        {/* Sorting */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {["Top Rated", "Latest", "My Posts"].map((tab) => (
              <button key={tab} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/[0.06] text-neutral-500 hover:text-white bg-white/[0.02] hover:border-white/20 transition-all first:text-primary first:border-primary/20 first:bg-primary/5">
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-bold hover:text-white transition-colors">
            Sort by <ChevronDown size={12} />
          </button>
        </div>

        {/* Comments */}
        <div className="space-y-5 mb-10">
          {comments.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`bg-surface border rounded-2xl p-6 ${c.isPinned ? "border-primary/20 bg-primary/[0.02]" : "border-white/[0.06]"}`}
            >
              {/* Comment header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="text-[11px] font-black text-primary">{c.avatar}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm">{c.user}</p>
                      {c.isPinned && (
                        <span className="flex items-center gap-1 text-[9px] text-primary font-black uppercase tracking-widest bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                          <Pin size={8} /> Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600 text-[10px]">{c.role} · {c.time}</p>
                  </div>
                </div>
                <button className="text-neutral-700 hover:text-red-400 transition-colors">
                  <Flag size={13} />
                </button>
              </div>

              {/* Comment body */}
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">{c.text}</p>

              {/* Code block */}
              {c.code && (
                <div className="bg-black/40 border border-white/[0.06] rounded-xl p-5 mb-4 relative group">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 size={12} className="text-primary" />
                    <span className="text-[10px] text-neutral-600 font-mono font-bold uppercase tracking-widest">Solution Code</span>
                  </div>
                  <pre className="text-xs text-neutral-300 font-mono overflow-x-auto leading-relaxed">
                    <code>{c.code}</code>
                  </pre>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-5">
                <button className="flex items-center gap-1.5 text-neutral-500 hover:text-primary text-xs font-semibold transition-colors">
                  <ThumbsUp size={13} />
                  {c.likes}
                </button>
                <button className="text-neutral-600 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  Reply
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* New comment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-surface border border-white/[0.08] rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award size={14} className="text-primary" />
            <h3 className="text-white font-bold text-sm">Post your Solution or Discussion</h3>
          </div>
          <textarea
            rows={5}
            placeholder="Share your approach, code, or ask a question..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            suppressHydrationWarning
            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-5 py-4 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-primary/30 transition-all resize-none mb-4"
          />
          <div className="flex items-center justify-between">
            <p className="text-neutral-700 text-[11px]">Markdown and code blocks supported</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary hover:bg-primary-dark text-background px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all border border-white/10"
            >
              Post <Send size={12} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
