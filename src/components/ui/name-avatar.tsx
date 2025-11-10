"use client"

import React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

type NameAvatarProps = {
  fullName: string
  src?: string
  size?: number
}

const letterColors: Record<string, string> = {
  A: "#F44336",
  Ă: "#E91E63",
  Â: "#9C27B0",
  B: "#3F51B5",
  C: "#2196F3",
  D: "#03A9F4",
  Đ: "#00BCD4",
  E: "#009688",
  Ê: "#4CAF50",
  G: "#8BC34A",
  H: "#CDDC39",
  I: "#FFEB3B",
  K: "#FFC107",
  L: "#FF9800",
  M: "#FF5722",
  N: "#795548",
  O: "#9E9E9E",
  Ô: "#607D8B",
  Ơ: "#673AB7",
  P: "#3F51B5",
  Q: "#2196F3",
  R: "#00BCD4",
  S: "#009688",
  T: "#4CAF50",
  U: "#8BC34A",
  Ư: "#CDDC39",
  V: "#FFEB3B",
  X: "#FFC107",
  Y: "#FF9800",
}

function getFirstLetterOfLastName(fullName: string): string {
  if (!fullName) return "?"
  const parts = fullName.trim().split(/\s+/)
  const lastName = parts[parts.length - 1] || ""
  return lastName[0]?.toUpperCase() || "?"
}

export function NameAvatar({ fullName, src, size = 40 }: NameAvatarProps) {
  const letter = getFirstLetterOfLastName(fullName)
  const color = letterColors[letter] || "#9E9E9E"

  return (
    <Avatar
      style={{ width: size, height: size }}
      className="flex items-center justify-center"
    >
      {src ? (
        <AvatarImage src={src} alt={fullName} />
      ) : (
        <AvatarFallback
          style={{
            backgroundColor: color,
            color: "white",
            fontWeight: 600,
            fontSize: size / 2.2,
          }}
        >
          {letter}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
